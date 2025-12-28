'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { useTheme } from 'next-themes';
import { codeToHtml } from 'shiki';

import { cn } from '@/lib/utils';
import { Button } from './button';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'text',
  filename,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const [highlightedCode, setHighlightedCode] = React.useState<string>('');
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    const highlight = async () => {
      try {
        const html = await codeToHtml(code.trim(), {
          lang: language,
          theme: resolvedTheme === 'dark' ? 'github-dark' : 'github-light',
        });
        setHighlightedCode(html);
      } catch (error) {
        // Fallback for unsupported languages
        const html = await codeToHtml(code.trim(), {
          lang: 'text',
          theme: resolvedTheme === 'dark' ? 'github-dark' : 'github-light',
        });
        setHighlightedCode(html);
      }
    };

    highlight();
  }, [code, language, resolvedTheme, mounted]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Language display names
  const languageNames: Record<string, string> = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    tsx: 'TSX',
    jsx: 'JSX',
    py: 'Python',
    python: 'Python',
    go: 'Go',
    rust: 'Rust',
    rb: 'Ruby',
    ruby: 'Ruby',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    cs: 'C#',
    csharp: 'C#',
    php: 'PHP',
    swift: 'Swift',
    kotlin: 'Kotlin',
    sql: 'SQL',
    bash: 'Bash',
    shell: 'Shell',
    sh: 'Shell',
    yaml: 'YAML',
    yml: 'YAML',
    json: 'JSON',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    markdown: 'Markdown',
    md: 'Markdown',
    dockerfile: 'Dockerfile',
    docker: 'Docker',
    graphql: 'GraphQL',
    prisma: 'Prisma',
  };

  const displayLanguage = languageNames[language.toLowerCase()] || language.toUpperCase();

  if (!mounted) {
    return (
      <div className={cn('relative group rounded-lg overflow-hidden', className)}>
        <div className="bg-zinc-950 dark:bg-zinc-900 p-4">
          <pre className="text-sm text-zinc-300 overflow-x-auto">
            <code>{code.trim()}</code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative group rounded-lg overflow-hidden border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-b">
        <div className="flex items-center gap-3">
          {/* Mac-style dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>

          {/* Filename or Language */}
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {filename || displayLanguage}
          </span>
        </div>

        {/* Copy Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* Code Content */}
      <div className="relative overflow-x-auto bg-zinc-50 dark:bg-zinc-900">
        {highlightedCode ? (
          <div
            className={cn(
              'shiki-wrapper text-sm p-4',
              showLineNumbers && 'show-line-numbers',
              '[&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0',
              '[&_code]:!bg-transparent [&_code]:block',
              '[&_.line]:inline-block [&_.line]:w-full',
              showLineNumbers && '[&_.line]:pl-12 [&_.line]:relative',
              showLineNumbers && '[&_.line]:before:content-[counter(line)] [&_.line]:before:absolute [&_.line]:before:left-0 [&_.line]:before:w-8 [&_.line]:before:text-right [&_.line]:before:text-zinc-400 [&_.line]:before:text-xs [&_.line]:before:select-none',
              showLineNumbers && '[&_.line]:[counter-increment:line]',
              '[&_pre]:[counter-reset:line]'
            )}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        ) : (
          <pre className="text-sm p-4 text-zinc-800 dark:text-zinc-200 overflow-x-auto">
            <code>{code.trim()}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

// Inline code component
interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code
      className={cn(
        'relative rounded bg-zinc-100 dark:bg-zinc-800 px-[0.4em] py-[0.2em] font-mono text-sm text-zinc-800 dark:text-zinc-200',
        className
      )}
    >
      {children}
    </code>
  );
}
