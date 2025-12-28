import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, Zap, Sparkles, Code2, Rocket, Cpu, BarChart3 } from 'lucide-react';

import { Header } from '@/components/layout/header';
import { BentoGrid } from '@/components/post/bento-grid';
import { PostCard } from '@/components/post/post-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data - replace with API calls
const allPosts = [
  {
    id: '1',
    slug: 'building-scalable-microservices-with-go',
    title: 'Building Scalable Microservices with Go and Kubernetes',
    excerpt: 'Learn how to design, implement, and deploy production-ready microservices using Go and Kubernetes. A comprehensive guide from architecture to deployment.',
    coverImageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&h=630&fit=crop',
    readingTime: 15,
    clapsCount: 2340,
    commentsCount: 89,
    publishedAt: '2025-01-15T10:00:00Z',
    format: 'deep_dive',
    author: {
      username: 'johndoe',
      fullName: 'John Doe',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      status: 'hiring' as const,
    },
    tags: [
      { name: 'golang', slug: 'golang' },
      { name: 'kubernetes', slug: 'kubernetes' },
      { name: 'microservices', slug: 'microservices' },
    ],
  },
  {
    id: '2',
    slug: 'ai-coding-assistants-2025',
    title: 'The State of AI Coding Assistants in 2025',
    excerpt: 'A deep dive into how AI assistants like Copilot, Claude, and others are changing the way developers write code.',
    coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
    readingTime: 8,
    clapsCount: 1250,
    commentsCount: 45,
    publishedAt: '2025-01-14T14:30:00Z',
    format: 'tutorial',
    author: {
      username: 'sarahtech',
      fullName: 'Sarah Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      status: 'open_to_work' as const,
    },
    tags: [
      { name: 'ai', slug: 'ai' },
      { name: 'programming', slug: 'programming' },
    ],
  },
  {
    id: '3',
    slug: 'startup-lessons-from-unicorns',
    title: 'What I Learned Working at 3 Unicorn Startups',
    excerpt: 'Key insights on culture, scaling, and what separates successful startups from the rest.',
    coverImageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=450&fit=crop',
    readingTime: 12,
    clapsCount: 890,
    commentsCount: 32,
    publishedAt: '2025-01-13T09:00:00Z',
    format: 'case_study',
    author: {
      username: 'alexfounder',
      fullName: 'Alex Kim',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      status: 'mentor' as const,
    },
    tags: [
      { name: 'startup', slug: 'startup' },
      { name: 'career', slug: 'career' },
    ],
  },
  {
    id: '4',
    slug: 'rust-for-web-developers',
    title: 'Rust for Web Developers: A Practical Introduction',
    excerpt: 'Coming from JavaScript or Python? Here\'s how to get started with Rust and why you might want to.',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
    readingTime: 10,
    clapsCount: 567,
    commentsCount: 28,
    publishedAt: '2025-01-12T16:00:00Z',
    format: 'tutorial',
    author: {
      username: 'rustacean',
      fullName: 'Mike Brown',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    },
    tags: [
      { name: 'rust', slug: 'rust' },
      { name: 'webdev', slug: 'webdev' },
    ],
  },
  {
    id: '5',
    slug: 'system-design-interview-guide',
    title: 'Complete System Design Interview Guide for 2025',
    excerpt: 'Everything you need to know to ace your next system design interview at FAANG companies.',
    coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    readingTime: 20,
    clapsCount: 3450,
    commentsCount: 156,
    publishedAt: '2025-01-11T08:00:00Z',
    format: 'deep_dive',
    author: {
      username: 'techinterviewer',
      fullName: 'David Park',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
      status: 'hiring' as const,
    },
    tags: [
      { name: 'interview', slug: 'interview' },
      { name: 'system-design', slug: 'system-design' },
    ],
  },
  {
    id: '6',
    slug: 'react-server-components-deep-dive',
    title: 'React Server Components: The Complete Guide',
    excerpt: 'Understanding RSC, when to use them, and how they change the way we build React apps.',
    coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    readingTime: 14,
    clapsCount: 1890,
    commentsCount: 67,
    publishedAt: '2025-01-10T11:00:00Z',
    format: 'tutorial',
    author: {
      username: 'reactdev',
      fullName: 'Emma Wilson',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    },
    tags: [
      { name: 'react', slug: 'react' },
      { name: 'nextjs', slug: 'nextjs' },
    ],
  },
  {
    id: '7',
    slug: 'machine-learning-production',
    title: 'Deploying ML Models to Production: Best Practices',
    excerpt: 'From Jupyter notebooks to production-ready APIs. A practical guide to MLOps.',
    coverImageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
    readingTime: 18,
    clapsCount: 2100,
    commentsCount: 78,
    publishedAt: '2025-01-09T09:00:00Z',
    format: 'series',
    author: {
      username: 'mlexpert',
      fullName: 'Lisa Zhang',
      avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
      status: 'open_to_work' as const,
    },
    tags: [
      { name: 'ml', slug: 'ml' },
      { name: 'mlops', slug: 'mlops' },
    ],
  },
  {
    id: '8',
    slug: 'startup-fundraising-guide',
    title: 'How We Raised $10M Series A in 2025',
    excerpt: 'A transparent look at our fundraising journey, pitch deck, and lessons learned.',
    coverImageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=450&fit=crop',
    readingTime: 16,
    clapsCount: 4200,
    commentsCount: 234,
    publishedAt: '2025-01-08T14:00:00Z',
    format: 'case_study',
    author: {
      username: 'founderceo',
      fullName: 'James Liu',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop',
      status: 'mentor' as const,
    },
    tags: [
      { name: 'fundraising', slug: 'fundraising' },
      { name: 'startup', slug: 'startup' },
    ],
  },
];

const trendingTags = [
  { name: 'AI', slug: 'ai', count: 1234, icon: Sparkles },
  { name: 'Python', slug: 'python', count: 987, icon: Code2 },
  { name: 'Startup', slug: 'startup', count: 756, icon: Rocket },
  { name: 'Machine Learning', slug: 'ml', count: 654, icon: Cpu },
  { name: 'Career', slug: 'career', count: 543, icon: BarChart3 },
];

const topAuthors = [
  {
    username: 'johndoe',
    fullName: 'John Doe',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    bio: 'Staff Engineer at Google',
    karma: 15234,
    status: 'hiring' as const,
  },
  {
    username: 'sarahtech',
    fullName: 'Sarah Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'AI Researcher',
    karma: 12456,
    status: 'open_to_work' as const,
  },
  {
    username: 'alexfounder',
    fullName: 'Alex Kim',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Serial Entrepreneur',
    karma: 9876,
    status: 'mentor' as const,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-30" />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium">
                <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
                Trusted by 100K+ tech professionals
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                Where <span className="gradient-text">tech leaders</span><br />
                share knowledge
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Read, write, and connect with a community of developers, entrepreneurs, and AI enthusiasts building the future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25" asChild>
                  <Link href="/register">
                    Start Writing <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                  <Link href="/explore">Explore Topics</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
                <div className="space-y-1">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">50K+</div>
                  <div className="text-sm text-muted-foreground">Articles</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">100K+</div>
                  <div className="text-sm text-muted-foreground">Writers</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">1M+</div>
                  <div className="text-sm text-muted-foreground">Readers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[1fr_320px] gap-12">
              {/* Main Feed */}
              <div>
                {/* Bento Grid Section */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Featured Stories</h2>
                      <p className="text-sm text-muted-foreground">Handpicked by our editors</p>
                    </div>
                  </div>
                  <BentoGrid posts={allPosts} />
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg" className="min-w-[200px]">
                    Load More Stories
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-8">
                {/* Trending Topics */}
                <div className="rounded-2xl border bg-card p-6">
                  <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Trending Topics
                  </h3>
                  <div className="space-y-3">
                    {trendingTags.map((tag, index) => (
                      <Link
                        key={tag.slug}
                        href={`/tag/${tag.slug}`}
                        className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-accent transition-colors group"
                      >
                        <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-muted text-sm font-semibold text-muted-foreground">
                          {index + 1}
                        </span>
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <tag.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium group-hover:text-primary transition-colors">
                            #{tag.name}
                          </span>
                          <p className="text-xs text-muted-foreground">{tag.count} posts</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4" asChild>
                    <Link href="/explore">View all topics</Link>
                  </Button>
                </div>

                {/* Top Authors */}
                <div className="rounded-2xl border bg-card p-6">
                  <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Top Authors
                  </h3>
                  <div className="space-y-4">
                    {topAuthors.map((author) => (
                      <Link
                        key={author.username}
                        href={`/@${author.username}`}
                        className="flex items-center gap-3 group"
                      >
                        <Avatar className="h-11 w-11" status={author.status}>
                          <AvatarImage src={author.avatarUrl} alt={author.fullName} />
                          <AvatarFallback>{author.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate group-hover:text-primary transition-colors">
                            {author.fullName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{author.bio}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {(author.karma / 1000).toFixed(1)}K
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA Card */}
                <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Join Our Community</h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Share your knowledge and grow your professional network with 100K+ tech professionals.
                  </p>
                  <Button className="w-full shadow-lg shadow-primary/25" asChild>
                    <Link href="/register">Get Started Free</Link>
                  </Button>
                </div>

                {/* Newsletter */}
                <div className="rounded-2xl border bg-card p-6">
                  <h3 className="font-semibold mb-2">Weekly Newsletter</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get the best stories delivered to your inbox.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="flex-1 h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Button>Subscribe</Button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                  <span className="text-primary-foreground font-bold text-lg">A</span>
                </div>
                <div>
                  <span className="font-bold text-xl">ABS</span>
                  <span className="text-xs text-muted-foreground ml-1">Platform</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                A professional community for tech enthusiasts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 ABS Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
