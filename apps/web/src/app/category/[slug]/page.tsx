import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Code2, Sparkles, Rocket, Layers, GraduationCap, TrendingUp, Users, Filter, LayoutGrid, List } from 'lucide-react';

import { Header } from '@/components/layout/header';
import { BentoGrid } from '@/components/post/bento-grid';
import { PostCard } from '@/components/post/post-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// Category data with metadata
const categories: Record<string, {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: typeof Code2;
  color: string;
  gradient: string;
  stats: { posts: number; followers: number; writers: number };
  subcategories: Array<{ name: string; slug: string; count: number }>;
}> = {
  'engineering': {
    title: 'Engineering',
    slug: 'engineering',
    description: 'Software development, architecture, and best practices',
    longDescription: 'Explore in-depth articles on software development, system design, programming languages, and engineering best practices from industry experts.',
    icon: Code2,
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-500',
    stats: { posts: 12450, followers: 45200, writers: 3200 },
    subcategories: [
      { name: 'Web Development', slug: 'webdev', count: 3240 },
      { name: 'Backend', slug: 'backend', count: 2890 },
      { name: 'DevOps', slug: 'devops', count: 1560 },
      { name: 'System Design', slug: 'system-design', count: 2100 },
      { name: 'Mobile', slug: 'mobile', count: 1890 },
      { name: 'Security', slug: 'security', count: 980 },
    ],
  },
  'artificial-intelligence': {
    title: 'AI & ML',
    slug: 'artificial-intelligence',
    description: 'Artificial intelligence, machine learning, and data science',
    longDescription: 'Stay up-to-date with the latest developments in AI, machine learning, deep learning, and data science. From tutorials to research papers.',
    icon: Sparkles,
    color: '#a855f7',
    gradient: 'from-purple-500 to-pink-500',
    stats: { posts: 8920, followers: 62300, writers: 2100 },
    subcategories: [
      { name: 'Machine Learning', slug: 'ml', count: 2450 },
      { name: 'Deep Learning', slug: 'deep-learning', count: 1890 },
      { name: 'LLMs & GPT', slug: 'llm', count: 2340 },
      { name: 'Computer Vision', slug: 'cv', count: 980 },
      { name: 'NLP', slug: 'nlp', count: 1120 },
      { name: 'Data Science', slug: 'data-science', count: 1560 },
    ],
  },
  'startups-venture': {
    title: 'Startups',
    slug: 'startups-venture',
    description: 'Entrepreneurship, funding, and startup ecosystem',
    longDescription: 'Learn from founders, VCs, and startup veterans. Get insights on fundraising, growth, product-market fit, and building successful companies.',
    icon: Rocket,
    color: '#f97316',
    gradient: 'from-orange-500 to-red-500',
    stats: { posts: 6780, followers: 38900, writers: 1450 },
    subcategories: [
      { name: 'Fundraising', slug: 'fundraising', count: 1230 },
      { name: 'Growth', slug: 'growth', count: 1560 },
      { name: 'Product-Market Fit', slug: 'pmf', count: 890 },
      { name: 'Venture Capital', slug: 'vc', count: 1120 },
      { name: 'Founder Stories', slug: 'founder-stories', count: 1340 },
      { name: 'Exit Strategies', slug: 'exit', count: 640 },
    ],
  },
  'product-design': {
    title: 'Product',
    slug: 'product-design',
    description: 'Product management, design, and user experience',
    longDescription: 'Master product management, UX design, and user research. Learn how to build products that users love from industry-leading PMs and designers.',
    icon: Layers,
    color: '#22c55e',
    gradient: 'from-green-500 to-emerald-500',
    stats: { posts: 5430, followers: 28700, writers: 980 },
    subcategories: [
      { name: 'Product Strategy', slug: 'product-strategy', count: 1120 },
      { name: 'UX Design', slug: 'ux', count: 1560 },
      { name: 'User Research', slug: 'user-research', count: 890 },
      { name: 'Design Systems', slug: 'design-systems', count: 760 },
      { name: 'Prototyping', slug: 'prototyping', count: 540 },
      { name: 'A/B Testing', slug: 'ab-testing', count: 560 },
    ],
  },
  'career-growth': {
    title: 'Career',
    slug: 'career-growth',
    description: 'Professional development and career advancement',
    longDescription: 'Advance your tech career with advice on interviews, salary negotiation, leadership, remote work, and professional development.',
    icon: GraduationCap,
    color: '#eab308',
    gradient: 'from-yellow-500 to-orange-500',
    stats: { posts: 7890, followers: 52100, writers: 1890 },
    subcategories: [
      { name: 'Interviews', slug: 'interviews', count: 2340 },
      { name: 'Leadership', slug: 'leadership', count: 1560 },
      { name: 'Remote Work', slug: 'remote', count: 1230 },
      { name: 'Salary & Comp', slug: 'salary', count: 1120 },
      { name: 'Mentorship', slug: 'mentorship', count: 890 },
      { name: 'Job Search', slug: 'job-search', count: 750 },
    ],
  },
};

// Mock posts for category
const generateCategoryPosts = (categorySlug: string) => [
  {
    id: '1',
    slug: 'advanced-system-design-patterns',
    title: 'Advanced System Design Patterns for Scalable Applications',
    excerpt: 'Learn the essential patterns used by top tech companies to build systems that scale to millions of users.',
    coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    readingTime: 18,
    clapsCount: 4520,
    commentsCount: 156,
    publishedAt: '2025-01-15T10:00:00Z',
    format: 'deep_dive',
    author: {
      username: 'systemarchitect',
      fullName: 'Michael Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      status: 'hiring' as const,
    },
    tags: [
      { name: 'system-design', slug: 'system-design' },
      { name: 'architecture', slug: 'architecture' },
    ],
  },
  {
    id: '2',
    slug: 'microservices-best-practices',
    title: 'Microservices Best Practices: Lessons from Netflix',
    excerpt: 'How Netflix structures their microservices architecture and what we can learn from their approach.',
    coverImageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop',
    readingTime: 15,
    clapsCount: 3200,
    commentsCount: 89,
    publishedAt: '2025-01-14T14:00:00Z',
    format: 'case_study',
    author: {
      username: 'cloudexpert',
      fullName: 'Sarah Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    tags: [
      { name: 'microservices', slug: 'microservices' },
      { name: 'netflix', slug: 'netflix' },
    ],
  },
  {
    id: '3',
    slug: 'kubernetes-production-guide',
    title: 'Running Kubernetes in Production: A Complete Guide',
    excerpt: 'Everything you need to know about operating Kubernetes clusters in production environments.',
    coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    readingTime: 22,
    clapsCount: 2890,
    commentsCount: 67,
    publishedAt: '2025-01-13T09:00:00Z',
    format: 'tutorial',
    author: {
      username: 'k8smaster',
      fullName: 'David Kim',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      status: 'mentor' as const,
    },
    tags: [
      { name: 'kubernetes', slug: 'kubernetes' },
      { name: 'devops', slug: 'devops' },
    ],
  },
  {
    id: '4',
    slug: 'golang-performance-optimization',
    title: 'Go Performance Optimization: From Basics to Advanced',
    excerpt: 'Master Go performance optimization techniques used by top companies.',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
    readingTime: 16,
    clapsCount: 1890,
    commentsCount: 45,
    publishedAt: '2025-01-12T11:00:00Z',
    format: 'tutorial',
    author: {
      username: 'gopher',
      fullName: 'Alex Wang',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    },
    tags: [
      { name: 'golang', slug: 'golang' },
      { name: 'performance', slug: 'performance' },
    ],
  },
  {
    id: '5',
    slug: 'database-scaling-strategies',
    title: 'Database Scaling Strategies for High-Traffic Applications',
    excerpt: 'How to scale your database from thousands to millions of requests per second.',
    coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop',
    readingTime: 20,
    clapsCount: 2340,
    commentsCount: 78,
    publishedAt: '2025-01-11T08:00:00Z',
    format: 'deep_dive',
    author: {
      username: 'dbexpert',
      fullName: 'Lisa Park',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      status: 'open_to_work' as const,
    },
    tags: [
      { name: 'database', slug: 'database' },
      { name: 'scaling', slug: 'scaling' },
    ],
  },
  {
    id: '6',
    slug: 'api-design-principles',
    title: 'API Design Principles Every Developer Should Know',
    excerpt: 'Learn the fundamental principles of designing clean, maintainable APIs.',
    coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    readingTime: 12,
    clapsCount: 1560,
    commentsCount: 34,
    publishedAt: '2025-01-10T15:00:00Z',
    format: 'tutorial',
    author: {
      username: 'apidesigner',
      fullName: 'James Liu',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
    },
    tags: [
      { name: 'api', slug: 'api' },
      { name: 'rest', slug: 'rest' },
    ],
  },
];

// Top writers for category
const topWriters = [
  {
    username: 'systemarchitect',
    fullName: 'Michael Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    bio: 'Staff Engineer at Google',
    followers: 15234,
  },
  {
    username: 'cloudexpert',
    fullName: 'Sarah Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'Cloud Architect at AWS',
    followers: 12456,
  },
  {
    username: 'k8smaster',
    fullName: 'David Kim',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'DevOps Lead',
    followers: 9876,
  },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categories[slug];

  if (!category) {
    notFound();
  }

  const posts = generateCategoryPosts(slug);
  const IconComponent = category.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Category Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-5`} />
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
            style={{ background: `radial-gradient(circle, ${category.color}40, transparent)` }}
          />

          <div className="container mx-auto px-4 relative">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link href="/explore" className="hover:text-foreground transition-colors">Categories</Link>
              <span>/</span>
              <span className="text-foreground font-medium">{category.title}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Category Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}
                    style={{ boxShadow: `0 10px 40px ${category.color}30` }}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold">{category.title}</h1>
                    <p className="text-lg text-muted-foreground mt-1">{category.description}</p>
                  </div>
                </div>

                <p className="text-muted-foreground max-w-2xl mb-8">
                  {category.longDescription}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{category.stats.posts.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Posts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{category.stats.followers.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{category.stats.writers.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Writers</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow Button */}
              <div className="flex gap-3">
                <Button size="lg" style={{ backgroundColor: category.color }}>
                  Follow Category
                </Button>
                <Button size="lg" variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Subcategories */}
            <div className="mt-12">
              <h3 className="font-semibold mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-3">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/tag/${sub.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card hover:bg-accent transition-colors"
                  >
                    <span className="font-medium">{sub.name}</span>
                    <Badge variant="secondary" className="text-xs">{sub.count}</Badge>
                  </Link>
                ))}
              </div>
            </div>
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
                    <Button variant="ghost" size="sm">Top Month</Button>
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

                {/* Bento Grid */}
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
                {/* Top Writers */}
                <div className="rounded-2xl border bg-card p-6">
                  <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
                    <Users className="h-5 w-5" style={{ color: category.color }} />
                    Top Writers
                  </h3>
                  <div className="space-y-4">
                    {topWriters.map((writer) => (
                      <Link
                        key={writer.username}
                        href={`/user/${writer.username}`}
                        className="flex items-center gap-3 group"
                      >
                        <Avatar className="h-11 w-11">
                          <AvatarImage src={writer.avatarUrl} alt={writer.fullName} />
                          <AvatarFallback>{writer.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate group-hover:text-primary transition-colors">
                            {writer.fullName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{writer.bio}</p>
                        </div>
                        <Button variant="outline" size="sm">Follow</Button>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Related Categories */}
                <div className="rounded-2xl border bg-card p-6">
                  <h3 className="font-semibold mb-4">Related Categories</h3>
                  <div className="space-y-3">
                    {Object.values(categories)
                      .filter((c) => c.slug !== slug)
                      .slice(0, 3)
                      .map((cat) => {
                        const CatIcon = cat.icon;
                        return (
                          <Link
                            key={cat.slug}
                            href={`/category/${cat.slug}`}
                            className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div
                              className={`h-10 w-10 rounded-lg bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}
                            >
                              <CatIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium group-hover:text-primary transition-colors">
                                {cat.title}
                              </p>
                              <p className="text-xs text-muted-foreground">{cat.stats.posts.toLocaleString()} posts</p>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                </div>

                {/* Newsletter */}
                <div
                  className="rounded-2xl border p-6"
                  style={{ background: `linear-gradient(135deg, ${category.color}10, ${category.color}05)` }}
                >
                  <h3 className="font-semibold mb-2">{category.title} Weekly</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get the best {category.title.toLowerCase()} content delivered to your inbox.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="flex-1 h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Button style={{ backgroundColor: category.color }}>Subscribe</Button>
                  </div>
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
  const category = categories[slug];

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.title} - ABS Platform`,
    description: category.longDescription,
  };
}

// Generate static params for known categories
export function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({ slug }));
}
