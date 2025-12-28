package middleware

import (
	"strings"

	"github.com/abs-platform/api/internal/model"
	"github.com/abs-platform/api/pkg/auth"
	"github.com/abs-platform/api/pkg/response"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

// Context keys
const (
	UserIDKey     = "user_id"
	UserKey       = "user"
	ClaimsKey     = "claims"
	LanguageKey   = "language"
	RequestIDKey  = "request_id"
)

// AuthMiddleware creates authentication middleware
func AuthMiddleware(jwtManager *auth.JWTManager) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			token := extractToken(c)
			if token == "" {
				return response.Unauthorized(c)
			}

			claims, err := jwtManager.ValidateAccessToken(token)
			if err != nil {
				if err == auth.ErrExpiredToken {
					return response.Error(c, 401, "TOKEN_EXPIRED", "Token has expired")
				}
				return response.Unauthorized(c)
			}

			// Set user info in context
			c.Set(UserIDKey, claims.UserID)
			c.Set(ClaimsKey, claims)

			return next(c)
		}
	}
}

// OptionalAuthMiddleware allows both authenticated and unauthenticated requests
func OptionalAuthMiddleware(jwtManager *auth.JWTManager) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			token := extractToken(c)
			if token != "" {
				claims, err := jwtManager.ValidateAccessToken(token)
				if err == nil {
					c.Set(UserIDKey, claims.UserID)
					c.Set(ClaimsKey, claims)
				}
			}
			return next(c)
		}
	}
}

// RoleMiddleware checks if user has required role
func RoleMiddleware(roles ...model.UserRole) echo.MiddlewareFunc {
	roleMap := make(map[model.UserRole]bool)
	for _, role := range roles {
		roleMap[role] = true
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			claims, ok := c.Get(ClaimsKey).(*auth.Claims)
			if !ok {
				return response.Unauthorized(c)
			}

			userRole := model.UserRole(claims.Role)
			if !roleMap[userRole] {
				return response.Forbidden(c)
			}

			return next(c)
		}
	}
}

// AdminOnly is a shorthand for admin-only routes
func AdminOnly() echo.MiddlewareFunc {
	return RoleMiddleware(model.RoleAdmin, model.RoleSuperAdmin)
}

// ModeratorOrAbove is a shorthand for moderator+ routes
func ModeratorOrAbove() echo.MiddlewareFunc {
	return RoleMiddleware(model.RoleModerator, model.RoleAdmin, model.RoleSuperAdmin)
}

// extractToken extracts the JWT token from the request
func extractToken(c echo.Context) string {
	// Try Authorization header first
	authHeader := c.Request().Header.Get("Authorization")
	if authHeader != "" {
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) == 2 && strings.ToLower(parts[0]) == "bearer" {
			return parts[1]
		}
	}

	// Try cookie
	cookie, err := c.Cookie("access_token")
	if err == nil && cookie.Value != "" {
		return cookie.Value
	}

	// Try query parameter (for WebSocket connections)
	return c.QueryParam("token")
}

// GetUserID gets the authenticated user's ID from context
func GetUserID(c echo.Context) (uuid.UUID, bool) {
	id, ok := c.Get(UserIDKey).(uuid.UUID)
	return id, ok
}

// GetClaims gets the JWT claims from context
func GetClaims(c echo.Context) (*auth.Claims, bool) {
	claims, ok := c.Get(ClaimsKey).(*auth.Claims)
	return claims, ok
}

// IsAuthenticated checks if the request is authenticated
func IsAuthenticated(c echo.Context) bool {
	_, ok := GetUserID(c)
	return ok
}
