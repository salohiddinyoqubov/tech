package model

import (
	"time"

	"github.com/google/uuid"
)

// CommunityType represents the type of community
type CommunityType string

const (
	CommunityTypePublic   CommunityType = "public"   // Anyone can join
	CommunityTypePrivate  CommunityType = "private"  // Request to join
	CommunityTypePaid     CommunityType = "paid"     // Subscription required
	CommunityTypeInvite   CommunityType = "invite"   // Invite only
)

// CommunityMemberRole represents a user's role in a community
type CommunityMemberRole string

const (
	CommunityRoleOwner     CommunityMemberRole = "owner"
	CommunityRoleModerator CommunityMemberRole = "moderator"
	CommunityRoleMember    CommunityMemberRole = "member"
)

// Community represents a group/club
type Community struct {
	ID              uuid.UUID     `json:"id" db:"id"`
	OwnerID         uuid.UUID     `json:"owner_id" db:"owner_id"`

	// Basic Info
	Name            string        `json:"name" db:"name"`
	Slug            string        `json:"slug" db:"slug"`
	Description     string        `json:"description" db:"description"`
	Rules           string        `json:"rules" db:"rules"`
	IconURL         string        `json:"icon_url" db:"icon_url"`
	CoverURL        string        `json:"cover_url" db:"cover_url"`

	// Settings
	Type            CommunityType `json:"type" db:"type"`
	IsOfficial      bool          `json:"is_official" db:"is_official"` // Official platform community
	AllowPosts      bool          `json:"allow_posts" db:"allow_posts"` // Members can post
	RequireApproval bool          `json:"require_approval" db:"require_approval"` // Posts need approval

	// Paid Community
	Price           *float64      `json:"price,omitempty" db:"price"`
	Currency        string        `json:"currency" db:"currency"`
	BillingPeriod   string        `json:"billing_period" db:"billing_period"` // monthly, yearly

	// Stats
	MembersCount    int           `json:"members_count" db:"members_count"`
	PostsCount      int           `json:"posts_count" db:"posts_count"`

	// Theme/Branding
	PrimaryColor    string        `json:"primary_color" db:"primary_color"`

	// Timestamps
	CreatedAt       time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time     `json:"updated_at" db:"updated_at"`
	DeletedAt       *time.Time    `json:"-" db:"deleted_at"`
}

// CommunityMember represents a user's membership in a community
type CommunityMember struct {
	CommunityID uuid.UUID           `json:"community_id" db:"community_id"`
	UserID      uuid.UUID           `json:"user_id" db:"user_id"`
	Role        CommunityMemberRole `json:"role" db:"role"`
	JoinedAt    time.Time           `json:"joined_at" db:"joined_at"`
	ExpiresAt   *time.Time          `json:"expires_at" db:"expires_at"` // For paid communities
}

// CommunityJoinRequest represents a pending join request
type CommunityJoinRequest struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	CommunityID uuid.UUID  `json:"community_id" db:"community_id"`
	UserID      uuid.UUID  `json:"user_id" db:"user_id"`
	Message     string     `json:"message" db:"message"`
	Status      string     `json:"status" db:"status"` // pending, approved, rejected
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	ReviewedBy  *uuid.UUID `json:"reviewed_by" db:"reviewed_by"`
	ReviewedAt  *time.Time `json:"reviewed_at" db:"reviewed_at"`
}

// CommunityInvite represents an invitation to a community
type CommunityInvite struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	CommunityID uuid.UUID  `json:"community_id" db:"community_id"`
	InvitedBy   uuid.UUID  `json:"invited_by" db:"invited_by"`
	Email       string     `json:"email" db:"email"`
	Token       string     `json:"-" db:"token"`
	ExpiresAt   time.Time  `json:"expires_at" db:"expires_at"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	AcceptedAt  *time.Time `json:"accepted_at" db:"accepted_at"`
}

// TagFollow represents following a tag/topic
type TagFollow struct {
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	TagID     uuid.UUID `json:"tag_id" db:"tag_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// CanModerate checks if a role has moderation privileges
func (r CommunityMemberRole) CanModerate() bool {
	return r == CommunityRoleOwner || r == CommunityRoleModerator
}

// CanManage checks if a role can manage community settings
func (r CommunityMemberRole) CanManage() bool {
	return r == CommunityRoleOwner
}
