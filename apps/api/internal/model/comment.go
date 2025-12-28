package model

import (
	"time"

	"github.com/google/uuid"
)

// CommentType represents where the comment is attached
type CommentType string

const (
	CommentTypePost      CommentType = "post"
	CommentTypeHighlight CommentType = "highlight" // Inline comment on specific text
)

// Comment represents a comment on a post
type Comment struct {
	ID           uuid.UUID   `json:"id" db:"id"`
	PostID       uuid.UUID   `json:"post_id" db:"post_id"`
	AuthorID     uuid.UUID   `json:"author_id" db:"author_id"`
	ParentID     *uuid.UUID  `json:"parent_id,omitempty" db:"parent_id"` // For nested comments
	RootID       *uuid.UUID  `json:"root_id,omitempty" db:"root_id"`     // Top-level comment ID

	// Comment Type
	Type         CommentType `json:"type" db:"type"`
	HighlightKey *string     `json:"highlight_key,omitempty" db:"highlight_key"` // For inline comments

	// Content
	Content      string      `json:"content" db:"content"`      // Markdown
	ContentHTML  string      `json:"content_html" db:"content_html"`

	// Engagement
	UpvotesCount   int       `json:"upvotes_count" db:"upvotes_count"`
	DownvotesCount int       `json:"downvotes_count" db:"downvotes_count"`
	RepliesCount   int       `json:"replies_count" db:"replies_count"`

	// Status
	IsEdited     bool        `json:"is_edited" db:"is_edited"`
	IsPinned     bool        `json:"is_pinned" db:"is_pinned"`
	IsHidden     bool        `json:"is_hidden" db:"is_hidden"` // Shadow banned

	// Timestamps
	CreatedAt    time.Time   `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time   `json:"updated_at" db:"updated_at"`
	DeletedAt    *time.Time  `json:"-" db:"deleted_at"`

	// Relations
	Author       *User       `json:"author,omitempty"`
	Replies      []Comment   `json:"replies,omitempty"`
}

// CommentVote represents a vote on a comment
type CommentVote struct {
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	CommentID uuid.UUID `json:"comment_id" db:"comment_id"`
	Value     int       `json:"value" db:"value"` // 1 for upvote, -1 for downvote
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// Notification represents a user notification
type Notification struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	UserID      uuid.UUID  `json:"user_id" db:"user_id"`
	Type        string     `json:"type" db:"type"` // follow, comment, clap, mention, etc.
	Title       string     `json:"title" db:"title"`
	Message     string     `json:"message" db:"message"`
	Link        string     `json:"link" db:"link"`
	ImageURL    string     `json:"image_url" db:"image_url"`

	// Actor (who triggered the notification)
	ActorID     *uuid.UUID `json:"actor_id" db:"actor_id"`
	ActorName   string     `json:"actor_name" db:"actor_name"`
	ActorAvatar string     `json:"actor_avatar" db:"actor_avatar"`

	// Related entities
	PostID      *uuid.UUID `json:"post_id" db:"post_id"`
	CommentID   *uuid.UUID `json:"comment_id" db:"comment_id"`

	// Status
	IsRead      bool       `json:"is_read" db:"is_read"`
	ReadAt      *time.Time `json:"read_at" db:"read_at"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
}

// Report represents a content report/flag
type Report struct {
	ID           uuid.UUID  `json:"id" db:"id"`
	ReporterID   uuid.UUID  `json:"reporter_id" db:"reporter_id"`

	// What is being reported
	TargetType   string     `json:"target_type" db:"target_type"` // post, comment, user
	TargetID     uuid.UUID  `json:"target_id" db:"target_id"`

	// Report details
	Reason       string     `json:"reason" db:"reason"` // spam, harassment, hate_speech, etc.
	Description  string     `json:"description" db:"description"`

	// Resolution
	Status       string     `json:"status" db:"status"` // pending, reviewed, resolved, dismissed
	ReviewedBy   *uuid.UUID `json:"reviewed_by" db:"reviewed_by"`
	ReviewedAt   *time.Time `json:"reviewed_at" db:"reviewed_at"`
	Resolution   string     `json:"resolution" db:"resolution"`

	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
}

// ReadingHistory tracks user's reading activity
type ReadingHistory struct {
	UserID        uuid.UUID `json:"user_id" db:"user_id"`
	PostID        uuid.UUID `json:"post_id" db:"post_id"`
	ReadProgress  float64   `json:"read_progress" db:"read_progress"` // 0.0 to 1.0
	TimeSpent     int       `json:"time_spent" db:"time_spent"`       // Seconds
	LastReadAt    time.Time `json:"last_read_at" db:"last_read_at"`
	IsCompleted   bool      `json:"is_completed" db:"is_completed"`
}

// SearchHistory tracks user's search queries
type SearchHistory struct {
	ID        uuid.UUID `json:"id" db:"id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	Query     string    `json:"query" db:"query"`
	Results   int       `json:"results" db:"results"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
