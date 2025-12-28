package handler

import (
	"github.com/abs-platform/api/internal/middleware"
	"github.com/abs-platform/api/internal/model"
	"github.com/abs-platform/api/internal/service"
	"github.com/abs-platform/api/pkg/response"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

// PostHandler handles post/article endpoints
type PostHandler struct {
	postService *service.PostService
}

// NewPostHandler creates a new post handler
func NewPostHandler(postService *service.PostService) *PostHandler {
	return &PostHandler{
		postService: postService,
	}
}

// CreatePostRequest represents post creation payload
type CreatePostRequest struct {
	Title          string               `json:"title" validate:"required,min=5,max=200"`
	Subtitle       string               `json:"subtitle" validate:"max=300"`
	Content        string               `json:"content" validate:"required"` // Tiptap JSON
	CoverImageURL  string               `json:"cover_image_url" validate:"omitempty,url"`
	Format         model.PostFormat     `json:"format" validate:"required,oneof=deep_dive tutorial news_brief series case_study discussion"`
	Visibility     model.PostVisibility `json:"visibility" validate:"required,oneof=public unlisted members_only private"`
	Language       string               `json:"language" validate:"required,oneof=en uz ru tr tj kk ky"`
	Tags           []string             `json:"tags" validate:"max=5"`
	CategoryID     *uuid.UUID           `json:"category_id"`
	SeriesID       *uuid.UUID           `json:"series_id"`
	OrganizationID *uuid.UUID           `json:"organization_id"`
	CommunityID    *uuid.UUID           `json:"community_id"`
	CanonicalURL   string               `json:"canonical_url" validate:"omitempty,url"`
	MetaTitle      string               `json:"meta_title" validate:"max=70"`
	MetaDescription string              `json:"meta_description" validate:"max=160"`
	IsDraft        bool                 `json:"is_draft"`
}

// UpdatePostRequest represents post update payload
type UpdatePostRequest struct {
	Title           *string               `json:"title" validate:"omitempty,min=5,max=200"`
	Subtitle        *string               `json:"subtitle" validate:"omitempty,max=300"`
	Content         *string               `json:"content"`
	CoverImageURL   *string               `json:"cover_image_url" validate:"omitempty,url"`
	Format          *model.PostFormat     `json:"format" validate:"omitempty,oneof=deep_dive tutorial news_brief series case_study discussion"`
	Visibility      *model.PostVisibility `json:"visibility" validate:"omitempty,oneof=public unlisted members_only private"`
	Tags            []string              `json:"tags" validate:"omitempty,max=5"`
	CategoryID      *uuid.UUID            `json:"category_id"`
	CanonicalURL    *string               `json:"canonical_url" validate:"omitempty,url"`
	MetaTitle       *string               `json:"meta_title" validate:"omitempty,max=70"`
	MetaDescription *string               `json:"meta_description" validate:"omitempty,max=160"`
}

// List returns paginated posts
// @Summary List posts
// @Tags posts
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param per_page query int false "Items per page" default(20)
// @Param category query string false "Filter by category slug"
// @Param tag query string false "Filter by tag slug"
// @Param author query string false "Filter by author username"
// @Param format query string false "Filter by format"
// @Param lang query string false "Filter by language"
// @Param sort query string false "Sort order" Enums(latest, top_week, top_month, top_all)
// @Success 200 {object} response.Response
// @Router /posts [get]
func (h *PostHandler) List(c echo.Context) error {
	pagination := response.NewPagination(c)
	lang := middleware.GetLanguage(c)

	// Build filters
	filters := service.PostFilters{
		Category: c.QueryParam("category"),
		Tag:      c.QueryParam("tag"),
		Author:   c.QueryParam("author"),
		Format:   model.PostFormat(c.QueryParam("format")),
		Language: c.QueryParam("lang"),
		Sort:     c.QueryParam("sort"),
	}

	if filters.Language == "" {
		filters.Language = lang
	}

	// Get current user ID if authenticated
	var userID *uuid.UUID
	if id, ok := middleware.GetUserID(c); ok {
		userID = &id
	}

	posts, total, err := h.postService.List(c.Request().Context(), filters, pagination, userID)
	if err != nil {
		return response.InternalError(c)
	}

	totalPages := int(total) / pagination.PerPage
	if int(total)%pagination.PerPage > 0 {
		totalPages++
	}

	return response.SuccessWithMeta(c, posts, &response.Meta{
		Page:       pagination.Page,
		PerPage:    pagination.PerPage,
		Total:      total,
		TotalPages: totalPages,
		HasMore:    pagination.Page < totalPages,
	})
}

// Get returns a single post by slug
// @Summary Get post by slug
// @Tags posts
// @Produce json
// @Param slug path string true "Post slug"
// @Success 200 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /posts/{slug} [get]
func (h *PostHandler) Get(c echo.Context) error {
	slug := c.Param("slug")
	if slug == "" {
		return response.BadRequest(c, "Slug is required")
	}

	// Get current user ID if authenticated
	var userID *uuid.UUID
	if id, ok := middleware.GetUserID(c); ok {
		userID = &id
	}

	post, err := h.postService.GetBySlug(c.Request().Context(), slug, userID)
	if err != nil {
		if err == service.ErrPostNotFound {
			return response.NotFound(c, "Post")
		}
		return response.InternalError(c)
	}

	// Increment view count asynchronously
	go h.postService.IncrementViews(c.Request().Context(), post.ID, userID)

	return response.Success(c, post)
}

// Create creates a new post
// @Summary Create a new post
// @Tags posts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param body body CreatePostRequest true "Post data"
// @Success 201 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /posts [post]
func (h *PostHandler) Create(c echo.Context) error {
	var req CreatePostRequest
	if err := c.Bind(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := c.Validate(&req); err != nil {
		return response.ValidationError(c, parseValidationErrors(err))
	}

	userID, ok := middleware.GetUserID(c)
	if !ok {
		return response.Unauthorized(c)
	}

	input := service.CreatePostInput{
		AuthorID:       userID,
		Title:          req.Title,
		Subtitle:       req.Subtitle,
		Content:        req.Content,
		CoverImageURL:  req.CoverImageURL,
		Format:         req.Format,
		Visibility:     req.Visibility,
		Language:       req.Language,
		Tags:           req.Tags,
		CategoryID:     req.CategoryID,
		SeriesID:       req.SeriesID,
		OrganizationID: req.OrganizationID,
		CommunityID:    req.CommunityID,
		CanonicalURL:   req.CanonicalURL,
		MetaTitle:      req.MetaTitle,
		MetaDescription: req.MetaDescription,
		IsDraft:        req.IsDraft,
	}

	post, err := h.postService.Create(c.Request().Context(), input)
	if err != nil {
		return response.InternalError(c)
	}

	return response.Created(c, post)
}

// Update updates a post
// @Summary Update a post
// @Tags posts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Post ID"
// @Param body body UpdatePostRequest true "Update data"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /posts/{id} [put]
func (h *PostHandler) Update(c echo.Context) error {
	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return response.BadRequest(c, "Invalid post ID")
	}

	var req UpdatePostRequest
	if err := c.Bind(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	userID, ok := middleware.GetUserID(c)
	if !ok {
		return response.Unauthorized(c)
	}

	post, err := h.postService.Update(c.Request().Context(), postID, userID, service.UpdatePostInput{
		Title:           req.Title,
		Subtitle:        req.Subtitle,
		Content:         req.Content,
		CoverImageURL:   req.CoverImageURL,
		Format:          req.Format,
		Visibility:      req.Visibility,
		Tags:            req.Tags,
		CategoryID:      req.CategoryID,
		CanonicalURL:    req.CanonicalURL,
		MetaTitle:       req.MetaTitle,
		MetaDescription: req.MetaDescription,
	})

	if err != nil {
		switch err {
		case service.ErrPostNotFound:
			return response.NotFound(c, "Post")
		case service.ErrUnauthorized:
			return response.Forbidden(c)
		default:
			return response.InternalError(c)
		}
	}

	return response.Success(c, post)
}

// Delete deletes a post
// @Summary Delete a post
// @Tags posts
// @Produce json
// @Security BearerAuth
// @Param id path string true "Post ID"
// @Success 204
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /posts/{id} [delete]
func (h *PostHandler) Delete(c echo.Context) error {
	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return response.BadRequest(c, "Invalid post ID")
	}

	userID, ok := middleware.GetUserID(c)
	if !ok {
		return response.Unauthorized(c)
	}

	err = h.postService.Delete(c.Request().Context(), postID, userID)
	if err != nil {
		switch err {
		case service.ErrPostNotFound:
			return response.NotFound(c, "Post")
		case service.ErrUnauthorized:
			return response.Forbidden(c)
		default:
			return response.InternalError(c)
		}
	}

	return response.NoContent(c)
}

// Clap adds claps to a post
// @Summary Clap for a post
// @Tags posts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Post ID"
// @Param body body object{count int} true "Clap count (1-50)"
// @Success 200 {object} response.Response
// @Router /posts/{id}/clap [post]
func (h *PostHandler) Clap(c echo.Context) error {
	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return response.BadRequest(c, "Invalid post ID")
	}

	var req struct {
		Count int `json:"count" validate:"required,min=1,max=50"`
	}
	if err := c.Bind(&req); err != nil {
		req.Count = 1
	}

	userID, ok := middleware.GetUserID(c)
	if !ok {
		return response.Unauthorized(c)
	}

	totalClaps, err := h.postService.Clap(c.Request().Context(), postID, userID, req.Count)
	if err != nil {
		return response.InternalError(c)
	}

	return response.Success(c, map[string]interface{}{
		"total_claps": totalClaps,
	})
}

// Bookmark saves a post
// @Summary Bookmark a post
// @Tags posts
// @Produce json
// @Security BearerAuth
// @Param id path string true "Post ID"
// @Success 200 {object} response.Response
// @Router /posts/{id}/bookmark [post]
func (h *PostHandler) Bookmark(c echo.Context) error {
	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return response.BadRequest(c, "Invalid post ID")
	}

	userID, ok := middleware.GetUserID(c)
	if !ok {
		return response.Unauthorized(c)
	}

	err = h.postService.Bookmark(c.Request().Context(), postID, userID)
	if err != nil {
		return response.InternalError(c)
	}

	return response.Success(c, map[string]interface{}{
		"bookmarked": true,
	})
}

// RemoveBookmark removes a bookmark
// @Summary Remove bookmark
// @Tags posts
// @Produce json
// @Security BearerAuth
// @Param id path string true "Post ID"
// @Success 204
// @Router /posts/{id}/bookmark [delete]
func (h *PostHandler) RemoveBookmark(c echo.Context) error {
	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return response.BadRequest(c, "Invalid post ID")
	}

	userID, ok := middleware.GetUserID(c)
	if !ok {
		return response.Unauthorized(c)
	}

	err = h.postService.RemoveBookmark(c.Request().Context(), postID, userID)
	if err != nil {
		return response.InternalError(c)
	}

	return response.NoContent(c)
}
