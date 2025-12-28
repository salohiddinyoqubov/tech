package service

import (
	"context"
	"errors"
	"regexp"
	"strings"
	"time"
	"unicode"

	"github.com/abs-platform/api/internal/model"
	"github.com/abs-platform/api/internal/repository"
	"github.com/abs-platform/api/pkg/response"
	"github.com/google/uuid"
)

var (
	ErrPostNotFound = errors.New("post not found")
	ErrUnauthorized = errors.New("unauthorized")
)

// PostService handles post business logic
type PostService struct {
	postRepo    repository.PostRepository
	userRepo    repository.UserRepository
	tagRepo     repository.TagRepository
}

// NewPostService creates a new post service
func NewPostService(
	postRepo repository.PostRepository,
	userRepo repository.UserRepository,
	tagRepo repository.TagRepository,
) *PostService {
	return &PostService{
		postRepo:    postRepo,
		userRepo:    userRepo,
		tagRepo:     tagRepo,
	}
}

// PostFilters represents filtering options for posts
type PostFilters struct {
	Category   string
	Tag        string
	Author     string
	Format     model.PostFormat
	Language   string
	Sort       string
	Status     model.PostStatus
	Visibility model.PostVisibility
}

// CreatePostInput represents input for creating a post
type CreatePostInput struct {
	AuthorID        uuid.UUID
	Title           string
	Subtitle        string
	Content         string
	CoverImageURL   string
	Format          model.PostFormat
	Visibility      model.PostVisibility
	Language        string
	Tags            []string
	CategoryID      *uuid.UUID
	SeriesID        *uuid.UUID
	OrganizationID  *uuid.UUID
	CommunityID     *uuid.UUID
	CanonicalURL    string
	MetaTitle       string
	MetaDescription string
	IsDraft         bool
}

// UpdatePostInput represents input for updating a post
type UpdatePostInput struct {
	Title           *string
	Subtitle        *string
	Content         *string
	CoverImageURL   *string
	Format          *model.PostFormat
	Visibility      *model.PostVisibility
	Tags            []string
	CategoryID      *uuid.UUID
	CanonicalURL    *string
	MetaTitle       *string
	MetaDescription *string
}

// List returns paginated posts
func (s *PostService) List(ctx context.Context, filters PostFilters, pagination response.Pagination, userID *uuid.UUID) ([]*model.Post, int64, error) {
	// Set default filters
	if filters.Status == "" {
		filters.Status = model.PostStatusPublished
	}
	if filters.Visibility == "" {
		filters.Visibility = model.VisibilityPublic
	}
	if filters.Sort == "" {
		filters.Sort = "latest"
	}

	return s.postRepo.List(ctx, filters, pagination.PerPage, pagination.Offset)
}

// GetBySlug returns a post by its slug
func (s *PostService) GetBySlug(ctx context.Context, slug string, userID *uuid.UUID) (*model.Post, error) {
	post, err := s.postRepo.FindBySlug(ctx, slug)
	if err != nil {
		return nil, ErrPostNotFound
	}

	// Check visibility permissions
	if !s.canView(post, userID) {
		return nil, ErrPostNotFound
	}

	// Load author
	author, _ := s.userRepo.FindByID(ctx, post.AuthorID)
	post.Author = author

	// Load tags
	tags, _ := s.tagRepo.FindByPostID(ctx, post.ID)
	post.Tags = tags

	return post, nil
}

// Create creates a new post
func (s *PostService) Create(ctx context.Context, input CreatePostInput) (*model.Post, error) {
	// Get author
	author, err := s.userRepo.FindByID(ctx, input.AuthorID)
	if err != nil {
		return nil, err
	}

	// Generate slug
	slug := s.generateSlug(input.Title)

	// Calculate reading time (rough estimate: 200 words per minute)
	wordCount := len(strings.Fields(stripHTMLTags(input.Content)))
	readingTime := wordCount / 200
	if readingTime < 1 {
		readingTime = 1
	}

	// Determine status based on user role and draft flag
	status := model.PostStatusPending
	if input.IsDraft {
		status = model.PostStatusDraft
	} else if author.CanPublishDirectly() {
		status = model.PostStatusPublished
	}

	// Create post
	now := time.Now()
	post := &model.Post{
		ID:              uuid.New(),
		AuthorID:        input.AuthorID,
		OrganizationID:  input.OrganizationID,
		CommunityID:     input.CommunityID,
		SeriesID:        input.SeriesID,
		Title:           input.Title,
		Slug:            slug,
		Subtitle:        input.Subtitle,
		Content:         input.Content,
		ContentHTML:     renderTiptapToHTML(input.Content),
		ContentText:     extractTextFromTiptap(input.Content),
		Excerpt:         generateExcerpt(input.Content, 160),
		CoverImageURL:   input.CoverImageURL,
		Language:        input.Language,
		Format:          input.Format,
		Status:          status,
		Visibility:      input.Visibility,
		ReadingTime:     readingTime,
		CanonicalURL:    input.CanonicalURL,
		MetaTitle:       input.MetaTitle,
		MetaDescription: input.MetaDescription,
		CreatedAt:       now,
		UpdatedAt:       now,
	}

	if status == model.PostStatusPublished {
		post.PublishedAt = &now
	}

	// Save post
	if err := s.postRepo.Create(ctx, post); err != nil {
		return nil, err
	}

	// Process tags
	if len(input.Tags) > 0 {
		s.processTags(ctx, post.ID, input.Tags)
	}

	// Update author's post count
	author.PostsCount++
	s.userRepo.Update(ctx, author)

	post.Author = author
	return post, nil
}

// Update updates a post
func (s *PostService) Update(ctx context.Context, postID, userID uuid.UUID, input UpdatePostInput) (*model.Post, error) {
	post, err := s.postRepo.FindByID(ctx, postID)
	if err != nil {
		return nil, ErrPostNotFound
	}

	// Check ownership
	if post.AuthorID != userID {
		return nil, ErrUnauthorized
	}

	// Update fields
	if input.Title != nil {
		post.Title = *input.Title
		post.Slug = s.generateSlug(*input.Title)
	}
	if input.Subtitle != nil {
		post.Subtitle = *input.Subtitle
	}
	if input.Content != nil {
		post.Content = *input.Content
		post.ContentHTML = renderTiptapToHTML(*input.Content)
		post.ContentText = extractTextFromTiptap(*input.Content)
		post.Excerpt = generateExcerpt(*input.Content, 160)
	}
	if input.CoverImageURL != nil {
		post.CoverImageURL = *input.CoverImageURL
	}
	if input.Format != nil {
		post.Format = *input.Format
	}
	if input.Visibility != nil {
		post.Visibility = *input.Visibility
	}
	if input.CanonicalURL != nil {
		post.CanonicalURL = *input.CanonicalURL
	}
	if input.MetaTitle != nil {
		post.MetaTitle = *input.MetaTitle
	}
	if input.MetaDescription != nil {
		post.MetaDescription = *input.MetaDescription
	}

	post.UpdatedAt = time.Now()

	if err := s.postRepo.Update(ctx, post); err != nil {
		return nil, err
	}

	// Update tags if provided
	if input.Tags != nil {
		s.processTags(ctx, post.ID, input.Tags)
	}

	return post, nil
}

// Delete soft deletes a post
func (s *PostService) Delete(ctx context.Context, postID, userID uuid.UUID) error {
	post, err := s.postRepo.FindByID(ctx, postID)
	if err != nil {
		return ErrPostNotFound
	}

	// Check ownership
	if post.AuthorID != userID {
		// TODO: Check if user is admin
		return ErrUnauthorized
	}

	return s.postRepo.Delete(ctx, postID)
}

// Clap adds claps to a post
func (s *PostService) Clap(ctx context.Context, postID, userID uuid.UUID, count int) (int, error) {
	return s.postRepo.AddClaps(ctx, postID, userID, count)
}

// Bookmark saves a post to user's bookmarks
func (s *PostService) Bookmark(ctx context.Context, postID, userID uuid.UUID) error {
	return s.postRepo.Bookmark(ctx, postID, userID)
}

// RemoveBookmark removes a post from user's bookmarks
func (s *PostService) RemoveBookmark(ctx context.Context, postID, userID uuid.UUID) error {
	return s.postRepo.RemoveBookmark(ctx, postID, userID)
}

// IncrementViews increments post view count
func (s *PostService) IncrementViews(ctx context.Context, postID uuid.UUID, userID *uuid.UUID) {
	s.postRepo.IncrementViews(ctx, postID, userID)
}

// Helper functions

func (s *PostService) canView(post *model.Post, userID *uuid.UUID) bool {
	switch post.Visibility {
	case model.VisibilityPublic:
		return true
	case model.VisibilityUnlisted:
		return true // Unlisted can be viewed with direct link
	case model.VisibilityMembersOnly:
		return userID != nil
	case model.VisibilityPrivate:
		if userID == nil {
			return false
		}
		return post.AuthorID == *userID // TODO: Check community membership
	default:
		return false
	}
}

func (s *PostService) generateSlug(title string) string {
	// Convert to lowercase
	slug := strings.ToLower(title)

	// Replace spaces with hyphens
	slug = strings.ReplaceAll(slug, " ", "-")

	// Remove non-alphanumeric characters except hyphens
	reg := regexp.MustCompile("[^a-z0-9-]+")
	slug = reg.ReplaceAllString(slug, "")

	// Remove multiple consecutive hyphens
	reg = regexp.MustCompile("-+")
	slug = reg.ReplaceAllString(slug, "-")

	// Trim hyphens from start and end
	slug = strings.Trim(slug, "-")

	// Limit length
	if len(slug) > 100 {
		slug = slug[:100]
	}

	// Add unique suffix
	slug = slug + "-" + uuid.New().String()[:8]

	return slug
}

func (s *PostService) processTags(ctx context.Context, postID uuid.UUID, tagNames []string) {
	// Remove existing tags
	s.tagRepo.RemovePostTags(ctx, postID)

	// Add new tags
	for _, name := range tagNames {
		name = strings.ToLower(strings.TrimSpace(name))
		name = strings.TrimPrefix(name, "#")
		if name == "" {
			continue
		}

		// Find or create tag
		tag, err := s.tagRepo.FindByName(ctx, name)
		if err != nil {
			// Create new tag
			tag = &model.Tag{
				ID:   uuid.New(),
				Name: name,
				Slug: name,
			}
			s.tagRepo.Create(ctx, tag)
		}

		// Link tag to post
		s.tagRepo.AddPostTag(ctx, postID, tag.ID)
	}
}

// renderTiptapToHTML converts Tiptap JSON to HTML
func renderTiptapToHTML(content string) string {
	// TODO: Implement Tiptap JSON to HTML conversion
	return content
}

// extractTextFromTiptap extracts plain text from Tiptap JSON
func extractTextFromTiptap(content string) string {
	// TODO: Implement text extraction from Tiptap JSON
	return stripHTMLTags(content)
}

// generateExcerpt creates a short excerpt from content
func generateExcerpt(content string, maxLength int) string {
	text := stripHTMLTags(content)
	text = strings.TrimSpace(text)

	if len(text) <= maxLength {
		return text
	}

	// Find the last space before maxLength
	truncated := text[:maxLength]
	lastSpace := strings.LastIndex(truncated, " ")
	if lastSpace > 0 {
		truncated = truncated[:lastSpace]
	}

	return truncated + "..."
}

// stripHTMLTags removes HTML tags from text
func stripHTMLTags(s string) string {
	var builder strings.Builder
	inTag := false

	for _, r := range s {
		if r == '<' {
			inTag = true
			continue
		}
		if r == '>' {
			inTag = false
			continue
		}
		if !inTag {
			if unicode.IsSpace(r) {
				builder.WriteRune(' ')
			} else {
				builder.WriteRune(r)
			}
		}
	}

	// Clean up multiple spaces
	result := builder.String()
	reg := regexp.MustCompile(`\s+`)
	return reg.ReplaceAllString(result, " ")
}
