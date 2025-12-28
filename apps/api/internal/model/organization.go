package model

import (
	"time"

	"github.com/google/uuid"
)

// OrganizationType represents the type of organization
type OrganizationType string

const (
	OrgTypeCompany    OrganizationType = "company"
	OrgTypeStartup    OrganizationType = "startup"
	OrgTypeAgency     OrganizationType = "agency"
	OrgTypeEducation  OrganizationType = "education"
	OrgTypeNonProfit  OrganizationType = "non_profit"
	OrgTypeGovernment OrganizationType = "government"
)

// OrganizationMemberRole represents a user's role within an organization
type OrgMemberRole string

const (
	OrgRoleOwner     OrgMemberRole = "owner"     // Full control, billing
	OrgRoleAdmin     OrgMemberRole = "admin"     // Manage members, settings
	OrgRoleEditor    OrgMemberRole = "editor"    // Publish content
	OrgRoleRecruiter OrgMemberRole = "recruiter" // Manage jobs only
	OrgRoleMember    OrgMemberRole = "member"    // Basic access
)

// OrganizationPlan represents the subscription tier
type OrgPlan string

const (
	PlanFree       OrgPlan = "free"
	PlanPro        OrgPlan = "pro"
	PlanBusiness   OrgPlan = "business"
	PlanEnterprise OrgPlan = "enterprise"
)

// Organization represents a company/team profile
type Organization struct {
	ID              uuid.UUID        `json:"id" db:"id"`
	OwnerID         uuid.UUID        `json:"owner_id" db:"owner_id"`

	// Basic Info
	Name            string           `json:"name" db:"name"`
	Slug            string           `json:"slug" db:"slug"`
	Tagline         string           `json:"tagline" db:"tagline"`
	Description     string           `json:"description" db:"description"`
	LogoURL         string           `json:"logo_url" db:"logo_url"`
	CoverURL        string           `json:"cover_url" db:"cover_url"`

	// Details
	Type            OrganizationType `json:"type" db:"type"`
	Industry        string           `json:"industry" db:"industry"`
	Size            string           `json:"size" db:"size"` // 1-10, 11-50, 51-200, 201-500, 500+
	FoundedYear     int              `json:"founded_year" db:"founded_year"`

	// Contact
	Website         string           `json:"website" db:"website"`
	Email           string           `json:"email" db:"email"`
	Location        string           `json:"location" db:"location"`

	// Social
	GitHubURL       string           `json:"github_url" db:"github_url"`
	LinkedInURL     string           `json:"linkedin_url" db:"linkedin_url"`
	TwitterURL      string           `json:"twitter_url" db:"twitter_url"`

	// Branding
	BrandColor      string           `json:"brand_color" db:"brand_color"`

	// Subscription
	Plan            OrgPlan          `json:"plan" db:"plan"`
	PlanExpiresAt   *time.Time       `json:"plan_expires_at" db:"plan_expires_at"`

	// Stats
	MembersCount    int              `json:"members_count" db:"members_count"`
	PostsCount      int              `json:"posts_count" db:"posts_count"`
	FollowersCount  int              `json:"followers_count" db:"followers_count"`
	JobsCount       int              `json:"jobs_count" db:"jobs_count"`

	// Verification
	IsVerified      bool             `json:"is_verified" db:"is_verified"`
	VerifiedAt      *time.Time       `json:"verified_at" db:"verified_at"`

	// Timestamps
	CreatedAt       time.Time        `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time        `json:"updated_at" db:"updated_at"`
	DeletedAt       *time.Time       `json:"-" db:"deleted_at"`
}

// OrganizationMember represents a user's membership in an organization
type OrganizationMember struct {
	OrganizationID uuid.UUID     `json:"organization_id" db:"organization_id"`
	UserID         uuid.UUID     `json:"user_id" db:"user_id"`
	Role           OrgMemberRole `json:"role" db:"role"`
	Title          string        `json:"title" db:"title"` // e.g., "Senior Developer"
	IsPublic       bool          `json:"is_public" db:"is_public"` // Show on public page
	JoinedAt       time.Time     `json:"joined_at" db:"joined_at"`
	InvitedBy      *uuid.UUID    `json:"invited_by" db:"invited_by"`
}

// OrganizationInvite represents a pending invitation
type OrganizationInvite struct {
	ID             uuid.UUID     `json:"id" db:"id"`
	OrganizationID uuid.UUID     `json:"organization_id" db:"organization_id"`
	Email          string        `json:"email" db:"email"`
	Role           OrgMemberRole `json:"role" db:"role"`
	Token          string        `json:"-" db:"token"`
	InvitedBy      uuid.UUID     `json:"invited_by" db:"invited_by"`
	ExpiresAt      time.Time     `json:"expires_at" db:"expires_at"`
	CreatedAt      time.Time     `json:"created_at" db:"created_at"`
	AcceptedAt     *time.Time    `json:"accepted_at" db:"accepted_at"`
}

// OrganizationTechStack represents the technologies used by an org
type OrganizationTechStack struct {
	ID             uuid.UUID `json:"id" db:"id"`
	OrganizationID uuid.UUID `json:"organization_id" db:"organization_id"`
	TechName       string    `json:"tech_name" db:"tech_name"`
	IconURL        string    `json:"icon_url" db:"icon_url"`
	Category       string    `json:"category" db:"category"` // frontend, backend, devops, etc.
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
}

// OrganizationFollow represents following an organization
type OrganizationFollow struct {
	UserID         uuid.UUID `json:"user_id" db:"user_id"`
	OrganizationID uuid.UUID `json:"organization_id" db:"organization_id"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
}

// CanPublish checks if a member role can publish content
func (r OrgMemberRole) CanPublish() bool {
	return r == OrgRoleOwner || r == OrgRoleAdmin || r == OrgRoleEditor
}

// CanManageMembers checks if a role can manage team members
func (r OrgMemberRole) CanManageMembers() bool {
	return r == OrgRoleOwner || r == OrgRoleAdmin
}

// CanManageJobs checks if a role can manage job postings
func (r OrgMemberRole) CanManageJobs() bool {
	return r == OrgRoleOwner || r == OrgRoleAdmin || r == OrgRoleRecruiter
}
