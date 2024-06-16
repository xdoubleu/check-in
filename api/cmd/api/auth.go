package main

import (
	"errors"
	"net/http"

	"github.com/XDoubleU/essentia/pkg/context_tools"
	"github.com/XDoubleU/essentia/pkg/goroutine"
	"github.com/XDoubleU/essentia/pkg/http_tools"
	"github.com/julienschmidt/httprouter"

	"check-in/api/internal/config"
	"check-in/api/internal/dtos"
	"check-in/api/internal/models"
)

func (app *application) authRoutes(router *httprouter.Router) {
	router.HandlerFunc(http.MethodPost, "/auth/signin", app.signInHandler)
	router.HandlerFunc(
		http.MethodGet,
		"/auth/signout",
		app.authAccess(allRoles, app.signOutHandler),
	)
	router.HandlerFunc(
		http.MethodGet,
		"/auth/refresh",
		app.authRefresh(app.refreshHandler),
	)
}

// @Summary	Sign in a user
// @Tags		auth
// @Param		signInDto	body		SignInDto	true	"SignInDto"
// @Success	200			{object}	User
// @Failure	400			{object}	ErrorDto
// @Failure	401			{object}	ErrorDto
// @Failure	500			{object}	ErrorDto
// @Router		/auth/signin [post].
func (app *application) signInHandler(w http.ResponseWriter, r *http.Request) {
	var signInDto dtos.SignInDto

	err := http_tools.ReadJSON(r.Body, &signInDto)
	if err != nil {
		http_tools.BadRequestResponse(w, r, err)
		return
	}

	if v := signInDto.Validate(); !v.Valid() {
		http_tools.FailedValidationResponse(w, r, v.Errors)
		return
	}

	user, err := app.repositories.Users.GetByUsername(r.Context(), signInDto.Username)
	if err != nil {
		if errors.Is(err, http_tools.ErrRecordNotFound) {
			http_tools.UnauthorizedResponse(w, r, "Invalid Credentials")
		} else {
			http_tools.ServerErrorResponse(w, r, err)
		}

		return
	}

	match, _ := user.CompareHashAndPassword(signInDto.Password)
	if !match {
		http_tools.UnauthorizedResponse(w, r, "Invalid Credentials")
		return
	}

	secure := app.config.Env == config.ProdEnv
	accessTokenCookie, err := app.repositories.Auth.CreateCookie(
		r.Context(),
		models.AccessScope,
		user.ID,
		app.config.AccessExpiry,
		secure,
	)
	if err != nil {
		http_tools.ServerErrorResponse(w, r, err)
		return
	}

	http.SetCookie(w, accessTokenCookie)

	if user.Role != models.AdminRole && signInDto.RememberMe {
		var refreshTokenCookie *http.Cookie
		refreshTokenCookie, err = app.repositories.Auth.CreateCookie(
			r.Context(),
			models.RefreshScope,
			user.ID,
			app.config.RefreshExpiry,
			secure,
		)
		if err != nil {
			http_tools.ServerErrorResponse(w, r, err)
			return
		}

		http.SetCookie(w, refreshTokenCookie)
	}

	err = http_tools.WriteJSON(w, http.StatusOK, user, nil)
	if err != nil {
		http_tools.ServerErrorResponse(w, r, err)
	}
}

// @Summary	Sign out a user
// @Tags		auth
// @Success	200	{object}	nil
// @Failure	401	{object}	ErrorDto
// @Router		/auth/signout [get].
func (app *application) signOutHandler(w http.ResponseWriter, r *http.Request) {
	accessToken, _ := r.Cookie("accessToken")
	refreshToken, _ := r.Cookie("refreshToken")

	deleteAccessToken, err := app.repositories.Auth.DeleteCookie(
		models.AccessScope,
		accessToken.Value,
	)
	if err != nil {
		http_tools.ServerErrorResponse(w, r, err)
		return
	}

	http.SetCookie(w, deleteAccessToken)

	if refreshToken == nil {
		return
	}

	deleteRefreshToken, err := app.repositories.Auth.DeleteCookie(
		models.RefreshScope,
		refreshToken.Value,
	)
	if err != nil {
		http_tools.ServerErrorResponse(w, r, err)
		return
	}

	http.SetCookie(w, deleteRefreshToken)
}

// @Summary	Refresh access token
// @Tags		auth
// @Success	200	{object}	nil
// @Failure	401	{object}	ErrorDto
// @Failure	500	{object}	ErrorDto
// @Router		/auth/refresh [get].
func (app *application) refreshHandler(w http.ResponseWriter, r *http.Request) {
	user := context_tools.GetContextValue[*models.User](r, userContextKey)
	secure := app.config.Env == config.ProdEnv

	accessTokenCookie, err := app.repositories.Auth.CreateCookie(
		r.Context(),
		models.AccessScope,
		user.ID,
		app.config.AccessExpiry,
		secure,
	)
	if err != nil {
		http_tools.ServerErrorResponse(w, r, err)
		return
	}

	http.SetCookie(w, accessTokenCookie)

	refreshTokenCookie, err := app.repositories.Auth.CreateCookie(
		r.Context(),
		models.RefreshScope,
		user.ID,
		app.config.RefreshExpiry,
		secure,
	)
	if err != nil {
		http_tools.ServerErrorResponse(w, r, err)
		return
	}

	http.SetCookie(w, refreshTokenCookie)

	go func() {
		goroutine.SentryErrorHandler(
			"delete expired tokens",
			app.repositories.Auth.DeleteExpiredTokens,
		)
	}()
}
