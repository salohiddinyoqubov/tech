package model

import (
	"time"

	"github.com/google/uuid"
)

// JobType represents the employment type
type JobType string

const (
	JobTypeFullTime   JobType = "full_time"
	JobTypePartTime   JobType = "part_time"
	JobTypeContract   JobType = "contract"
	JobTypeFreelance  JobType = "freelance"
	JobTypeInternship JobType = "internship"
)

// JobLocation represents the work location type
type JobLocation string

const (
	JobLocationRemote  JobLocation = "remote"
	JobLocationOnsite  JobLocation = "onsite"
	JobLocationHybrid  JobLocation = "hybrid"
)

// JobExperience represents required experience level
type JobExperience string

const (
	JobExpIntern    JobExperience = "intern"
	JobExpJunior    JobExperience = "junior"    // 0-2 years
	JobExpMiddle    JobExperience = "middle"    // 2-5 years
	JobExpSenior    JobExperience = "senior"    // 5-8 years
	JobExpLead      JobExperience = "lead"      // 8+ years
	JobExpPrincipal JobExperience = "principal" // 10+ years
)

// Job represents a job posting
type Job struct {
	ID               uuid.UUID      `json:"id" db:"id"`
	OrganizationID   uuid.UUID      `json:"organization_id" db:"organization_id"`
	PostedByID       uuid.UUID      `json:"posted_by_id" db:"posted_by_id"`

	// Basic Info
	Title            string         `json:"title" db:"title"`
	Slug             string         `json:"slug" db:"slug"`
	Description      string         `json:"description" db:"description"` // Rich text
	DescriptionHTML  string         `json:"description_html" db:"description_html"`

	// Details
	Type             JobType        `json:"type" db:"type"`
	Location         JobLocation    `json:"location" db:"location"`
	Experience       JobExperience  `json:"experience" db:"experience"`
	Department       string         `json:"department" db:"department"` // Engineering, Marketing, etc.

	// Location Details
	City             string         `json:"city" db:"city"`
	Country          string         `json:"country" db:"country"`
	Timezone         string         `json:"timezone" db:"timezone"`

	// Salary
	SalaryMin        *int           `json:"salary_min,omitempty" db:"salary_min"`
	SalaryMax        *int           `json:"salary_max,omitempty" db:"salary_max"`
	SalaryCurrency   string         `json:"salary_currency" db:"salary_currency"`
	SalaryPeriod     string         `json:"salary_period" db:"salary_period"` // yearly, monthly

	// Application
	ApplyURL         string         `json:"apply_url" db:"apply_url"`
	ApplyEmail       string         `json:"apply_email" db:"apply_email"`
	ApplicationDeadline *time.Time  `json:"application_deadline" db:"application_deadline"`

	// Status
	IsActive         bool           `json:"is_active" db:"is_active"`
	IsFeatured       bool           `json:"is_featured" db:"is_featured"`
	ViewsCount       int            `json:"views_count" db:"views_count"`
	ApplicationsCount int           `json:"applications_count" db:"applications_count"`

	// Timestamps
	CreatedAt        time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at" db:"updated_at"`
	ExpiresAt        *time.Time     `json:"expires_at" db:"expires_at"`
	DeletedAt        *time.Time     `json:"-" db:"deleted_at"`

	// Relations
	Organization     *Organization  `json:"organization,omitempty"`
	Tags             []Tag          `json:"tags,omitempty"`
	Skills           []JobSkill     `json:"skills,omitempty"`
}

// JobSkill represents a required skill for a job
type JobSkill struct {
	ID        uuid.UUID `json:"id" db:"id"`
	JobID     uuid.UUID `json:"job_id" db:"job_id"`
	Name      string    `json:"name" db:"name"`
	IconURL   string    `json:"icon_url" db:"icon_url"`
	IsRequired bool     `json:"is_required" db:"is_required"`
}

// JobApplication represents a user's application to a job
type JobApplication struct {
	ID           uuid.UUID  `json:"id" db:"id"`
	JobID        uuid.UUID  `json:"job_id" db:"job_id"`
	UserID       uuid.UUID  `json:"user_id" db:"user_id"`
	CoverLetter  string     `json:"cover_letter" db:"cover_letter"`
	ResumeURL    string     `json:"resume_url" db:"resume_url"`
	Status       string     `json:"status" db:"status"` // pending, reviewed, interview, rejected, hired
	Notes        string     `json:"notes" db:"notes"`   // Internal notes
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at" db:"updated_at"`
}

// JobBookmark represents a saved job
type JobBookmark struct {
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	JobID     uuid.UUID `json:"job_id" db:"job_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// Event represents an upcoming tech event
type Event struct {
	ID              uuid.UUID  `json:"id" db:"id"`
	OrganizationID  *uuid.UUID `json:"organization_id" db:"organization_id"`
	CreatorID       uuid.UUID  `json:"creator_id" db:"creator_id"`

	// Basic Info
	Title           string     `json:"title" db:"title"`
	Slug            string     `json:"slug" db:"slug"`
	Description     string     `json:"description" db:"description"`
	DescriptionHTML string     `json:"description_html" db:"description_html"`
	CoverURL        string     `json:"cover_url" db:"cover_url"`

	// Details
	Type            string     `json:"type" db:"type"` // conference, meetup, workshop, webinar
	Format          string     `json:"format" db:"format"` // online, offline, hybrid
	Venue           string     `json:"venue" db:"venue"`
	City            string     `json:"city" db:"city"`
	Country         string     `json:"country" db:"country"`
	StreamURL       string     `json:"stream_url" db:"stream_url"`

	// Timing
	StartsAt        time.Time  `json:"starts_at" db:"starts_at"`
	EndsAt          time.Time  `json:"ends_at" db:"ends_at"`
	Timezone        string     `json:"timezone" db:"timezone"`

	// Registration
	RegistrationURL string    `json:"registration_url" db:"registration_url"`
	IsFree          bool       `json:"is_free" db:"is_free"`
	Price           *float64   `json:"price" db:"price"`
	Currency        string     `json:"currency" db:"currency"`
	Capacity        *int       `json:"capacity" db:"capacity"`

	// Stats
	AttendeesCount  int        `json:"attendees_count" db:"attendees_count"`
	InterestedCount int        `json:"interested_count" db:"interested_count"`

	// Status
	IsPublished     bool       `json:"is_published" db:"is_published"`
	IsFeatured      bool       `json:"is_featured" db:"is_featured"`

	CreatedAt       time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at" db:"updated_at"`
}

// EventAttendee represents event registration
type EventAttendee struct {
	EventID   uuid.UUID `json:"event_id" db:"event_id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	Status    string    `json:"status" db:"status"` // registered, interested, attended
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
