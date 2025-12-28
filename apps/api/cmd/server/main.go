package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/abs-platform/api/internal/config"
	"github.com/abs-platform/api/internal/middleware"
	"github.com/abs-platform/api/pkg/auth"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// CustomValidator wraps go-playground/validator
type CustomValidator struct {
	validator *validator.Validate
}

// Validate implements echo.Validator
func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

func main() {
	// Setup logging
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to load configuration")
	}

	if cfg.App.Debug {
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	} else {
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	}

	// Initialize Echo
	e := echo.New()
	e.HideBanner = true
	e.HidePort = true

	// Set custom validator
	e.Validator = &CustomValidator{validator: validator.New()}

	// Initialize JWT Manager
	jwtManager := auth.NewJWTManager(
		cfg.JWT.AccessSecret,
		cfg.JWT.RefreshSecret,
		cfg.JWT.AccessExpiry,
		cfg.JWT.RefreshExpiry,
	)

	// Global middleware
	e.Use(echoMiddleware.Recover())
	e.Use(middleware.RequestIDMiddleware())
	e.Use(middleware.CORSConfig())
	e.Use(middleware.LanguageMiddleware(cfg.App.DefaultLanguage))
	e.Use(middleware.LoggingMiddleware())

	// Rate limiting (TODO: implement with Redis)
	e.Use(middleware.RateLimitMiddleware(100))

	// Security headers
	e.Use(echoMiddleware.SecureWithConfig(echoMiddleware.SecureConfig{
		XSSProtection:         "1; mode=block",
		ContentTypeNosniff:    "nosniff",
		XFrameOptions:         "DENY",
		HSTSMaxAge:            31536000,
		ContentSecurityPolicy: "default-src 'self'",
	}))

	// Gzip compression
	e.Use(echoMiddleware.GzipWithConfig(echoMiddleware.GzipConfig{
		Level: 5,
	}))

	// TODO: Initialize database connection
	// db, err := pgx.Connect(context.Background(), cfg.Database.DSN())
	// if err != nil {
	// 	log.Fatal().Err(err).Msg("Failed to connect to database")
	// }
	// defer db.Close()

	// TODO: Initialize Redis connection
	// rdb := redis.NewClient(&redis.Options{
	// 	Addr:     cfg.Redis.Host + ":" + cfg.Redis.Port,
	// 	Password: cfg.Redis.Password,
	// 	DB:       cfg.Redis.DB,
	// })

	// TODO: Initialize repositories
	// userRepo := postgres.NewUserRepository(db)
	// postRepo := postgres.NewPostRepository(db)

	// TODO: Initialize services
	// authService := service.NewAuthService(userRepo, jwtManager)
	// postService := service.NewPostService(postRepo, userRepo, tagRepo)

	// TODO: Initialize handlers
	// authHandler := handler.NewAuthHandler(authService)
	// postHandler := handler.NewPostHandler(postService)

	// Setup routes
	setupRoutes(e, jwtManager)

	// Health check
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"status":    "healthy",
			"timestamp": time.Now().UTC(),
			"version":   "1.0.0",
		})
	})

	// Start server
	addr := fmt.Sprintf("%s:%s", cfg.Server.Host, cfg.Server.Port)
	server := &http.Server{
		Addr:         addr,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

	// Graceful shutdown
	go func() {
		log.Info().Str("address", addr).Msg("Starting server")
		if err := e.StartServer(server); err != nil && err != http.ErrServerClosed {
			log.Fatal().Err(err).Msg("Server failed")
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info().Msg("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := e.Shutdown(ctx); err != nil {
		log.Fatal().Err(err).Msg("Server forced to shutdown")
	}

	log.Info().Msg("Server stopped")
}

func setupRoutes(e *echo.Echo, jwtManager *auth.JWTManager) {
	// API v1 group
	api := e.Group("/api/v1")

	// Public routes
	api.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"name":    "ABS Platform API",
			"version": "1.0.0",
			"docs":    "/api/v1/docs",
		})
	})

	// Auth routes
	auth := api.Group("/auth")
	{
		auth.POST("/register", placeholder("register"))
		auth.POST("/login", placeholder("login"))
		auth.POST("/refresh", placeholder("refresh"))
		auth.POST("/logout", placeholder("logout"))
		auth.POST("/forgot-password", placeholder("forgot-password"))
		auth.POST("/reset-password", placeholder("reset-password"))
		auth.POST("/verify-email", placeholder("verify-email"))

		// Protected auth routes
		authProtected := auth.Group("")
		authProtected.Use(middleware.AuthMiddleware(jwtManager))
		authProtected.GET("/me", placeholder("me"))
		authProtected.PUT("/me", placeholder("update-me"))
		authProtected.POST("/change-password", placeholder("change-password"))
	}

	// Posts routes
	posts := api.Group("/posts")
	posts.Use(middleware.OptionalAuthMiddleware(jwtManager))
	{
		posts.GET("", placeholder("list-posts"))
		posts.GET("/:slug", placeholder("get-post"))
		posts.GET("/:slug/comments", placeholder("get-comments"))

		// Protected post routes
		postsProtected := posts.Group("")
		postsProtected.Use(middleware.AuthMiddleware(jwtManager))
		postsProtected.POST("", placeholder("create-post"))
		postsProtected.PUT("/:id", placeholder("update-post"))
		postsProtected.DELETE("/:id", placeholder("delete-post"))
		postsProtected.POST("/:id/clap", placeholder("clap"))
		postsProtected.POST("/:id/bookmark", placeholder("bookmark"))
		postsProtected.DELETE("/:id/bookmark", placeholder("remove-bookmark"))
		postsProtected.POST("/:id/reaction", placeholder("add-reaction"))
		postsProtected.DELETE("/:id/reaction", placeholder("remove-reaction"))
		postsProtected.POST("/:id/comments", placeholder("add-comment"))
	}

	// Comments routes
	comments := api.Group("/comments")
	comments.Use(middleware.AuthMiddleware(jwtManager))
	{
		comments.PUT("/:id", placeholder("update-comment"))
		comments.DELETE("/:id", placeholder("delete-comment"))
		comments.POST("/:id/vote", placeholder("vote-comment"))
	}

	// Users routes
	users := api.Group("/users")
	users.Use(middleware.OptionalAuthMiddleware(jwtManager))
	{
		users.GET("/:username", placeholder("get-user"))
		users.GET("/:username/posts", placeholder("get-user-posts"))
		users.GET("/:username/followers", placeholder("get-followers"))
		users.GET("/:username/following", placeholder("get-following"))

		// Protected user routes
		usersProtected := users.Group("")
		usersProtected.Use(middleware.AuthMiddleware(jwtManager))
		usersProtected.POST("/:username/follow", placeholder("follow"))
		usersProtected.DELETE("/:username/follow", placeholder("unfollow"))
	}

	// Tags routes
	tags := api.Group("/tags")
	{
		tags.GET("", placeholder("list-tags"))
		tags.GET("/trending", placeholder("trending-tags"))
		tags.GET("/:slug", placeholder("get-tag"))
		tags.GET("/:slug/posts", placeholder("tag-posts"))

		tagsProtected := tags.Group("")
		tagsProtected.Use(middleware.AuthMiddleware(jwtManager))
		tagsProtected.POST("/:slug/follow", placeholder("follow-tag"))
		tagsProtected.DELETE("/:slug/follow", placeholder("unfollow-tag"))
	}

	// Categories routes
	categories := api.Group("/categories")
	{
		categories.GET("", placeholder("list-categories"))
		categories.GET("/:slug", placeholder("get-category"))
		categories.GET("/:slug/posts", placeholder("category-posts"))
	}

	// Organizations routes
	orgs := api.Group("/organizations")
	orgs.Use(middleware.OptionalAuthMiddleware(jwtManager))
	{
		orgs.GET("", placeholder("list-organizations"))
		orgs.GET("/:slug", placeholder("get-organization"))
		orgs.GET("/:slug/posts", placeholder("org-posts"))
		orgs.GET("/:slug/jobs", placeholder("org-jobs"))
		orgs.GET("/:slug/members", placeholder("org-members"))

		orgsProtected := orgs.Group("")
		orgsProtected.Use(middleware.AuthMiddleware(jwtManager))
		orgsProtected.POST("", placeholder("create-organization"))
		orgsProtected.PUT("/:slug", placeholder("update-organization"))
		orgsProtected.POST("/:slug/follow", placeholder("follow-org"))
		orgsProtected.DELETE("/:slug/follow", placeholder("unfollow-org"))
		orgsProtected.POST("/:slug/invite", placeholder("invite-member"))
	}

	// Communities routes
	communities := api.Group("/communities")
	communities.Use(middleware.OptionalAuthMiddleware(jwtManager))
	{
		communities.GET("", placeholder("list-communities"))
		communities.GET("/:slug", placeholder("get-community"))
		communities.GET("/:slug/posts", placeholder("community-posts"))
		communities.GET("/:slug/members", placeholder("community-members"))

		commProtected := communities.Group("")
		commProtected.Use(middleware.AuthMiddleware(jwtManager))
		commProtected.POST("", placeholder("create-community"))
		commProtected.PUT("/:slug", placeholder("update-community"))
		commProtected.POST("/:slug/join", placeholder("join-community"))
		commProtected.DELETE("/:slug/leave", placeholder("leave-community"))
	}

	// Jobs routes
	jobs := api.Group("/jobs")
	jobs.Use(middleware.OptionalAuthMiddleware(jwtManager))
	{
		jobs.GET("", placeholder("list-jobs"))
		jobs.GET("/:slug", placeholder("get-job"))

		jobsProtected := jobs.Group("")
		jobsProtected.Use(middleware.AuthMiddleware(jwtManager))
		jobsProtected.POST("", placeholder("create-job"))
		jobsProtected.PUT("/:id", placeholder("update-job"))
		jobsProtected.DELETE("/:id", placeholder("delete-job"))
		jobsProtected.POST("/:id/bookmark", placeholder("bookmark-job"))
		jobsProtected.DELETE("/:id/bookmark", placeholder("remove-job-bookmark"))
		jobsProtected.POST("/:id/apply", placeholder("apply-job"))
	}

	// Events routes
	events := api.Group("/events")
	{
		events.GET("", placeholder("list-events"))
		events.GET("/:slug", placeholder("get-event"))

		eventsProtected := events.Group("")
		eventsProtected.Use(middleware.AuthMiddleware(jwtManager))
		eventsProtected.POST("", placeholder("create-event"))
		eventsProtected.PUT("/:id", placeholder("update-event"))
		eventsProtected.DELETE("/:id", placeholder("delete-event"))
		eventsProtected.POST("/:id/register", placeholder("register-event"))
	}

	// Search routes
	search := api.Group("/search")
	{
		search.GET("", placeholder("global-search"))
		search.GET("/posts", placeholder("search-posts"))
		search.GET("/users", placeholder("search-users"))
		search.GET("/jobs", placeholder("search-jobs"))
		search.GET("/tags", placeholder("search-tags"))
	}

	// Feed routes (personalized)
	feed := api.Group("/feed")
	feed.Use(middleware.AuthMiddleware(jwtManager))
	{
		feed.GET("", placeholder("personalized-feed"))
		feed.GET("/following", placeholder("following-feed"))
		feed.GET("/bookmarks", placeholder("bookmarks"))
		feed.GET("/history", placeholder("reading-history"))
	}

	// Notifications routes
	notifications := api.Group("/notifications")
	notifications.Use(middleware.AuthMiddleware(jwtManager))
	{
		notifications.GET("", placeholder("list-notifications"))
		notifications.GET("/unread-count", placeholder("unread-count"))
		notifications.POST("/:id/read", placeholder("mark-read"))
		notifications.POST("/read-all", placeholder("mark-all-read"))
	}

	// Upload routes
	upload := api.Group("/upload")
	upload.Use(middleware.AuthMiddleware(jwtManager))
	{
		upload.POST("/image", placeholder("upload-image"))
		upload.POST("/file", placeholder("upload-file"))
	}

	// Internal/Admin routes
	internal := api.Group("/internal")
	internal.Use(middleware.AuthMiddleware(jwtManager))
	internal.Use(middleware.AdminOnly())
	{
		internal.GET("/stats", placeholder("admin-stats"))
		internal.GET("/users", placeholder("admin-users"))
		internal.PUT("/users/:id/role", placeholder("update-user-role"))
		internal.PUT("/users/:id/ban", placeholder("ban-user"))
		internal.GET("/posts/pending", placeholder("pending-posts"))
		internal.PUT("/posts/:id/approve", placeholder("approve-post"))
		internal.PUT("/posts/:id/reject", placeholder("reject-post"))
		internal.GET("/reports", placeholder("list-reports"))
		internal.PUT("/reports/:id", placeholder("handle-report"))
	}
}

// placeholder returns a handler that returns "not implemented" response
func placeholder(name string) echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.JSON(http.StatusNotImplemented, map[string]interface{}{
			"endpoint":    name,
			"status":      "not_implemented",
			"description": fmt.Sprintf("The '%s' endpoint is coming soon", name),
		})
	}
}
