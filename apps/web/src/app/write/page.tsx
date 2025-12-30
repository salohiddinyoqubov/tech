'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Bold,
  Code,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  MoreHorizontal,
  Quote,
  Save,
  Send,
  Settings,
  Sparkles,
  Underline,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Post formats
const postFormats = [
  { value: 'deep_dive', label: 'Deep Dive', description: 'In-depth analysis or tutorial' },
  { value: 'tutorial', label: 'Tutorial', description: 'Step-by-step guide' },
  { value: 'news_brief', label: 'News Brief', description: 'Quick news or update' },
  { value: 'case_study', label: 'Case Study', description: 'Real-world example or analysis' },
  { value: 'discussion', label: 'Discussion', description: 'Open-ended discussion' },
  { value: 'series', label: 'Series', description: 'Part of a series' },
];

// Popular tags
const popularTags = [
  'javascript', 'python', 'react', 'ai', 'startup', 'career',
  'webdev', 'devops', 'ml', 'golang', 'rust', 'typescript',
];

function WritePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTag = searchParams.get('tag');

  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [excerpt, setExcerpt] = React.useState('');
  const [coverImage, setCoverImage] = React.useState('');
  const [format, setFormat] = React.useState('deep_dive');
  const [tags, setTags] = React.useState<string[]>(initialTag ? [initialTag] : []);
  const [tagInput, setTagInput] = React.useState('');
  const [isPreview, setIsPreview] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);

  const contentRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-save draft
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (title || content) {
        setIsSaving(true);
        // Simulate saving
        setTimeout(() => {
          setLastSaved(new Date());
          setIsSaving(false);
        }, 500);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(timer);
  }, [title, content]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setIsPreview(!isPreview);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreview]);

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
    }, 500);
  };

  const handlePublish = () => {
    // TODO: Implement publish logic
    console.log('Publishing:', { title, content, excerpt, coverImage, format, tags });
  };

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
    if (normalizedTag && !tags.includes(normalizedTag) && tags.length < 5) {
      setTags([...tags, normalizedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);

    setContent(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, label: 'Bold', before: '**', after: '**' },
    { icon: Italic, label: 'Italic', before: '*', after: '*' },
    { icon: Underline, label: 'Underline', before: '<u>', after: '</u>' },
    { icon: Code, label: 'Inline Code', before: '`', after: '`' },
    { icon: LinkIcon, label: 'Link', before: '[', after: '](url)' },
  ];

  const blockButtons = [
    { icon: Heading1, label: 'Heading 1', before: '# ', after: '' },
    { icon: Heading2, label: 'Heading 2', before: '## ', after: '' },
    { icon: Heading3, label: 'Heading 3', before: '### ', after: '' },
    { icon: Quote, label: 'Quote', before: '> ', after: '' },
    { icon: List, label: 'Bullet List', before: '- ', after: '' },
    { icon: ListOrdered, label: 'Numbered List', before: '1. ', after: '' },
  ];

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-normal">Draft</Badge>
                {lastSaved && (
                  <span className="text-xs text-muted-foreground">
                    {isSaving ? 'Saving...' : `Saved ${lastSaved.toLocaleTimeString()}`}
                  </span>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
                className={cn(isPreview && 'bg-accent')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={!title.trim() || !content.trim()}
                className="shadow-lg shadow-primary/25"
              >
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowSettings(!showSettings)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Post Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Delete Draft
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Editor */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div
              className={cn(
                'relative group rounded-2xl border-2 border-dashed transition-colors overflow-hidden',
                coverImage ? 'border-transparent' : 'border-muted-foreground/20 hover:border-primary/50'
              )}
            >
              {coverImage ? (
                <div className="relative aspect-[21/9]">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button variant="secondary" size="sm">
                      Change Image
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCoverImage('')}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="aspect-[21/9] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  <div className="text-center">
                    <p className="font-medium">Add a cover image</p>
                    <p className="text-sm text-muted-foreground">Recommended size: 1200 x 630px</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Upload Image
                  </Button>
                </div>
              )}
            </div>

            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write your title here..."
              className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40"
            />

            {/* Formatting Toolbar */}
            {!isPreview && (
              <div className="flex flex-wrap items-center gap-1 p-2 rounded-lg border bg-muted/30">
                {formatButtons.map((btn) => (
                  <Button
                    key={btn.label}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => insertFormatting(btn.before, btn.after)}
                    title={btn.label}
                  >
                    <btn.icon className="h-4 w-4" />
                  </Button>
                ))}
                <Separator orientation="vertical" className="h-6 mx-1" />
                {blockButtons.map((btn) => (
                  <Button
                    key={btn.label}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => insertFormatting(btn.before, btn.after)}
                    title={btn.label}
                  >
                    <btn.icon className="h-4 w-4" />
                  </Button>
                ))}
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => insertFormatting('\n```javascript\n', '\n```\n')}
                >
                  <Code className="h-4 w-4 mr-1" />
                  Code Block
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => insertFormatting('\n![Alt text](', ')\n')}
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Image
                </Button>
              </div>
            )}

            {/* Content Editor / Preview */}
            {isPreview ? (
              <div className="prose prose-lg dark:prose-invert max-w-none min-h-[400px] p-4 rounded-lg border bg-card">
                {content ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: content
                        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.+?)\*/g, '<em>$1</em>')
                        .replace(/`([^`]+)`/g, '<code>$1</code>')
                        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
                        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
                        .replace(/^- (.+)$/gm, '<li>$1</li>')
                        .replace(/\n/g, '<br />')
                    }}
                  />
                ) : (
                  <p className="text-muted-foreground italic">Your content preview will appear here...</p>
                )}
              </div>
            ) : (
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your story... (Markdown supported)"
                className="w-full min-h-[500px] text-lg bg-transparent border rounded-lg p-4 outline-none resize-none placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20"
              />
            )}

            {/* Word Count */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Sidebar - Settings */}
          <aside className="space-y-6">
            {/* Post Format */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-4">Post Format</h3>
              <div className="space-y-2">
                {postFormats.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-colors',
                      format === f.value
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:bg-accent'
                    )}
                  >
                    <p className="font-medium text-sm">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-4">Tags</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add up to 5 tags to help readers find your post
              </p>

              {/* Tag Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  placeholder="Add a tag..."
                  className="flex-1 h-9 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={tags.length >= 5}
                />
                <Button
                  size="sm"
                  onClick={() => addTag(tagInput)}
                  disabled={!tagInput.trim() || tags.length >= 5}
                >
                  Add
                </Button>
              </div>

              {/* Selected Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="pl-2 pr-1 py-1 gap-1"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 h-4 w-4 rounded-full hover:bg-muted flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Popular Tags */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Popular tags</p>
                <div className="flex flex-wrap gap-1">
                  {popularTags
                    .filter((t) => !tags.includes(t))
                    .slice(0, 8)
                    .map((tag) => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                        disabled={tags.length >= 5}
                      >
                        #{tag}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-4">Excerpt</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A short summary that appears in post previews
              </p>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a brief summary..."
                maxLength={300}
                className="w-full h-24 px-3 py-2 rounded-lg border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {excerpt.length}/300
              </p>
            </div>

            {/* AI Assist */}
            <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-purple-500/10 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">AI Writing Assistant</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Get help with writing, editing, and improving your content.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>

            {/* Tips */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-4">Writing Tips</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Use descriptive headings to structure your content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Include code examples with proper syntax highlighting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Add images to make your post more engaging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>End with a clear conclusion or call to action</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading editor...</div>
      </div>
    }>
      <WritePageContent />
    </Suspense>
  );
}
