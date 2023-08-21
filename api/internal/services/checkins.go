package services

import (
	"context"
	"time"

	"check-in/api/internal/database"
	"check-in/api/internal/models"
)

type CheckInService struct {
	db database.DB
}

func (service CheckInService) GetAllInRange(
	ctx context.Context,
	location *models.Location,
	startDate *time.Time,
	endDate *time.Time,
) ([]*models.CheckIn, error) {
	query := `
		SELECT id, school_id, capacity, (created_at AT TIME ZONE $4)
		FROM check_ins
		WHERE location_id = $1
		AND (created_at AT TIME ZONE $4) >= $2
		AND (created_at AT TIME ZONE $4) <= $3
	`

	rows, err := service.db.Query(
		ctx,
		query,
		location.ID,
		startDate,
		endDate,
		location.TimeZone,
	)
	if err != nil {
		return nil, handleError(err)
	}

	checkIns := []*models.CheckIn{}

	for rows.Next() {
		checkIn := models.CheckIn{
			LocationID: location.ID,
		}

		err = rows.Scan(
			&checkIn.ID,
			&checkIn.SchoolID,
			&checkIn.Capacity,
			&checkIn.CreatedAt,
		)

		if err != nil {
			return nil, handleError(err)
		}

		checkIns = append(checkIns, &checkIn)
	}

	if err = rows.Err(); err != nil {
		return nil, handleError(err)
	}

	return checkIns, nil
}

func (service CheckInService) GetByID(
	ctx context.Context,
	location *models.Location,
	id int64,
) (*models.CheckIn, error) {
	query := `
		SELECT school_id, capacity, created_at AT TIME ZONE $3
		FROM check_ins
		WHERE id = $1 AND location_id = $2
	`

	checkIn := models.CheckIn{
		ID:         id,
		LocationID: location.ID,
	}

	err := service.db.QueryRow(
		ctx,
		query,
		id,
		location.ID,
		location.TimeZone,
	).Scan(
		&checkIn.SchoolID,
		&checkIn.Capacity,
		&checkIn.CreatedAt,
	)

	if err != nil {
		return nil, handleError(err)
	}

	return &checkIn, nil
}

func (service CheckInService) Create(
	ctx context.Context,
	location *models.Location,
	school *models.School,
) (*models.CheckIn, error) {
	query := `
		INSERT INTO check_ins (location_id, school_id, capacity)
		VALUES ($1, $2, $3)
		RETURNING id, (created_at AT TIME ZONE $4)
	`

	checkIn := models.CheckIn{
		LocationID: location.ID,
		SchoolID:   school.ID,
		Capacity:   location.Capacity,
	}

	err := service.db.QueryRow(
		ctx,
		query,
		location.ID,
		school.ID,
		location.Capacity,
		location.TimeZone,
	).Scan(&checkIn.ID, &checkIn.CreatedAt)

	if err != nil {
		return nil, handleError(err)
	}

	location.Available--

	return &checkIn, nil
}

func (service CheckInService) Delete(ctx context.Context, id int64) error {
	query := `
		DELETE FROM check_ins
		WHERE id = $1
	`

	result, err := service.db.Exec(ctx, query, id)
	if err != nil {
		return handleError(err)
	}

	rowsAffected := result.RowsAffected()
	if rowsAffected == 0 {
		return ErrRecordNotFound
	}

	return nil
}
