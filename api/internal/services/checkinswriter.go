package services

import (
	"context"
	"errors"

	"check-in/api/internal/dtos"
	"check-in/api/internal/models"
	"check-in/api/internal/repositories"

	"github.com/xdoubleu/essentia/pkg/database"
	errortools "github.com/xdoubleu/essentia/pkg/errors"
)

type CheckInWriterService struct {
	checkins  repositories.CheckInWriteRepository
	locations LocationService
	schools   SchoolService
}

func (service CheckInWriterService) GetAllSchoolsSortedByLocation(
	ctx context.Context,
	user *models.User,
) ([]*models.School, error) {
	location, err := service.locations.GetByUser(ctx, user)
	if err != nil {
		switch err {
		case database.ErrResourceNotFound:
			return nil, errortools.NewNotFoundError("location", user.Location.ID, "id")
		default:
			return nil, err
		}
	}

	return service.schools.GetAllSortedByLocation(ctx, location.ID)
}

func (service CheckInWriterService) Create(
	ctx context.Context,
	createCheckInDto *dtos.CreateCheckInDto,
	user *models.User,
) (*dtos.CheckInDto, error) {
	if v := createCheckInDto.Validate(); !v.Valid() {
		return nil, errortools.ErrFailedValidation
	}

	location, err := service.locations.GetByUser(ctx, user)
	if err != nil {
		return nil, err
	}

	school, err := service.schools.GetByID(
		ctx,
		createCheckInDto.SchoolID,
	)
	if err != nil {
		switch err {
		case database.ErrResourceNotFound:
			return nil, errortools.NewNotFoundError("school", createCheckInDto.SchoolID, "schoolId")
		default:
			return nil, err
		}
	}

	if location.Available <= 0 {
		return nil, errortools.NewBadRequestError(errors.New("location has no available spots"))
	}

	checkIn, err := service.checkins.Create(ctx, location, school)
	if err != nil {
		return nil, err
	}

	service.locations.NewCheckIn(*location)

	checkInDto := &dtos.CheckInDto{
		ID:         checkIn.ID,
		LocationID: checkIn.LocationID,
		SchoolName: school.Name,
		Capacity:   checkIn.Capacity,
		CreatedAt:  checkIn.CreatedAt,
	}

	return checkInDto, nil
}
