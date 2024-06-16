package main

import (
	"errors"
	"net/http"

	"github.com/XDoubleU/essentia/pkg/context_tools"
	"github.com/XDoubleU/essentia/pkg/http_tools"
	"github.com/julienschmidt/httprouter"

	"check-in/api/internal/dtos"
	"check-in/api/internal/models"
)

func (app *application) checkInsRoutes(router *httprouter.Router) {
	router.HandlerFunc(
		http.MethodGet,
		"/checkins/schools",
		app.authAccess(defaultRole, app.getSortedSchoolsHandler),
	)
	router.HandlerFunc(
		http.MethodPost,
		"/checkins",
		app.authAccess(defaultRole, app.createCheckInHandler),
	)
}

//	@Summary	Get all schools sorted based on checkins at location
//	@Tags		checkins
//	@Success	200	{object}	[]School
//	@Failure	401	{object}	ErrorDto
//	@Failure	500	{object}	ErrorDto
//	@Router		/checkins/schools [get]

func (app *application) getSortedSchoolsHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	user := context_tools.GetContextValue[*models.User](r, userContextKey)
	location, err := app.repositories.Locations.GetByUserID(r.Context(), user.ID)
	if err != nil {
		http_tools.ServerErrorResponse(w, r, err)
		return
	}

	schools, err := app.repositories.Schools.GetAllSortedByLocation(
		r.Context(),
		location.ID,
	)
	if err != nil {
		http_tools.ServerErrorResponse(w, r, err)
		return
	}

	err = http_tools.WriteJSON(w, http.StatusOK, schools, nil)
	if err != nil {
		http_tools.ServerErrorResponse(w, r, err)
	}
}

// @Summary	Create check-in at location of logged in user
// @Tags		checkins
// @Param		createCheckInDto	body		CreateCheckInDto	true	"CreateCheckInDto"
// @Success	201					{object}	CheckInDto
// @Failure	400					{object}	ErrorDto
// @Failure	401					{object}	ErrorDto
// @Failure	404					{object}	ErrorDto
// @Failure	500					{object}	ErrorDto
// @Router		/checkins [post].
func (app *application) createCheckInHandler(w http.ResponseWriter, r *http.Request) {
	var createCheckInDto dtos.CreateCheckInDto

	err := http_tools.ReadJSON(r.Body, &createCheckInDto)
	if err != nil {
		http_tools.BadRequestResponse(w, r, err)
		return
	}

	if v := createCheckInDto.Validate(); !v.Valid() {
		http_tools.FailedValidationResponse(w, r, v.Errors)
		return
	}

	user := context_tools.GetContextValue[*models.User](r, userContextKey)
	location, err := app.repositories.Locations.GetByUserID(r.Context(), user.ID)
	if err != nil {
		http_tools.ServerErrorResponse(w, r, err)
		return
	}

	school, err := app.repositories.Schools.GetByID(r.Context(), createCheckInDto.SchoolID)
	if err != nil {
		http_tools.NotFoundResponse(
			w,
			r,
			err,
			"school",
			createCheckInDto.SchoolID,
			"schoolId",
		)
		return
	}

	if location.Available <= 0 {
		http_tools.BadRequestResponse(w, r, errors.New("location has no available spots"))
		return
	}

	checkIn, err := app.repositories.CheckIns.Create(
		r.Context(),
		location,
		school,
	)
	if err != nil {
		http_tools.ServerErrorResponse(w, r, err)
		return
	}

	app.repositories.WebSockets.AddUpdateEvent(*location)

	checkInDto := dtos.CheckInDto{
		ID:         checkIn.ID,
		LocationID: checkIn.LocationID,
		SchoolName: school.Name,
		Capacity:   checkIn.Capacity,
		CreatedAt:  checkIn.CreatedAt,
	}

	err = http_tools.WriteJSON(w, http.StatusCreated, checkInDto, nil)
	if err != nil {
		http_tools.ServerErrorResponse(w, r, err)
	}
}
