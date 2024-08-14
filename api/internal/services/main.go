package services

import (
	"check-in/api/internal/config"
	"check-in/api/internal/repositories"
	"context"
	"log/slog"
)

type Services struct {
	Auth           AuthService
	CheckInsWriter CheckInWriterService
	Locations      LocationService
	Schools        SchoolService
	Users          UserService
	State          StateService
	WebSocket      *WebSocketService
}

func New(logger *slog.Logger, ctx context.Context, config config.Config, repositories repositories.Repositories) Services {
	websocket := NewWebSocketService(config.WebURL)
	state := NewStateService(logger, ctx, repositories.State, websocket)

	users := UserService{
		users: repositories.Users,
	}
	auth := AuthService{
		auth:  repositories.Auth,
		users: users,
	}
	schools := SchoolService{
		schools:         repositories.Schools,
		schoolIDNameMap: make(map[int64]string),
	}
	locations := LocationService{
		locations: repositories.Locations,
		checkins:  repositories.CheckIns,
		schools:   schools,
		users:     users,
		websocket: websocket,
	}
	checkInsWriter := CheckInWriterService{
		checkins:  repositories.CheckInsWriter,
		locations: locations,
		schools:   schools,
	}

	err := locations.InitializeWS(ctx)
	if err != nil {
		panic(err)
	}

	err = state.InitializeWS(ctx)
	if err != nil {
		panic(err)
	}

	return Services{
		Auth:           auth,
		CheckInsWriter: checkInsWriter,
		Locations:      locations,
		Schools:        schools,
		Users:          users,
		State:          state,
		WebSocket:      websocket,
	}
}
