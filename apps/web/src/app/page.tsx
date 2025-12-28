import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, Zap } from 'lucide-react';

import { Header } from '@/components/layout/header';
import { PostCard } from '@/components/post/post-card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data - replace with API calls
const featuredPost = {
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
};

const posts = [
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
];

const trendingTags = [
  { name: 'AI', slug: 'ai', count: 1234 },
  { name: 'Python', slug: 'python', count: 987 },
  { name: 'Startup', slug: 'startup', count: 756 },
  { name: 'React', slug: 'react', count: 654 },
  { name: 'Career', slug: 'career', count: 543 },
];

const topAuthors = [
  {
    username: 'johndoe',
    fullName: 'John Doe',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    bio: 'Staff Engineer at Google',
    karma: 15234,
  },
  {
    username: 'sarahtech',
    fullName: 'Sarah Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'AI Researcher',
    karma: 12456,
  },
  {
    username: 'alexfounder',
    fullName: 'Alex Kim',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Serial Entrepreneur',
    karma: 9876,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Where <span className="gradient-text">tech professionals</span> share knowledge
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Read, write, and connect with a community of developers, entrepreneurs, and AI enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Writing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/explore">Explore Topics</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100K+</div>
                <div className="text-sm text-muted-foreground">Writers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">1M+</div>
                <div className="text-sm text-muted-foreground">Readers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Feed */}
              <div className="lg:col-span-2">
                {/* Featured Post */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Featured
                  </h2>
                  <PostCard post={featuredPost} variant="featured" />
                </div>

                {/* Feed Tabs */}
                <div className="flex gap-4 border-b mb-6">
                  <button className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary -mb-px">
                    For You
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                    Latest
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                    Top Week
                  </button>
                </div>

                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button variant="outline" size="lg">
                    Load More
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-8">
                {/* Trending Topics */}
                <div className="rounded-xl border bg-card p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Trending Topics
                  </h3>
                  <div className="space-y-3">
                    {trendingTags.map((tag, index) => (
                      <Link
                        key={tag.slug}
                        href={`/tag/${tag.slug}`}
                        className="flex items-center justify-between group"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-muted-foreground text-sm w-5">{index + 1}</span>
                          <span className="font-medium group-hover:text-primary transition-colors">
                            #{tag.name}
                          </span>
                        </span>
                        <span className="text-sm text-muted-foreground">{tag.count} posts</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Top Authors */}
                <div className="rounded-xl border bg-card p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
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
                        <Avatar>
                          <AvatarImage src={author.avatarUrl} alt={author.fullName} />
                          <AvatarFallback>{author.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate group-hover:text-primary transition-colors">
                            {author.fullName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{author.bio}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {(author.karma / 1000).toFixed(1)}K
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-purple-500/10 p-6 text-center">
                  <h3 className="font-semibold mb-2">Join Our Community</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share your knowledge and grow your professional network.
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/register">Get Started Free</Link>
                  </Button>
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
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">A</span>
                </div>
                <span className="font-bold text-xl">ABS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A professional community for tech enthusiasts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground">Cookies</Link></li>
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
