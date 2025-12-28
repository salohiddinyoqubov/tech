package model

import (
	"time"

	"github.com/google/uuid"
)

// UserRole represents the global role of a user
type UserRole string

const (
	RoleGuest     UserRole = "guest"
	RoleRookie    UserRole = "rookie"    // 0-50 karma
	RoleMember    UserRole = "member"    // 50-200 karma
	RoleExpert    UserRole = "expert"    // 200-500 karma
	RoleLegend    UserRole = "legend"    // 500+ karma
	RoleModerator UserRole = "moderator"
	RoleAdmin     UserRole = "admin"
	RoleSuperAdmin UserRole = "super_admin"
)

// UserStatus represents the status of a user profile
type UserStatus string

const (
	StatusOpenToWork UserStatus = "open_to_work"
	StatusHiring     UserStatus = "hiring"
	StatusMentor     UserStatus = "mentor"
	StatusCollab     UserStatus = "collab"
	StatusNone       UserStatus = ""
)

// User represents a registered user
type User struct {
	ID              uuid.UUID  `json:"id" db:"id"`
	Email           string     `json:"email" db:"email"`
	Username        string     `json:"username" db:"username"`
	PasswordHash    string     `json:"-" db:"password_hash"`
	FullName        string     `json:"full_name" db:"full_name"`
	Bio             string     `json:"bio" db:"bio"`
	AvatarURL       string     `json:"avatar_url" db:"avatar_url"`
	CoverURL        string     `json:"cover_url" db:"cover_url"`
	Website         string     `json:"website" db:"website"`
	Location        string     `json:"location" db:"location"`

	// Social links
	GitHubURL       string     `json:"github_url" db:"github_url"`
	LinkedInURL     string     `json:"linkedin_url" db:"linkedin_url"`
	TwitterURL      string     `json:"twitter_url" db:"twitter_url"`
	TelegramURL     string     `json:"telegram_url" db:"telegram_url"`

	// Gamification
	Karma           int        `json:"karma" db:"karma"`
	TrustScore      int        `json:"trust_score" db:"trust_score"`
	Role            UserRole   `json:"role" db:"role"`
	Status          UserStatus `json:"status" db:"status"`
	IsVerified      bool       `json:"is_verified" db:"is_verified"`

	// Preferences
	PreferredLang   string     `json:"preferred_lang" db:"preferred_lang"`
	EmailVerified   bool       `json:"email_verified" db:"email_verified"`
	PhoneNumber     string     `json:"phone_number" db:"phone_number"`
	PhoneVerified   bool       `json:"phone_verified" db:"phone_verified"`

	// Stats (denormalized for performance)
	PostsCount      int        `json:"posts_count" db:"posts_count"`
	FollowersCount  int        `json:"followers_count" db:"followers_count"`
	FollowingCount  int        `json:"following_count" db:"following_count"`
	TotalClaps      int        `json:"total_claps" db:"total_claps"`

	// Timestamps
	CreatedAt       time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at" db:"updated_at"`
	LastActiveAt    *time.Time `json:"last_active_at" db:"last_active_at"`
	DeletedAt       *time.Time `json:"-" db:"deleted_at"`
}

// UserTechStack represents technologies a user knows
type UserTechStack struct {
	ID        uuid.UUID `json:"id" db:"id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	TechName  string    `json:"tech_name" db:"tech_name"`
	IconURL   string    `json:"icon_url" db:"icon_url"`
	Level     string    `json:"level" db:"level"` // beginner, intermediate, advanced, expert
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// UserFollow represents a follow relationship
type UserFollow struct {
	FollowerID  uuid.UUID `json:"follower_id" db:"follower_id"`
	FollowingID uuid.UUID `json:"following_id" db:"following_id"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
}

// ComputeRole determines the role based on karma
func (u *User) ComputeRole() UserRole {
	if u.Role == RoleSuperAdmin || u.Role == RoleAdmin || u.Role == RoleModerator {
		return u.Role // Don't override admin roles
	}

	switch {
	case u.Karma >= 500:
		return RoleLegend
	case u.Karma >= 200:
		return RoleExpert
	case u.Karma >= 50:
		return RoleMember
	default:
		return RoleRookie
	}
}

// CanPublishDirectly checks if user can publish without moderation
func (u *User) CanPublishDirectly() bool {
	return u.Role == RoleMember || u.Role == RoleExpert || u.Role == RoleLegend ||
		u.Role == RoleModerator || u.Role == RoleAdmin || u.Role == RoleSuperAdmin
}

// CanModerate checks if user has moderation privileges
func (u *User) CanModerate() bool {
	return u.Role == RoleModerator || u.Role == RoleAdmin || u.Role == RoleSuperAdmin
}
