package main

import (
	"check-in/api/internal/dtos"
	"net/http"
	"net/http/pprof"

	"github.com/getsentry/sentry-go"
	"github.com/justinas/alice"
	"github.com/xdoubleu/essentia/v2/pkg/middleware"
)

func (app *Application) routes() http.Handler {
	mux := http.NewServeMux()

	app.authRoutes(mux)
	app.checkInsRoutes(mux)
	app.locationsRoutes(mux)
	app.schoolsRoutes(mux)
	app.usersRoutes(mux)
	app.websocketsRoutes(mux)
	app.stateRoutes(mux)

	// pprof routes
	mux.HandleFunc(
		"GET /debug/pprof/",
		app.pprofMiddleware(pprof.Index),
	)
	mux.HandleFunc(
		"GET /debug/pprof/cmdline",
		app.pprofMiddleware(pprof.Cmdline),
	)
	mux.HandleFunc(
		"GET /debug/pprof/profile",
		app.pprofMiddleware(pprof.Profile),
	)
	mux.HandleFunc(
		"GET /debug/pprof/symbol",
		app.pprofMiddleware(pprof.Symbol),
	)
	mux.HandleFunc(
		"GET /debug/pprof/trace",
		app.pprofMiddleware(pprof.Trace),
	)

	var sentryClientOptions sentry.ClientOptions
	if len(app.config.SentryDsn) > 0 {
		//nolint:exhaustruct //other fields are optional
		sentryClientOptions = sentry.ClientOptions{
			Dsn:              app.config.SentryDsn,
			Environment:      app.config.Env,
			Release:          app.config.Release,
			EnableTracing:    true,
			TracesSampleRate: app.config.SampleRate,
			SampleRate:       app.config.SampleRate,
		}
	}

	allowedOrigins := []string{app.config.WebURL}
	handlers, err := middleware.DefaultWithSentry(
		app.logger,
		allowedOrigins,
		app.config.Env,
		sentryClientOptions,
	)

	if err != nil {
		panic(err)
	}

	standard := alice.New(handlers...)
	return standard.Then(mux)
}

func (app *Application) pprofMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Only allow pprof when using basic auth of admin user
		username, password, ok := r.BasicAuth()
		if !ok {
			http.Error(w, "authorization required", http.StatusUnauthorized)
			return
		}

		user, err := app.services.Auth.SignInUser(r.Context(), dtos.SignInDto{
			Username: username,
			Password: password,
		})

		if err != nil {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}

		if user.Role != "admin" {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}

		// Only allow pprof if enabled
		if !app.services.State.Current.Get().IsMemoryProfEnabled {
			http.Error(w, "pprof is disabled", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}
