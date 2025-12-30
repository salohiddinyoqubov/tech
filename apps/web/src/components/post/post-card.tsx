import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, MessageCircle, Share2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn, formatRelativeDate, formatNumber, getInitials, getTagColor } from '@/lib/utils';

interface PostCardProps {
  post: {
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
  };
  variant?: 'default' | 'featured' | 'compact';
}

const formatBadges: Record<string, { label: string; color: string }> = {
  deep_dive: { label: 'Deep Dive', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  tutorial: { label: 'Tutorial', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  news_brief: { label: 'News', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  series: { label: 'Series', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  case_study: { label: 'Case Study', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
  discussion: { label: 'Discussion', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
};

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const formatBadge = formatBadges[post.format];

  if (variant === 'compact') {
    return (
      <article className="group flex gap-4 py-4 border-b last:border-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/user/${post.author.username}`} className="flex items-center gap-2">
              <Avatar className="h-6 w-6" status={post.author.status}>
                <AvatarImage src={post.author.avatarUrl} alt={post.author.fullName} />
                <AvatarFallback className="text-xs">{getInitials(post.author.fullName)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hover:underline">{post.author.fullName}</span>
            </Link>
            <span className="text-muted-foreground">·</span>
            <time className="text-sm text-muted-foreground">{formatRelativeDate(post.publishedAt)}</time>
          </div>

          <Link href={`/post/${post.slug}`} className="block group-hover:opacity-80 transition-opacity">
            <h3 className="font-semibold text-base mb-1 line-clamp-2">{post.title}</h3>
          </Link>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span>{post.readingTime} min read</span>
            <span className="flex items-center gap-1">
              <span>👏</span> {formatNumber(post.clapsCount)}
            </span>
          </div>
        </div>

        {post.coverImageUrl && (
          <Link href={`/post/${post.slug}`} className="shrink-0">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          </Link>
        )}
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="group relative rounded-2xl overflow-hidden bg-card border post-card">
        {post.coverImageUrl && (
          <Link href={`/post/${post.slug}`} className="block">
            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </Link>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {formatBadge && (
            <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-medium mb-3', formatBadge.color)}>
              {formatBadge.label}
            </span>
          )}

          <Link href={`/post/${post.slug}`}>
            <h2 className="text-2xl font-bold mb-2 line-clamp-2 group-hover:underline">{post.title}</h2>
          </Link>

          <p className="text-white/80 line-clamp-2 mb-4">{post.excerpt}</p>

          <div className="flex items-center justify-between">
            <Link href={`/user/${post.author.username}`} className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white" status={post.author.status}>
                <AvatarImage src={post.author.avatarUrl} alt={post.author.fullName} />
                <AvatarFallback>{getInitials(post.author.fullName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.fullName}</p>
                <p className="text-sm text-white/70">{formatRelativeDate(post.publishedAt)} · {post.readingTime} min read</p>
              </div>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Default variant
  return (
    <article className="group rounded-xl overflow-hidden bg-card border post-card">
      {post.coverImageUrl && (
        <Link href={`/post/${post.slug}`} className="block">
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Link href={`/user/${post.author.username}`} className="flex items-center gap-2">
            <Avatar className="h-8 w-8" status={post.author.status}>
              <AvatarImage src={post.author.avatarUrl} alt={post.author.fullName} />
              <AvatarFallback className="text-xs">{getInitials(post.author.fullName)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hover:underline">{post.author.fullName}</span>
          </Link>

          {formatBadge && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className={cn('px-2 py-0.5 rounded text-xs font-medium', formatBadge.color)}>
                {formatBadge.label}
              </span>
            </>
          )}
        </div>

        <Link href={`/post/${post.slug}`} className="block">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.excerpt}</p>
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                style={{ borderLeft: `3px solid ${getTagColor(tag.name)}` }}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time>{formatRelativeDate(post.publishedAt)}</time>
            <span>{post.readingTime} min read</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <span className="mr-1">👏</span>
              <span className="text-xs">{formatNumber(post.clapsCount)}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{formatNumber(post.commentsCount)}</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
