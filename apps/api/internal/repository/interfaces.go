package repository

import (
	"context"

	"github.com/abs-platform/api/internal/model"
	"github.com/abs-platform/api/internal/service"
	"github.com/google/uuid"
)

// UserRepository defines user data access operations
type UserRepository interface {
	Create(ctx context.Context, user *model.User) error
	Update(ctx context.Context, user *model.User) error
	Delete(ctx context.Context, id uuid.UUID) error
	FindByID(ctx context.Context, id uuid.UUID) (*model.User, error)
	FindByEmail(ctx context.Context, email string) (*model.User, error)
	FindByUsername(ctx context.Context, username string) (*model.User, error)
	List(ctx context.Context, limit, offset int) ([]*model.User, int64, error)

	// Follows
	Follow(ctx context.Context, followerID, followingID uuid.UUID) error
	Unfollow(ctx context.Context, followerID, followingID uuid.UUID) error
	GetFollowers(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*model.User, int64, error)
	GetFollowing(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*model.User, int64, error)
	IsFollowing(ctx context.Context, followerID, followingID uuid.UUID) (bool, error)

	// Karma
	UpdateKarma(ctx context.Context, userID uuid.UUID, delta int) error
}

// PostRepository defines post data access operations
type PostRepository interface {
	Create(ctx context.Context, post *model.Post) error
	Update(ctx context.Context, post *model.Post) error
	Delete(ctx context.Context, id uuid.UUID) error
	FindByID(ctx context.Context, id uuid.UUID) (*model.Post, error)
	FindBySlug(ctx context.Context, slug string) (*model.Post, error)
	List(ctx context.Context, filters service.PostFilters, limit, offset int) ([]*model.Post, int64, error)

	// User-specific
	ListByAuthor(ctx context.Context, authorID uuid.UUID, limit, offset int) ([]*model.Post, int64, error)
	ListByOrganization(ctx context.Context, orgID uuid.UUID, limit, offset int) ([]*model.Post, int64, error)
	ListByCommunity(ctx context.Context, communityID uuid.UUID, limit, offset int) ([]*model.Post, int64, error)

	// Engagement
	IncrementViews(ctx context.Context, postID uuid.UUID, userID *uuid.UUID) error
	AddClaps(ctx context.Context, postID, userID uuid.UUID, count int) (int, error)
	GetClapsCount(ctx context.Context, postID uuid.UUID) (int, error)
	GetUserClaps(ctx context.Context, postID, userID uuid.UUID) (int, error)

	// Bookmarks
	Bookmark(ctx context.Context, postID, userID uuid.UUID) error
	RemoveBookmark(ctx context.Context, postID, userID uuid.UUID) error
	IsBookmarked(ctx context.Context, postID, userID uuid.UUID) (bool, error)
	ListBookmarks(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*model.Post, int64, error)

	// Reactions
	AddReaction(ctx context.Context, postID, userID uuid.UUID, emoji string) error
	RemoveReaction(ctx context.Context, postID, userID uuid.UUID) error
	GetReactions(ctx context.Context, postID uuid.UUID) (map[string]int, error)
}

// TagRepository defines tag data access operations
type TagRepository interface {
	Create(ctx context.Context, tag *model.Tag) error
	Update(ctx context.Context, tag *model.Tag) error
	FindByID(ctx context.Context, id uuid.UUID) (*model.Tag, error)
	FindBySlug(ctx context.Context, slug string) (*model.Tag, error)
	FindByName(ctx context.Context, name string) (*model.Tag, error)
	FindByPostID(ctx context.Context, postID uuid.UUID) ([]model.Tag, error)
	List(ctx context.Context, limit, offset int) ([]*model.Tag, int64, error)
	ListTrending(ctx context.Context, limit int) ([]*model.Tag, error)

	// Post-Tag relationships
	AddPostTag(ctx context.Context, postID, tagID uuid.UUID) error
	RemovePostTag(ctx context.Context, postID, tagID uuid.UUID) error
	RemovePostTags(ctx context.Context, postID uuid.UUID) error

	// Following
	Follow(ctx context.Context, userID, tagID uuid.UUID) error
	Unfollow(ctx context.Context, userID, tagID uuid.UUID) error
	IsFollowing(ctx context.Context, userID, tagID uuid.UUID) (bool, error)
	ListFollowedByUser(ctx context.Context, userID uuid.UUID) ([]*model.Tag, error)
}

// CommentRepository defines comment data access operations
type CommentRepository interface {
	Create(ctx context.Context, comment *model.Comment) error
	Update(ctx context.Context, comment *model.Comment) error
	Delete(ctx context.Context, id uuid.UUID) error
	FindByID(ctx context.Context, id uuid.UUID) (*model.Comment, error)
	ListByPost(ctx context.Context, postID uuid.UUID, limit, offset int) ([]*model.Comment, int64, error)
	ListReplies(ctx context.Context, parentID uuid.UUID, limit, offset int) ([]*model.Comment, int64, error)

	// Votes
	Vote(ctx context.Context, commentID, userID uuid.UUID, value int) error
	RemoveVote(ctx context.Context, commentID, userID uuid.UUID) error
	GetVoteCount(ctx context.Context, commentID uuid.UUID) (int, int, error)
}

// OrganizationRepository defines organization data access operations
type OrganizationRepository interface {
	Create(ctx context.Context, org *model.Organization) error
	Update(ctx context.Context, org *model.Organization) error
	Delete(ctx context.Context, id uuid.UUID) error
	FindByID(ctx context.Context, id uuid.UUID) (*model.Organization, error)
	FindBySlug(ctx context.Context, slug string) (*model.Organization, error)
	List(ctx context.Context, limit, offset int) ([]*model.Organization, int64, error)

	// Members
	AddMember(ctx context.Context, orgID, userID uuid.UUID, role model.OrgMemberRole, title string) error
	UpdateMember(ctx context.Context, orgID, userID uuid.UUID, role model.OrgMemberRole, title string) error
	RemoveMember(ctx context.Context, orgID, userID uuid.UUID) error
	GetMember(ctx context.Context, orgID, userID uuid.UUID) (*model.OrganizationMember, error)
	ListMembers(ctx context.Context, orgID uuid.UUID) ([]*model.OrganizationMember, error)

	// Following
	Follow(ctx context.Context, userID, orgID uuid.UUID) error
	Unfollow(ctx context.Context, userID, orgID uuid.UUID) error
	IsFollowing(ctx context.Context, userID, orgID uuid.UUID) (bool, error)
}

// CommunityRepository defines community data access operations
type CommunityRepository interface {
	Create(ctx context.Context, community *model.Community) error
	Update(ctx context.Context, community *model.Community) error
	Delete(ctx context.Context, id uuid.UUID) error
	FindByID(ctx context.Context, id uuid.UUID) (*model.Community, error)
	FindBySlug(ctx context.Context, slug string) (*model.Community, error)
	List(ctx context.Context, limit, offset int) ([]*model.Community, int64, error)

	// Members
	AddMember(ctx context.Context, communityID, userID uuid.UUID, role model.CommunityMemberRole) error
	UpdateMember(ctx context.Context, communityID, userID uuid.UUID, role model.CommunityMemberRole) error
	RemoveMember(ctx context.Context, communityID, userID uuid.UUID) error
	GetMember(ctx context.Context, communityID, userID uuid.UUID) (*model.CommunityMember, error)
	ListMembers(ctx context.Context, communityID uuid.UUID, limit, offset int) ([]*model.CommunityMember, int64, error)
	IsMember(ctx context.Context, communityID, userID uuid.UUID) (bool, error)
}

// NotificationRepository defines notification data access operations
type NotificationRepository interface {
	Create(ctx context.Context, notification *model.Notification) error
	MarkAsRead(ctx context.Context, id uuid.UUID) error
	MarkAllAsRead(ctx context.Context, userID uuid.UUID) error
	Delete(ctx context.Context, id uuid.UUID) error
	ListByUser(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*model.Notification, int64, error)
	GetUnreadCount(ctx context.Context, userID uuid.UUID) (int64, error)
}

// CategoryRepository defines category data access operations
type CategoryRepository interface {
	Create(ctx context.Context, category *model.Category) error
	Update(ctx context.Context, category *model.Category) error
	Delete(ctx context.Context, id uuid.UUID) error
	FindByID(ctx context.Context, id uuid.UUID) (*model.Category, error)
	FindBySlug(ctx context.Context, slug string) (*model.Category, error)
	List(ctx context.Context) ([]*model.Category, error)
}

// JobRepository defines job data access operations
type JobRepository interface {
	Create(ctx context.Context, job *model.Job) error
	Update(ctx context.Context, job *model.Job) error
	Delete(ctx context.Context, id uuid.UUID) error
	FindByID(ctx context.Context, id uuid.UUID) (*model.Job, error)
	FindBySlug(ctx context.Context, slug string) (*model.Job, error)
	List(ctx context.Context, filters map[string]interface{}, limit, offset int) ([]*model.Job, int64, error)
	ListByOrganization(ctx context.Context, orgID uuid.UUID, limit, offset int) ([]*model.Job, int64, error)

	// Bookmarks
	Bookmark(ctx context.Context, jobID, userID uuid.UUID) error
	RemoveBookmark(ctx context.Context, jobID, userID uuid.UUID) error
	IsBookmarked(ctx context.Context, jobID, userID uuid.UUID) (bool, error)
}
