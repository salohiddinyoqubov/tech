import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Hash, TrendingUp, Users, LayoutGrid, List, Bookmark, Bell, Share2 } from 'lucide-react';

import { Header } from '@/components/layout/header';
import { BentoGrid } from '@/components/post/bento-grid';
import { PostCard } from '@/components/post/post-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// Tag data with metadata
const tags: Record<string, {
  name: string;
  slug: string;
  description: string;
  color: string;
  stats: { posts: number; followers: number; postsThisWeek: number };
  relatedTags: string[];
}> = {
  'ai': {
    name: 'AI',
    slug: 'ai',
    description: 'Artificial Intelligence - exploring machine learning, deep learning, neural networks, and the future of intelligent systems.',
    color: '#a855f7',
    stats: { posts: 8920, followers: 62300, postsThisWeek: 234 },
    relatedTags: ['ml', 'deep-learning', 'llm', 'python', 'data-science'],
  },
  'python': {
    name: 'Python',
    slug: 'python',
    description: 'Python programming language - tutorials, best practices, frameworks, and real-world applications.',
    color: '#3b82f6',
    stats: { posts: 12450, followers: 89200, postsThisWeek: 312 },
    relatedTags: ['django', 'flask', 'fastapi', 'ml', 'data-science'],
  },
  'startup': {
    name: 'Startup',
    slug: 'startup',
    description: 'Startup ecosystem - fundraising, growth strategies, founder stories, and building successful companies.',
    color: '#f97316',
    stats: { posts: 6780, followers: 45600, postsThisWeek: 156 },
    relatedTags: ['fundraising', 'vc', 'growth', 'product', 'founder-stories'],
  },
  'react': {
    name: 'React',
    slug: 'react',
    description: 'React.js library - components, hooks, state management, and building modern web applications.',
    color: '#06b6d4',
    stats: { posts: 15670, followers: 112000, postsThisWeek: 423 },
    relatedTags: ['nextjs', 'typescript', 'javascript', 'frontend', 'webdev'],
  },
  'golang': {
    name: 'Go',
    slug: 'golang',
    description: 'Go programming language - concurrency, microservices, performance optimization, and cloud-native development.',
    color: '#00add8',
    stats: { posts: 5430, followers: 34500, postsThisWeek: 89 },
    relatedTags: ['microservices', 'kubernetes', 'backend', 'cloud', 'devops'],
  },
  'kubernetes': {
    name: 'Kubernetes',
    slug: 'kubernetes',
    description: 'Container orchestration with Kubernetes - deployment, scaling, and managing containerized applications.',
    color: '#326ce5',
    stats: { posts: 4560, followers: 28900, postsThisWeek: 67 },
    relatedTags: ['docker', 'devops', 'cloud', 'microservices', 'helm'],
  },
  'ml': {
    name: 'Machine Learning',
    slug: 'ml',
    description: 'Machine Learning - algorithms, models, training techniques, and practical applications.',
    color: '#22c55e',
    stats: { posts: 7890, followers: 56700, postsThisWeek: 198 },
    relatedTags: ['ai', 'deep-learning', 'python', 'tensorflow', 'pytorch'],
  },
  'webdev': {
    name: 'Web Development',
    slug: 'webdev',
    description: 'Web development - frontend, backend, full-stack, and everything in between.',
    color: '#ec4899',
    stats: { posts: 18900, followers: 134000, postsThisWeek: 534 },
    relatedTags: ['javascript', 'react', 'nodejs', 'css', 'html'],
  },
  'career': {
    name: 'Career',
    slug: 'career',
    description: 'Tech career advice - interviews, salary negotiation, job search, and professional growth.',
    color: '#eab308',
    stats: { posts: 9870, followers: 78900, postsThisWeek: 267 },
    relatedTags: ['interviews', 'salary', 'leadership', 'remote', 'mentorship'],
  },
};

// Mock posts for tag
const generateTagPosts = (tagSlug: string) => [
  {
    id: '1',
    slug: `mastering-${tagSlug}-fundamentals`,
    title: `Mastering ${tags[tagSlug]?.name || tagSlug} Fundamentals: A Complete Guide`,
    excerpt: 'Everything you need to know to get started and become proficient in this technology.',
    coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    readingTime: 18,
    clapsCount: 4520,
    commentsCount: 156,
    publishedAt: '2025-01-15T10:00:00Z',
    format: 'deep_dive',
    author: {
      username: 'expertdev',
      fullName: 'Michael Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      status: 'hiring' as const,
    },
    tags: [
      { name: tagSlug, slug: tagSlug },
      { name: 'tutorial', slug: 'tutorial' },
    ],
  },
  {
    id: '2',
    slug: `${tagSlug}-best-practices-2025`,
    title: `${tags[tagSlug]?.name || tagSlug} Best Practices for 2025`,
    excerpt: 'The latest patterns, techniques, and approaches recommended by industry experts.',
    coverImageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop',
    readingTime: 15,
    clapsCount: 3200,
    commentsCount: 89,
    publishedAt: '2025-01-14T14:00:00Z',
    format: 'tutorial',
    author: {
      username: 'seniordev',
      fullName: 'Sarah Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    tags: [
      { name: tagSlug, slug: tagSlug },
      { name: 'best-practices', slug: 'best-practices' },
    ],
  },
  {
    id: '3',
    slug: `${tagSlug}-real-world-projects`,
    title: `Building Real-World Projects with ${tags[tagSlug]?.name || tagSlug}`,
    excerpt: 'Practical examples and projects to solidify your understanding.',
    coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    readingTime: 22,
    clapsCount: 2890,
    commentsCount: 67,
    publishedAt: '2025-01-13T09:00:00Z',
    format: 'case_study',
    author: {
      username: 'builder',
      fullName: 'David Kim',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      status: 'mentor' as const,
    },
    tags: [
      { name: tagSlug, slug: tagSlug },
      { name: 'projects', slug: 'projects' },
    ],
  },
  {
    id: '4',
    slug: `${tagSlug}-performance-tips`,
    title: `Performance Optimization Tips for ${tags[tagSlug]?.name || tagSlug}`,
    excerpt: 'Speed up your applications with these proven optimization techniques.',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
    readingTime: 16,
    clapsCount: 1890,
    commentsCount: 45,
    publishedAt: '2025-01-12T11:00:00Z',
    format: 'tutorial',
    author: {
      username: 'perfexpert',
      fullName: 'Alex Wang',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    },
    tags: [
      { name: tagSlug, slug: tagSlug },
      { name: 'performance', slug: 'performance' },
    ],
  },
  {
    id: '5',
    slug: `${tagSlug}-common-mistakes`,
    title: `Common ${tags[tagSlug]?.name || tagSlug} Mistakes and How to Avoid Them`,
    excerpt: 'Learn from others\' mistakes and save yourself hours of debugging.',
    coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop',
    readingTime: 12,
    clapsCount: 2340,
    commentsCount: 78,
    publishedAt: '2025-01-11T08:00:00Z',
    format: 'discussion',
    author: {
      username: 'debugmaster',
      fullName: 'Lisa Park',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      status: 'open_to_work' as const,
    },
    tags: [
      { name: tagSlug, slug: tagSlug },
      { name: 'debugging', slug: 'debugging' },
    ],
  },
  {
    id: '6',
    slug: `${tagSlug}-interview-questions`,
    title: `Top ${tags[tagSlug]?.name || tagSlug} Interview Questions for 2025`,
    excerpt: 'Prepare for your next technical interview with these common questions.',
    coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    readingTime: 20,
    clapsCount: 3560,
    commentsCount: 123,
    publishedAt: '2025-01-10T15:00:00Z',
    format: 'deep_dive',
    author: {
      username: 'interviewer',
      fullName: 'James Liu',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
    },
    tags: [
      { name: tagSlug, slug: tagSlug },
      { name: 'interviews', slug: 'interviews' },
    ],
  },
];

// Top contributors for tag
const topContributors = [
  {
    username: 'expertdev',
    fullName: 'Michael Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    posts: 45,
    followers: 15234,
  },
  {
    username: 'seniordev',
    fullName: 'Sarah Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    posts: 38,
    followers: 12456,
  },
  {
    username: 'builder',
    fullName: 'David Kim',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    posts: 32,
    followers: 9876,
  },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = tags[slug];

  // Allow any tag, use defaults for unknown ones
  const tagData = tag || {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    slug: slug,
    description: `Explore posts tagged with #${slug}`,
    color: '#6366f1',
    stats: { posts: 0, followers: 0, postsThisWeek: 0 },
    relatedTags: [],
  };

  const posts = generateTagPosts(slug);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Tag Hero */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 opacity-5"
            style={{ background: `linear-gradient(135deg, ${tagData.color}, transparent)` }}
          />

          <div className="container mx-auto px-4 relative">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link href="/explore" className="hover:text-foreground transition-colors">Tags</Link>
              <span>/</span>
              <span className="text-foreground font-medium">#{tagData.name}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              {/* Tag Info */}
              <div className="flex items-center gap-4">
                <div
                  className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                  style={{ backgroundColor: tagData.color, boxShadow: `0 10px 40px ${tagData.color}30` }}
                >
                  <Hash className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">#{tagData.name}</h1>
                  <p className="text-muted-foreground mt-1 max-w-xl">{tagData.description}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button size="lg" style={{ backgroundColor: tagData.color }}>
                  <Bell className="h-4 w-4 mr-2" />
                  Follow
                </Button>
                <Button size="lg" variant="outline">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button size="icon" variant="outline" className="h-11 w-11">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-8 pt-8 border-t">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{tagData.stats.posts.toLocaleString()}</div>
                <div className="text-muted-foreground">Posts</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{tagData.stats.followers.toLocaleString()}</div>
                <div className="text-muted-foreground">Followers</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-500">+{tagData.stats.postsThisWeek}</div>
                <div className="text-muted-foreground">Posts this week</div>
              </div>
            </div>

            {/* Related Tags */}
            {tagData.relatedTags.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Related Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tagData.relatedTags.map((relatedSlug) => {
                    const relatedTag = tags[relatedSlug];
                    return (
                      <Link
                        key={relatedSlug}
                        href={`/tag/${relatedSlug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-card hover:bg-accent transition-colors text-sm"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: relatedTag?.color || '#6366f1' }}
                        />
                        #{relatedTag?.name || relatedSlug}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        <Separator />

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[1fr_300px] gap-12">
              {/* Posts */}
              <div>
                {/* Tabs */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Trending</Button>
                    <Button variant="ghost" size="sm">Latest</Button>
                    <Button variant="ghost" size="sm">Top Week</Button>
                    <Button variant="ghost" size="sm">Top All Time</Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Posts Grid */}
                <BentoGrid posts={posts} />

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg" className="min-w-[200px]">
                    Load More Posts
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-8">
                {/* Top Contributors */}
                <div className="rounded-2xl border bg-card p-6">
                  <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" style={{ color: tagData.color }} />
                    Top Contributors
                  </h3>
                  <div className="space-y-4">
                    {topContributors.map((contributor, index) => (
                      <Link
                        key={contributor.username}
                        href={`/@${contributor.username}`}
                        className="flex items-center gap-3 group"
                      >
                        <span className="text-lg font-bold text-muted-foreground w-6">
                          {index + 1}
                        </span>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contributor.avatarUrl} alt={contributor.fullName} />
                          <AvatarFallback>{contributor.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate group-hover:text-primary transition-colors">
                            {contributor.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">{contributor.posts} posts</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {(contributor.followers / 1000).toFixed(1)}K
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Write about this topic */}
                <div
                  className="rounded-2xl border p-6"
                  style={{ background: `linear-gradient(135deg, ${tagData.color}10, ${tagData.color}05)` }}
                >
                  <h3 className="font-semibold mb-2">Share Your Knowledge</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Write about #{tagData.name} and share your expertise with the community.
                  </p>
                  <Button className="w-full" style={{ backgroundColor: tagData.color }} asChild>
                    <Link href={`/write?tag=${slug}`}>
                      Write a Post
                    </Link>
                  </Button>
                </div>

                {/* Tag Guidelines */}
                <div className="rounded-2xl border bg-card p-6">
                  <h3 className="font-semibold mb-4">Tag Guidelines</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Posts should be directly related to {tagData.name}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Include code examples when applicable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Be respectful and constructive in discussions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Cite sources for research and statistics</span>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tag = tags[slug];

  const name = tag?.name || slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `#${name} - ABS Platform`,
    description: tag?.description || `Explore posts tagged with #${slug}`,
  };
}

// Generate static params for known tags
export function generateStaticParams() {
  return Object.keys(tags).map((slug) => ({ slug }));
}
