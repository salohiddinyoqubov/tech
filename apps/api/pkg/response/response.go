package response

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// Response is the standard API response structure
type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *ErrorInfo  `json:"error,omitempty"`
	Meta    *Meta       `json:"meta,omitempty"`
}

// ErrorInfo contains error details
type ErrorInfo struct {
	Code    string            `json:"code"`
	Message string            `json:"message"`
	Details map[string]string `json:"details,omitempty"`
}

// Meta contains pagination and other metadata
type Meta struct {
	Page       int   `json:"page,omitempty"`
	PerPage    int   `json:"per_page,omitempty"`
	Total      int64 `json:"total,omitempty"`
	TotalPages int   `json:"total_pages,omitempty"`
	HasMore    bool  `json:"has_more,omitempty"`
}

// Pagination represents pagination parameters
type Pagination struct {
	Page    int
	PerPage int
	Offset  int
}

// NewPagination creates pagination from query params
func NewPagination(c echo.Context) Pagination {
	page := 1
	perPage := 20

	if p := c.QueryParam("page"); p != "" {
		if parsed := parseInt(p); parsed > 0 {
			page = parsed
		}
	}

	if pp := c.QueryParam("per_page"); pp != "" {
		if parsed := parseInt(pp); parsed > 0 && parsed <= 100 {
			perPage = parsed
		}
	}

	return Pagination{
		Page:    page,
		PerPage: perPage,
		Offset:  (page - 1) * perPage,
	}
}

func parseInt(s string) int {
	var result int
	for _, c := range s {
		if c >= '0' && c <= '9' {
			result = result*10 + int(c-'0')
		}
	}
	return result
}

// Success returns a successful response
func Success(c echo.Context, data interface{}) error {
	return c.JSON(http.StatusOK, Response{
		Success: true,
		Data:    data,
	})
}

// SuccessWithMeta returns a successful response with metadata
func SuccessWithMeta(c echo.Context, data interface{}, meta *Meta) error {
	return c.JSON(http.StatusOK, Response{
		Success: true,
		Data:    data,
		Meta:    meta,
	})
}

// Created returns a 201 response
func Created(c echo.Context, data interface{}) error {
	return c.JSON(http.StatusCreated, Response{
		Success: true,
		Data:    data,
	})
}

// NoContent returns a 204 response
func NoContent(c echo.Context) error {
	return c.NoContent(http.StatusNoContent)
}

// Error returns an error response
func Error(c echo.Context, status int, code, message string) error {
	return c.JSON(status, Response{
		Success: false,
		Error: &ErrorInfo{
			Code:    code,
			Message: message,
		},
	})
}

// ErrorWithDetails returns an error response with details
func ErrorWithDetails(c echo.Context, status int, code, message string, details map[string]string) error {
	return c.JSON(status, Response{
		Success: false,
		Error: &ErrorInfo{
			Code:    code,
			Message: message,
			Details: details,
		},
	})
}

// Common error responses
func BadRequest(c echo.Context, message string) error {
	return Error(c, http.StatusBadRequest, "BAD_REQUEST", message)
}

func ValidationError(c echo.Context, details map[string]string) error {
	return ErrorWithDetails(c, http.StatusBadRequest, "VALIDATION_ERROR", "Validation failed", details)
}

func Unauthorized(c echo.Context) error {
	return Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
}

func Forbidden(c echo.Context) error {
	return Error(c, http.StatusForbidden, "FORBIDDEN", "Access denied")
}

func NotFound(c echo.Context, resource string) error {
	return Error(c, http.StatusNotFound, "NOT_FOUND", resource+" not found")
}

func Conflict(c echo.Context, message string) error {
	return Error(c, http.StatusConflict, "CONFLICT", message)
}

func TooManyRequests(c echo.Context) error {
	return Error(c, http.StatusTooManyRequests, "TOO_MANY_REQUESTS", "Rate limit exceeded")
}

func InternalError(c echo.Context) error {
	return Error(c, http.StatusInternalServerError, "INTERNAL_ERROR", "An unexpected error occurred")
}
