'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Bookmark, MessageCircle, TrendingUp } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatRelativeDate, formatNumber, getInitials } from '@/lib/utils';

interface BentoPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl?: string;
  readingTime: number;
  clapsCount: number;
  commentsCount: number;
  publishedAt: string;
  format: string;
  author: {
    username: string;
    fullName: string;
    avatarUrl?: string;
    status?: 'open_to_work' | 'hiring' | 'mentor' | 'collab';
  };
  tags: Array<{ name: string; slug: string }>;
}

interface BentoGridProps {
  posts: BentoPost[];
  className?: string;
}

const formatBadges: Record<string, { label: string; color: string; bgClass: string }> = {
  deep_dive: { label: 'Deep Dive', color: '#3b82f6', bgClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  tutorial: { label: 'Tutorial', color: '#22c55e', bgClass: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  news_brief: { label: 'News', color: '#f97316', bgClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  series: { label: 'Series', color: '#a855f7', bgClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  case_study: { label: 'Case Study', color: '#ec4899', bgClass: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  discussion: { label: 'Discussion', color: '#eab308', bgClass: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
};

export function BentoGrid({ posts, className }: BentoGridProps) {
  if (posts.length === 0) return null;

  // Distribute posts into grid positions
  const [hero, ...rest] = posts;
  const secondary = rest.slice(0, 2);
  const tertiary = rest.slice(2, 5);
  const remaining = rest.slice(5);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]">
        {/* Hero Card - Large Featured */}
        {hero && (
          <BentoCard
            post={hero}
            size="hero"
            className="md:col-span-2 md:row-span-2"
          />
        )}

        {/* Secondary Cards - Medium */}
        {secondary.map((post, i) => (
          <BentoCard
            key={post.id}
            post={post}
            size="medium"
            className="lg:col-span-1"
            showImage={i === 0}
          />
        ))}

        {/* Tertiary Cards - Standard */}
        {tertiary.map((post) => (
          <BentoCard
            key={post.id}
            post={post}
            size="standard"
            className="lg:col-span-1"
          />
        ))}
      </div>

      {/* Additional Posts - Compact Grid */}
      {remaining.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {remaining.map((post) => (
            <BentoCard
              key={post.id}
              post={post}
              size="compact"
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface BentoCardProps {
  post: BentoPost;
  size: 'hero' | 'medium' | 'standard' | 'compact';
  className?: string;
  showImage?: boolean;
}

function BentoCard({ post, size, className, showImage = true }: BentoCardProps) {
  const formatBadge = formatBadges[post.format];

  // Hero Card - Large with image background
  if (size === 'hero') {
    return (
      <article className={cn(
        'group relative rounded-2xl overflow-hidden bg-card border transition-all duration-300',
        'hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1',
        className
      )}>
        {post.coverImageUrl && (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Trending Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm">
            <TrendingUp className="h-3 w-3 mr-1" />
            Featured
          </Badge>
          {formatBadge && (
            <Badge className={cn('backdrop-blur-sm', formatBadge.bgClass)}>
              {formatBadge.label}
            </Badge>
          )}
        </div>

        {/* Content Overlay */}
        <Link href={`/post/${post.slug}`} className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold line-clamp-3 group-hover:underline decoration-2 underline-offset-4">
              {post.title}
            </h2>
            <p className="text-white/80 line-clamp-2 text-base hidden md:block">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white/30">
                  <AvatarImage src={post.author.avatarUrl} alt={post.author.fullName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(post.author.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{post.author.fullName}</p>
                  <p className="text-xs text-white/60">
                    {formatRelativeDate(post.publishedAt)} · {post.readingTime} min read
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/80">
                <span className="flex items-center gap-1 text-sm">
                  👏 {formatNumber(post.clapsCount)}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <MessageCircle className="h-4 w-4" />
                  {formatNumber(post.commentsCount)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Medium Card - With or without image
  if (size === 'medium') {
    return (
      <article className={cn(
        'group relative rounded-xl overflow-hidden bg-card border transition-all duration-300',
        'hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5',
        className
      )}>
        {showImage && post.coverImageUrl && (
          <>
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </>
        )}

        <Link
          href={`/post/${post.slug}`}
          className={cn(
            'absolute inset-0 flex flex-col p-5',
            showImage && post.coverImageUrl ? 'justify-end text-white' : 'justify-between'
          )}
        >
          {formatBadge && (
            <Badge className={cn('w-fit mb-2', formatBadge.bgClass)}>
              {formatBadge.label}
            </Badge>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
              {post.title}
            </h3>
            {!showImage && (
              <p className="text-muted-foreground text-sm line-clamp-2">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className={cn(
            'flex items-center justify-between mt-auto pt-3',
            showImage && post.coverImageUrl ? 'text-white/80' : 'text-muted-foreground'
          )}>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.fullName} />
                <AvatarFallback className="text-xs">{getInitials(post.author.fullName)}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{post.author.fullName}</span>
            </div>
            <span className="text-xs">{post.readingTime} min</span>
          </div>
        </Link>
      </article>
    );
  }

  // Standard Card - Simple with accent border
  if (size === 'standard') {
    return (
      <article className={cn(
        'group relative rounded-xl overflow-hidden bg-card border transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20',
        className
      )}>
        <Link href={`/post/${post.slug}`} className="flex flex-col h-full p-5">
          <div className="flex-1 space-y-2">
            {formatBadge && (
              <Badge variant="outline" className={cn('mb-2', formatBadge.bgClass)}>
                {formatBadge.label}
              </Badge>
            )}
            <h3 className="font-semibold line-clamp-3 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.fullName} />
                <AvatarFallback className="text-[10px]">{getInitials(post.author.fullName)}</AvatarFallback>
              </Avatar>
              <span className="font-medium truncate max-w-[80px]">{post.author.fullName.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👏 {formatNumber(post.clapsCount)}</span>
            </div>
          </div>
        </Link>

        {/* Accent Border */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
          style={{ backgroundColor: formatBadge?.color || '#3b82f6' }}
        />
      </article>
    );
  }

  // Compact Card - Horizontal layout
  return (
    <article className={cn(
      'group rounded-xl overflow-hidden bg-card border transition-all duration-300',
      'hover:shadow-lg hover:shadow-primary/5',
      className
    )}>
      <Link href={`/post/${post.slug}`} className="flex h-full">
        {post.coverImageUrl && (
          <div className="relative w-1/3 min-w-[120px] overflow-hidden bg-muted">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex-1 flex flex-col p-4">
          <div className="flex items-center gap-2 mb-2">
            {formatBadge && (
              <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', formatBadge.bgClass)}>
                {formatBadge.label}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">{post.readingTime} min</span>
          </div>

          <h3 className="font-semibold text-sm line-clamp-2 flex-1 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          <div className="flex items-center justify-between mt-3 pt-2 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.fullName} />
                <AvatarFallback className="text-[10px]">{getInitials(post.author.fullName)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{post.author.fullName.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👏 {formatNumber(post.clapsCount)}</span>
              <MessageCircle className="h-3 w-3" />
              <span>{post.commentsCount}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

// Featured Section Component
interface FeaturedSectionProps {
  title: string;
  posts: BentoPost[];
  viewAllHref?: string;
}

export function FeaturedSection({ title, posts, viewAllHref }: FeaturedSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {viewAllHref && (
          <Button variant="ghost" size="sm" asChild className="text-primary">
            <Link href={viewAllHref}>
              View all
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        )}
      </div>
      <BentoGrid posts={posts} />
    </section>
  );
}
