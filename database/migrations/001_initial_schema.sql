-- ABS Platform Database Schema
-- Version: 1.0.0
-- Description: Initial database schema for the ABS Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =====================================================
-- USERS
-- =====================================================

CREATE TYPE user_role AS ENUM ('guest', 'rookie', 'member', 'expert', 'legend', 'moderator', 'admin', 'super_admin');
CREATE TYPE user_status AS ENUM ('open_to_work', 'hiring', 'mentor', 'collab', '');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    cover_url TEXT DEFAULT '',
    website VARCHAR(255) DEFAULT '',
    location VARCHAR(100) DEFAULT '',

    -- Social links
    github_url VARCHAR(255) DEFAULT '',
    linkedin_url VARCHAR(255) DEFAULT '',
    twitter_url VARCHAR(255) DEFAULT '',
    telegram_url VARCHAR(255) DEFAULT '',

    -- Gamification
    karma INTEGER DEFAULT 0,
    trust_score INTEGER DEFAULT 50,
    role user_role DEFAULT 'rookie',
    status user_status DEFAULT '',
    is_verified BOOLEAN DEFAULT FALSE,

    -- Preferences
    preferred_lang VARCHAR(5) DEFAULT 'en',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(20) DEFAULT '',
    phone_verified BOOLEAN DEFAULT FALSE,

    -- Denormalized stats
    posts_count INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    total_claps INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_karma ON users(karma DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;

-- User tech stack
CREATE TABLE user_tech_stacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tech_name VARCHAR(50) NOT NULL,
    icon_url TEXT DEFAULT '',
    level VARCHAR(20) DEFAULT 'intermediate', -- beginner, intermediate, advanced, expert
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, tech_name)
);

-- User follows
CREATE TABLE user_follows (
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

CREATE INDEX idx_user_follows_following ON user_follows(following_id);

-- =====================================================
-- CATEGORIES & TAGS
-- =====================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    icon_url TEXT DEFAULT '',
    color VARCHAR(7) DEFAULT '#3B82F6',
    sort_order INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    icon_url TEXT DEFAULT '',
    color VARCHAR(7) DEFAULT '#6366F1',
    posts_count INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tags_posts_count ON tags(posts_count DESC);

-- Tag follows
CREATE TABLE tag_follows (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, tag_id)
);

-- =====================================================
-- POSTS/ARTICLES
-- =====================================================

CREATE TYPE post_status AS ENUM ('draft', 'pending', 'published', 'archived', 'rejected');
CREATE TYPE post_visibility AS ENUM ('public', 'unlisted', 'members_only', 'private');
CREATE TYPE post_format AS ENUM ('deep_dive', 'tutorial', 'news_brief', 'series', 'case_study', 'discussion');

-- Series (collection of related posts)
CREATE TABLE series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    cover_url TEXT DEFAULT '',
    posts_count INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    community_id UUID REFERENCES communities(id) ON DELETE SET NULL,
    series_id UUID REFERENCES series(id) ON DELETE SET NULL,
    series_order INTEGER,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

    -- Content
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    subtitle VARCHAR(300) DEFAULT '',
    content TEXT NOT NULL, -- Tiptap JSON
    content_html TEXT NOT NULL, -- Rendered HTML
    content_text TEXT NOT NULL, -- Plain text for search
    excerpt VARCHAR(300) DEFAULT '',

    -- Media
    cover_image_url TEXT DEFAULT '',
    og_image_url TEXT DEFAULT '',

    -- Meta
    language VARCHAR(5) DEFAULT 'en',
    format post_format DEFAULT 'deep_dive',
    status post_status DEFAULT 'draft',
    visibility post_visibility DEFAULT 'public',
    reading_time INTEGER DEFAULT 1,
    canonical_url TEXT DEFAULT '',

    -- Engagement (denormalized)
    views_count INTEGER DEFAULT 0,
    claps_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    bookmarks_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,

    -- SEO
    meta_title VARCHAR(70) DEFAULT '',
    meta_description VARCHAR(160) DEFAULT '',
    meta_keywords TEXT[] DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_posts_author ON posts(author_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_status ON posts(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_visibility ON posts(visibility) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_language ON posts(language) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_published ON posts(published_at DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_posts_views ON posts(views_count DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_posts_claps ON posts(claps_count DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_posts_slug ON posts(slug) WHERE deleted_at IS NULL;

-- Full-text search index
CREATE INDEX idx_posts_search ON posts USING gin(to_tsvector('english', title || ' ' || coalesce(subtitle, '') || ' ' || coalesce(content_text, '')));

-- Post translations
CREATE TABLE post_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    language VARCHAR(5) NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(300) DEFAULT '',
    content TEXT NOT NULL,
    content_html TEXT NOT NULL,
    is_auto_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, language)
);

-- Post-Tag relationship
CREATE TABLE post_tags (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);

-- Post claps (likes)
CREATE TABLE post_claps (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    count INTEGER DEFAULT 1 CHECK (count >= 1 AND count <= 50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

-- Post reactions (emojis)
CREATE TABLE post_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    emoji VARCHAR(20) NOT NULL, -- fire, unicorn, mind_blown, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Bookmarks
CREATE TABLE bookmarks (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    note TEXT DEFAULT '',
    folder_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

-- Bookmark folders
CREATE TABLE bookmark_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bookmarks ADD FOREIGN KEY (folder_id) REFERENCES bookmark_folders(id) ON DELETE SET NULL;

-- =====================================================
-- COMMENTS
-- =====================================================

CREATE TYPE comment_type AS ENUM ('post', 'highlight');

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    root_id UUID REFERENCES comments(id) ON DELETE CASCADE,

    type comment_type DEFAULT 'post',
    highlight_key VARCHAR(100), -- For inline comments

    content TEXT NOT NULL,
    content_html TEXT NOT NULL,

    upvotes_count INTEGER DEFAULT 0,
    downvotes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,

    is_edited BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_comments_post ON comments(post_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_author ON comments(author_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_parent ON comments(parent_id) WHERE deleted_at IS NULL;

-- Comment votes
CREATE TABLE comment_votes (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    value INTEGER NOT NULL CHECK (value IN (-1, 1)),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, comment_id)
);

-- =====================================================
-- ORGANIZATIONS (Companies)
-- =====================================================

CREATE TYPE org_type AS ENUM ('company', 'startup', 'agency', 'education', 'non_profit', 'government');
CREATE TYPE org_member_role AS ENUM ('owner', 'admin', 'editor', 'recruiter', 'member');
CREATE TYPE org_plan AS ENUM ('free', 'pro', 'business', 'enterprise');

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    tagline VARCHAR(150) DEFAULT '',
    description TEXT DEFAULT '',
    logo_url TEXT DEFAULT '',
    cover_url TEXT DEFAULT '',

    type org_type DEFAULT 'company',
    industry VARCHAR(50) DEFAULT '',
    size VARCHAR(20) DEFAULT '',
    founded_year INTEGER,

    website VARCHAR(255) DEFAULT '',
    email VARCHAR(255) DEFAULT '',
    location VARCHAR(100) DEFAULT '',

    github_url VARCHAR(255) DEFAULT '',
    linkedin_url VARCHAR(255) DEFAULT '',
    twitter_url VARCHAR(255) DEFAULT '',

    brand_color VARCHAR(7) DEFAULT '#3B82F6',

    plan org_plan DEFAULT 'free',
    plan_expires_at TIMESTAMPTZ,

    members_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    jobs_count INTEGER DEFAULT 0,

    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_orgs_slug ON organizations(slug) WHERE deleted_at IS NULL;

-- Organization members
CREATE TABLE organization_members (
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role org_member_role DEFAULT 'member',
    title VARCHAR(100) DEFAULT '',
    is_public BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    invited_by UUID REFERENCES users(id),
    PRIMARY KEY (organization_id, user_id)
);

-- Organization invites
CREATE TABLE organization_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role org_member_role DEFAULT 'member',
    token VARCHAR(100) NOT NULL UNIQUE,
    invited_by UUID NOT NULL REFERENCES users(id),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ
);

-- Organization tech stack
CREATE TABLE organization_tech_stacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tech_name VARCHAR(50) NOT NULL,
    icon_url TEXT DEFAULT '',
    category VARCHAR(30) DEFAULT '', -- frontend, backend, devops, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, tech_name)
);

-- Organization follows
CREATE TABLE organization_follows (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, organization_id)
);

-- =====================================================
-- COMMUNITIES
-- =====================================================

CREATE TYPE community_type AS ENUM ('public', 'private', 'paid', 'invite');
CREATE TYPE community_member_role AS ENUM ('owner', 'moderator', 'member');

CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    rules TEXT DEFAULT '',
    icon_url TEXT DEFAULT '',
    cover_url TEXT DEFAULT '',

    type community_type DEFAULT 'public',
    is_official BOOLEAN DEFAULT FALSE,
    allow_posts BOOLEAN DEFAULT TRUE,
    require_approval BOOLEAN DEFAULT FALSE,

    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    billing_period VARCHAR(10) DEFAULT 'monthly',

    members_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,

    primary_color VARCHAR(7) DEFAULT '#6366F1',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_communities_slug ON communities(slug) WHERE deleted_at IS NULL;

-- Community members
CREATE TABLE community_members (
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role community_member_role DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    PRIMARY KEY (community_id, user_id)
);

-- Community join requests
CREATE TABLE community_join_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT DEFAULT '',
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ
);

-- =====================================================
-- JOBS
-- =====================================================

CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'freelance', 'internship');
CREATE TYPE job_location AS ENUM ('remote', 'onsite', 'hybrid');
CREATE TYPE job_experience AS ENUM ('intern', 'junior', 'middle', 'senior', 'lead', 'principal');

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    posted_by_id UUID NOT NULL REFERENCES users(id),

    title VARCHAR(150) NOT NULL,
    slug VARCHAR(170) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    description_html TEXT NOT NULL,

    type job_type DEFAULT 'full_time',
    location job_location DEFAULT 'onsite',
    experience job_experience DEFAULT 'middle',
    department VARCHAR(50) DEFAULT '',

    city VARCHAR(50) DEFAULT '',
    country VARCHAR(50) DEFAULT '',
    timezone VARCHAR(50) DEFAULT '',

    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_period VARCHAR(10) DEFAULT 'yearly',

    apply_url TEXT DEFAULT '',
    apply_email VARCHAR(255) DEFAULT '',
    application_deadline TIMESTAMPTZ,

    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_jobs_org ON jobs(organization_id) WHERE deleted_at IS NULL AND is_active = TRUE;
CREATE INDEX idx_jobs_type ON jobs(type) WHERE deleted_at IS NULL AND is_active = TRUE;
CREATE INDEX idx_jobs_location ON jobs(location) WHERE deleted_at IS NULL AND is_active = TRUE;

-- Job skills
CREATE TABLE job_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    icon_url TEXT DEFAULT '',
    is_required BOOLEAN DEFAULT TRUE
);

-- Job applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT DEFAULT '',
    resume_url TEXT DEFAULT '',
    status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, interview, rejected, hired
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- Job bookmarks
CREATE TABLE job_bookmarks (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, job_id)
);

-- =====================================================
-- EVENTS
-- =====================================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    creator_id UUID NOT NULL REFERENCES users(id),

    title VARCHAR(150) NOT NULL,
    slug VARCHAR(170) NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    description_html TEXT DEFAULT '',
    cover_url TEXT DEFAULT '',

    type VARCHAR(30) DEFAULT 'meetup', -- conference, meetup, workshop, webinar
    format VARCHAR(20) DEFAULT 'offline', -- online, offline, hybrid
    venue TEXT DEFAULT '',
    city VARCHAR(50) DEFAULT '',
    country VARCHAR(50) DEFAULT '',
    stream_url TEXT DEFAULT '',

    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',

    registration_url TEXT DEFAULT '',
    is_free BOOLEAN DEFAULT TRUE,
    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    capacity INTEGER,

    attendees_count INTEGER DEFAULT 0,
    interested_count INTEGER DEFAULT 0,

    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event attendees
CREATE TABLE event_attendees (
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'registered', -- registered, interested, attended
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (event_id, user_id)
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL, -- follow, comment, clap, mention, etc.
    title VARCHAR(100) NOT NULL,
    message TEXT DEFAULT '',
    link TEXT DEFAULT '',
    image_url TEXT DEFAULT '',

    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_name VARCHAR(100) DEFAULT '',
    actor_avatar TEXT DEFAULT '',

    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,

    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;

-- =====================================================
-- REPORTS
-- =====================================================

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id),

    target_type VARCHAR(20) NOT NULL, -- post, comment, user
    target_id UUID NOT NULL,

    reason VARCHAR(50) NOT NULL, -- spam, harassment, hate_speech, etc.
    description TEXT DEFAULT '',

    status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, resolved, dismissed
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    resolution TEXT DEFAULT '',

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON reports(status) WHERE status = 'pending';

-- =====================================================
-- READING HISTORY & ANALYTICS
-- =====================================================

CREATE TABLE reading_history (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    read_progress DECIMAL(3, 2) DEFAULT 0, -- 0.00 to 1.00
    time_spent INTEGER DEFAULT 0, -- seconds
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    is_completed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    query VARCHAR(255) NOT NULL,
    results INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SESSIONS & TOKENS
-- =====================================================

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    device_info TEXT DEFAULT '',
    ip_address VARCHAR(45) DEFAULT '',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id) WHERE revoked_at IS NULL;

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default categories
INSERT INTO categories (name, slug, description, color, sort_order) VALUES
    ('Engineering', 'engineering', 'Software development, DevOps, and technical topics', '#3B82F6', 1),
    ('Artificial Intelligence', 'artificial-intelligence', 'Machine Learning, LLMs, and AI technologies', '#8B5CF6', 2),
    ('Startups & Venture', 'startups-venture', 'Entrepreneurship, funding, and business', '#10B981', 3),
    ('Product & Design', 'product-design', 'UX/UI, product management, and design thinking', '#F59E0B', 4),
    ('Career & Growth', 'career-growth', 'Professional development, skills, and opportunities', '#EC4899', 5);

-- Insert popular tags
INSERT INTO tags (name, slug, color) VALUES
    ('javascript', 'javascript', '#F7DF1E'),
    ('python', 'python', '#3776AB'),
    ('golang', 'golang', '#00ADD8'),
    ('rust', 'rust', '#DEA584'),
    ('typescript', 'typescript', '#3178C6'),
    ('react', 'react', '#61DAFB'),
    ('nextjs', 'nextjs', '#000000'),
    ('nodejs', 'nodejs', '#339933'),
    ('kubernetes', 'kubernetes', '#326CE5'),
    ('docker', 'docker', '#2496ED'),
    ('aws', 'aws', '#FF9900'),
    ('ai', 'ai', '#FF6F61'),
    ('machine-learning', 'machine-learning', '#7B68EE'),
    ('startup', 'startup', '#00D4AA'),
    ('career', 'career', '#FF69B4');
