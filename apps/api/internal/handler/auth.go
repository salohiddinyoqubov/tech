package handler

import (
	"net/http"
	"strings"
	"time"

	"github.com/abs-platform/api/internal/model"
	"github.com/abs-platform/api/internal/service"
	"github.com/abs-platform/api/pkg/response"
	"github.com/labstack/echo/v4"
)

// AuthHandler handles authentication endpoints
type AuthHandler struct {
	authService *service.AuthService
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// RegisterRequest represents registration payload
type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Username string `json:"username" validate:"required,min=3,max=30,alphanum"`
	Password string `json:"password" validate:"required,min=8"`
	FullName string `json:"full_name" validate:"required,min=2,max=100"`
	Language string `json:"language" validate:"omitempty,oneof=en uz ru tr tj kk ky"`
}

// LoginRequest represents login payload
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// RefreshRequest represents token refresh payload
type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

// Register handles user registration
// @Summary Register a new user
// @Tags auth
// @Accept json
// @Produce json
// @Param body body RegisterRequest true "Registration data"
// @Success 201 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 409 {object} response.Response
// @Router /auth/register [post]
func (h *AuthHandler) Register(c echo.Context) error {
	var req RegisterRequest
	if err := c.Bind(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := c.Validate(&req); err != nil {
		return response.ValidationError(c, parseValidationErrors(err))
	}

	// Clean input
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	req.Username = strings.ToLower(strings.TrimSpace(req.Username))

	tokens, user, err := h.authService.Register(c.Request().Context(), service.RegisterInput{
		Email:    req.Email,
		Username: req.Username,
		Password: req.Password,
		FullName: req.FullName,
		Language: req.Language,
	})

	if err != nil {
		switch err {
		case service.ErrEmailExists:
			return response.Conflict(c, "Email already registered")
		case service.ErrUsernameExists:
			return response.Conflict(c, "Username already taken")
		default:
			return response.InternalError(c)
		}
	}

	// Set cookies
	setAuthCookies(c, tokens)

	return response.Created(c, map[string]interface{}{
		"user":   sanitizeUser(user),
		"tokens": tokens,
	})
}

// Login handles user login
// @Summary Login user
// @Tags auth
// @Accept json
// @Produce json
// @Param body body LoginRequest true "Login credentials"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /auth/login [post]
func (h *AuthHandler) Login(c echo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := c.Validate(&req); err != nil {
		return response.ValidationError(c, parseValidationErrors(err))
	}

	tokens, user, err := h.authService.Login(c.Request().Context(), req.Email, req.Password)
	if err != nil {
		switch err {
		case service.ErrInvalidCredentials:
			return response.Error(c, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Invalid email or password")
		case service.ErrUserNotFound:
			return response.Error(c, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Invalid email or password")
		default:
			return response.InternalError(c)
		}
	}

	// Set cookies
	setAuthCookies(c, tokens)

	return response.Success(c, map[string]interface{}{
		"user":   sanitizeUser(user),
		"tokens": tokens,
	})
}

// Refresh refreshes access token using refresh token
// @Summary Refresh access token
// @Tags auth
// @Accept json
// @Produce json
// @Param body body RefreshRequest true "Refresh token"
// @Success 200 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /auth/refresh [post]
func (h *AuthHandler) Refresh(c echo.Context) error {
	var req RefreshRequest

	// Try to get refresh token from body first
	if err := c.Bind(&req); err != nil || req.RefreshToken == "" {
		// Try cookie
		cookie, err := c.Cookie("refresh_token")
		if err != nil || cookie.Value == "" {
			return response.Unauthorized(c)
		}
		req.RefreshToken = cookie.Value
	}

	tokens, err := h.authService.RefreshTokens(c.Request().Context(), req.RefreshToken)
	if err != nil {
		return response.Unauthorized(c)
	}

	setAuthCookies(c, tokens)

	return response.Success(c, map[string]interface{}{
		"tokens": tokens,
	})
}

// Logout handles user logout
// @Summary Logout user
// @Tags auth
// @Produce json
// @Success 200 {object} response.Response
// @Router /auth/logout [post]
func (h *AuthHandler) Logout(c echo.Context) error {
	// Clear cookies
	clearAuthCookies(c)

	// TODO: Invalidate refresh token in Redis

	return response.Success(c, map[string]interface{}{
		"message": "Logged out successfully",
	})
}

// Me returns current user info
// @Summary Get current user
// @Tags auth
// @Produce json
// @Security BearerAuth
// @Success 200 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /auth/me [get]
func (h *AuthHandler) Me(c echo.Context) error {
	user, ok := c.Get("user").(*model.User)
	if !ok {
		return response.Unauthorized(c)
	}

	return response.Success(c, map[string]interface{}{
		"user": sanitizeUser(user),
	})
}

// Helper functions

func setAuthCookies(c echo.Context, tokens interface{}) {
	// Access token cookie (short-lived, httpOnly)
	c.SetCookie(&http.Cookie{
		Name:     "access_token",
		Value:    "", // Will be set from tokens
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   900, // 15 minutes
	})

	// Refresh token cookie (long-lived, httpOnly)
	c.SetCookie(&http.Cookie{
		Name:     "refresh_token",
		Value:    "", // Will be set from tokens
		Path:     "/auth/refresh",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   604800, // 7 days
	})
}

func clearAuthCookies(c echo.Context) {
	c.SetCookie(&http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
	})

	c.SetCookie(&http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/auth/refresh",
		HttpOnly: true,
		Secure:   true,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
	})
}

func sanitizeUser(user *model.User) map[string]interface{} {
	if user == nil {
		return nil
	}

	return map[string]interface{}{
		"id":              user.ID,
		"email":           user.Email,
		"username":        user.Username,
		"full_name":       user.FullName,
		"bio":             user.Bio,
		"avatar_url":      user.AvatarURL,
		"role":            user.Role,
		"status":          user.Status,
		"karma":           user.Karma,
		"is_verified":     user.IsVerified,
		"posts_count":     user.PostsCount,
		"followers_count": user.FollowersCount,
		"following_count": user.FollowingCount,
		"preferred_lang":  user.PreferredLang,
		"created_at":      user.CreatedAt,
	}
}

func parseValidationErrors(err error) map[string]string {
	// TODO: Parse validation errors properly
	return map[string]string{
		"error": err.Error(),
	}
}
