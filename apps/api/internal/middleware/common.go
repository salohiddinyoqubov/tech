package middleware

import (
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

// SupportedLanguages lists all supported languages
var SupportedLanguages = []string{"en", "uz", "ru", "tr", "tj", "kk", "ky"}

// RequestIDMiddleware adds a unique request ID to each request
func RequestIDMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			requestID := c.Request().Header.Get("X-Request-ID")
			if requestID == "" {
				requestID = uuid.New().String()
			}
			c.Set(RequestIDKey, requestID)
			c.Response().Header().Set("X-Request-ID", requestID)
			return next(c)
		}
	}
}

// LanguageMiddleware detects and sets the user's preferred language
func LanguageMiddleware(defaultLang string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			lang := detectLanguage(c, defaultLang)
			c.Set(LanguageKey, lang)
			c.Response().Header().Set("Content-Language", lang)
			return next(c)
		}
	}
}

func detectLanguage(c echo.Context, defaultLang string) string {
	// 1. Check URL path prefix (/uz/, /ru/, etc.)
	path := c.Request().URL.Path
	for _, lang := range SupportedLanguages {
		if strings.HasPrefix(path, "/"+lang+"/") || path == "/"+lang {
			return lang
		}
	}

	// 2. Check query parameter
	if lang := c.QueryParam("lang"); isValidLanguage(lang) {
		return lang
	}

	// 3. Check cookie
	if cookie, err := c.Cookie("preferred_lang"); err == nil && isValidLanguage(cookie.Value) {
		return cookie.Value
	}

	// 4. Check Accept-Language header
	acceptLang := c.Request().Header.Get("Accept-Language")
	if lang := parseAcceptLanguage(acceptLang); lang != "" {
		return lang
	}

	return defaultLang
}

func isValidLanguage(lang string) bool {
	for _, l := range SupportedLanguages {
		if l == lang {
			return true
		}
	}
	return false
}

func parseAcceptLanguage(header string) string {
	if header == "" {
		return ""
	}

	// Simple parsing - just check first language
	parts := strings.Split(header, ",")
	if len(parts) == 0 {
		return ""
	}

	firstLang := strings.TrimSpace(parts[0])
	// Remove quality value if present
	if idx := strings.Index(firstLang, ";"); idx > 0 {
		firstLang = firstLang[:idx]
	}

	// Get base language code
	if idx := strings.Index(firstLang, "-"); idx > 0 {
		firstLang = firstLang[:idx]
	}

	if isValidLanguage(firstLang) {
		return firstLang
	}

	return ""
}

// LoggingMiddleware logs all requests
func LoggingMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			start := time.Now()

			err := next(c)

			latency := time.Since(start)
			requestID, _ := c.Get(RequestIDKey).(string)

			log.Info().
				Str("request_id", requestID).
				Str("method", c.Request().Method).
				Str("path", c.Request().URL.Path).
				Int("status", c.Response().Status).
				Dur("latency", latency).
				Str("ip", c.RealIP()).
				Str("user_agent", c.Request().UserAgent()).
				Msg("Request")

			return err
		}
	}
}

// CORSConfig returns CORS middleware configuration
func CORSConfig() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			origin := c.Request().Header.Get("Origin")

			// List of allowed origins
			allowedOrigins := map[string]bool{
				"http://localhost:3000":       true,
				"http://localhost:3001":       true,
				"https://abs.com":             true,
				"https://studio.abs.com":      true,
				"https://ops.abs.com":         true,
			}

			if allowedOrigins[origin] {
				c.Response().Header().Set("Access-Control-Allow-Origin", origin)
				c.Response().Header().Set("Access-Control-Allow-Credentials", "true")
			}

			c.Response().Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			c.Response().Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, X-Request-ID")
			c.Response().Header().Set("Access-Control-Max-Age", "86400")

			if c.Request().Method == "OPTIONS" {
				return c.NoContent(204)
			}

			return next(c)
		}
	}
}

// RateLimitMiddleware provides basic rate limiting
func RateLimitMiddleware(requestsPerMinute int) echo.MiddlewareFunc {
	// TODO: Implement Redis-based rate limiting
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			return next(c)
		}
	}
}

// GetLanguage gets the detected language from context
func GetLanguage(c echo.Context) string {
	lang, ok := c.Get(LanguageKey).(string)
	if !ok {
		return "en"
	}
	return lang
}

// GetRequestID gets the request ID from context
func GetRequestID(c echo.Context) string {
	id, _ := c.Get(RequestIDKey).(string)
	return id
}
