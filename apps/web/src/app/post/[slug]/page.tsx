import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Eye,
  Heart,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ThumbsUp,
  Twitter,
} from 'lucide-react';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Mock post data - replace with real API call
const mockPosts: Record<string, {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    username: string;
    avatar: string | null;
    bio: string;
    karma: number;
    followers: number;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
}> = {
  'building-scalable-microservices-with-go': {
    slug: 'building-scalable-microservices-with-go',
    title: 'Building Scalable Microservices with Go and Kubernetes',
    excerpt: 'Learn how to design, implement, and deploy production-ready microservices using Go and Kubernetes.',
    content: `
## Introduction

Microservices architecture has become the de facto standard for building large-scale, distributed systems. In this comprehensive guide, we'll explore how to build production-ready microservices using Go and Kubernetes.

## Why Go for Microservices?

Go is an excellent choice for microservices due to its:

- **Performance**: Go compiles to native machine code, offering near-C performance
- **Concurrency**: Built-in goroutines and channels make concurrent programming intuitive
- **Simplicity**: Clean syntax and minimal language features reduce cognitive load
- **Fast compilation**: Quick build times accelerate development cycles
- **Small binaries**: Compiled binaries are small and have minimal dependencies

\`\`\`go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        fmt.Fprintf(w, "OK")
    })

    http.ListenAndServe(":8080", nil)
}
\`\`\`

## Service Architecture

When designing microservices, consider these key principles:

### 1. Single Responsibility

Each service should do one thing and do it well. This makes services easier to understand, test, and maintain.

### 2. API-First Design

Design your APIs before implementation. Use OpenAPI/Swagger specifications to document and validate your contracts.

### 3. Event-Driven Communication

Use message queues (like Kafka or RabbitMQ) for asynchronous communication between services.

## Kubernetes Deployment

Kubernetes provides powerful primitives for deploying and managing microservices:

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: myregistry/user-service:v1.0.0
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
\`\`\`

## Observability

Implement the three pillars of observability:

1. **Logging**: Structured JSON logs with correlation IDs
2. **Metrics**: Prometheus metrics for performance monitoring
3. **Tracing**: Distributed tracing with OpenTelemetry

## Conclusion

Building microservices with Go and Kubernetes requires careful planning and adherence to best practices. Start small, iterate quickly, and continuously improve your architecture based on real-world feedback.

In the next article, we'll dive deeper into service mesh implementations with Istio.
    `,
    coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&h=630&fit=crop',
    author: {
      name: 'John Doe',
      username: 'johndoe',
      avatar: null,
      bio: 'Senior Software Engineer at Google. Building distributed systems at scale.',
      karma: 15200,
      followers: 2340,
    },
    category: 'Engineering',
    tags: ['go', 'kubernetes', 'microservices', 'backend', 'devops'],
    publishedAt: '2024-01-15T10:00:00Z',
    readTime: 15,
    views: 12500,
    likes: 1892,
    comments: 127,
  },
  'ai-coding-assistants-2025': {
    slug: 'ai-coding-assistants-2025',
    title: 'The State of AI Coding Assistants in 2025',
    excerpt: 'A deep dive into how AI assistants like Copilot, Claude, and others are changing the way developers write code.',
    content: `
## The AI Revolution in Software Development

The landscape of software development has fundamentally changed with the advent of AI coding assistants. In this article, we explore the current state of these tools and their impact on developer productivity.

## Major Players

### GitHub Copilot

GitHub Copilot, powered by OpenAI's Codex, remains one of the most popular AI coding assistants. Key features include:

- Real-time code suggestions
- Multi-language support
- IDE integration (VS Code, JetBrains, Neovim)

### Claude by Anthropic

Claude has emerged as a powerful alternative, particularly for:

- Complex code explanations
- Architecture discussions
- Code review and refactoring suggestions

### Amazon CodeWhisperer

AWS's offering integrates deeply with AWS services and provides:

- Security scanning
- Reference tracking
- AWS SDK expertise

## Productivity Impact

Studies show that developers using AI assistants:

- Complete tasks **55% faster** on average
- Write **40% more code** per day
- Report **higher job satisfaction**

## Best Practices

1. **Use AI as a collaborator, not a replacement**
2. **Always review generated code**
3. **Provide clear context and constraints**
4. **Learn prompt engineering**

## Conclusion

AI coding assistants are here to stay. Embrace them as powerful tools in your development workflow.
    `,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
    author: {
      name: 'Sarah Chen',
      username: 'sarahtech',
      avatar: null,
      bio: 'AI/ML Engineer at OpenAI. Exploring the intersection of AI and developer tools.',
      karma: 12400,
      followers: 5670,
    },
    category: 'AI & ML',
    tags: ['ai', 'programming', 'copilot', 'productivity'],
    publishedAt: '2024-01-20T14:30:00Z',
    readTime: 8,
    views: 8900,
    likes: 1320,
    comments: 45,
  },
  'startup-lessons-from-unicorns': {
    slug: 'startup-lessons-from-unicorns',
    title: 'What I Learned Working at 3 Unicorn Startups',
    excerpt: 'Key insights on culture, scaling, and what separates successful startups from the rest.',
    content: `
## My Journey Through Unicorn Startups

Over the past decade, I've had the privilege of working at three unicorn startups. Here are the key lessons I've learned.

## Lesson 1: Culture is Everything

The best startups have a clearly defined culture from day one. This includes:

- **Values that are lived, not just displayed**
- **Psychological safety for taking risks**
- **Transparency in decision-making**

## Lesson 2: Speed Beats Perfection

In the startup world, execution speed is critical:

> "If you're not embarrassed by the first version of your product, you've launched too late." — Reid Hoffman

## Lesson 3: Hire for Potential

The best hires I've seen weren't always the most experienced. They were:

- Curious and eager to learn
- Comfortable with ambiguity
- Strong communicators

## Lesson 4: Focus is Your Superpower

Successful startups say "no" to 99% of opportunities to focus on the 1% that matters.

## Lesson 5: Build for Your Best Users

Don't try to please everyone. Build an amazing experience for your core users.

## Conclusion

Working at unicorn startups taught me that success comes from great people, clear focus, and relentless execution.
    `,
    coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=630&fit=crop',
    author: {
      name: 'Alex Kim',
      username: 'alexfounder',
      avatar: null,
      bio: 'Serial entrepreneur. Previously at Stripe, Airbnb, and Uber.',
      karma: 9900,
      followers: 3210,
    },
    category: 'Startups',
    tags: ['startup', 'career', 'entrepreneurship', 'leadership'],
    publishedAt: '2024-01-18T09:00:00Z',
    readTime: 12,
    views: 6700,
    likes: 890,
    comments: 32,
  },
  'rust-for-web-developers': {
    slug: 'rust-for-web-developers',
    title: 'Rust for Web Developers: A Practical Introduction',
    excerpt: "Coming from JavaScript or Python? Here's how to get started with Rust and why you might want to.",
    content: `
## Why Rust?

As a web developer, you might wonder why you should learn Rust. Here's why:

- **Performance**: Rust is as fast as C/C++
- **Safety**: No null pointer exceptions or data races
- **Modern tooling**: Cargo, rustfmt, clippy

## Getting Started

Install Rust using rustup:

\`\`\`bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
\`\`\`

## Your First Rust Program

\`\`\`rust
fn main() {
    println!("Hello, web developer!");
}
\`\`\`

## Web Frameworks

Popular Rust web frameworks:

1. **Actix-web**: High-performance, actor-based
2. **Axum**: Modern, tower-based framework
3. **Rocket**: Developer-friendly with macros

## Building an API

\`\`\`rust
use axum::{routing::get, Router, Json};
use serde::Serialize;

#[derive(Serialize)]
struct User {
    id: u64,
    name: String,
}

async fn get_user() -> Json<User> {
    Json(User {
        id: 1,
        name: "John".to_string(),
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/user", get(get_user));
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
\`\`\`

## Conclusion

Rust has a learning curve, but the payoff is worth it. Start small, build projects, and embrace the compiler's guidance.
    `,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
    author: {
      name: 'Mike Brown',
      username: 'rustacean',
      avatar: null,
      bio: 'Rust enthusiast and systems programmer. Teaching Rust to web developers.',
      karma: 7800,
      followers: 1890,
    },
    category: 'Engineering',
    tags: ['rust', 'webdev', 'programming', 'backend'],
    publishedAt: '2024-01-22T11:00:00Z',
    readTime: 10,
    views: 4500,
    likes: 567,
    comments: 28,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = mockPosts[slug];

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = mockPosts[slug];

  if (!post) {
    notFound();
  }

  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 h-[400px] bg-gradient-to-b from-muted/50 to-background" />

          <div className="container relative mx-auto px-4 pt-8 pb-12">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            {/* Article Header */}
            <div className="max-w-4xl mx-auto">
              {/* Category & Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="font-medium">
                  {post.category}
                </Badge>
                {post.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag}`}
                    className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                {post.excerpt}
              </p>

              {/* Author & Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <Link href={`/@${post.author.username}`}>
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                      <AvatarImage src={post.author.avatar || ''} alt={post.author.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link
                      href={`/@${post.author.username}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {post.author.name}
                    </Link>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {publishedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime} min read
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Bookmark className="h-4 w-4" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Cover Image */}
              <div className="relative aspect-[2/1] rounded-xl overflow-hidden mb-12">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12">
              {/* Main Content */}
              <article className="prose prose-lg dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />
              </article>

              {/* Sidebar - Sticky Actions */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-4">
                  {/* Like Button */}
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-500 dark:hover:bg-red-950"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <span className="text-sm font-medium">{formatNumber(post.likes)}</span>
                  </div>

                  {/* Comment Button */}
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <span className="text-sm font-medium">{post.comments}</span>
                  </div>

                  {/* Bookmark Button */}
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full"
                    >
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </div>

                  <Separator />

                  {/* Share Buttons */}
                  <div className="flex flex-col items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </aside>
            </div>

            {/* Author Card */}
            <div className="mt-16 p-6 rounded-xl border bg-card">
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href={`/@${post.author.username}`}>
                  <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                    <AvatarImage src={post.author.avatar || ''} alt={post.author.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/@${post.author.username}`}
                        className="text-xl font-bold hover:text-primary transition-colors"
                      >
                        {post.author.name}
                      </Link>
                      <p className="text-muted-foreground mt-1">{post.author.bio}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span>{formatNumber(post.author.karma)} karma</span>
                        <span>{formatNumber(post.author.followers)} followers</span>
                      </div>
                    </div>
                    <Button>Follow</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {formatNumber(post.views)} views
              </span>
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                {formatNumber(post.likes)} likes
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {post.comments} comments
              </span>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t p-4">
              <div className="flex items-center justify-around max-w-md mx-auto">
                <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
                  <Heart className="h-5 w-5" />
                  <span className="text-xs">{formatNumber(post.likes)}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-xs">{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
                  <Bookmark className="h-5 w-5" />
                  <span className="text-xs">Save</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
                  <Share2 className="h-5 w-5" />
                  <span className="text-xs">Share</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper function to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Helper function to format markdown-like content to HTML
function formatContent(content: string): string {
  return content
    // Headers
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith('<')) return match;
      return match;
    });
}
