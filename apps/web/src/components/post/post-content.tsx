'use client';

import * as React from 'react';
import { CodeBlock } from '@/components/ui/code-block';

interface PostContentProps {
  content: string;
}

interface ContentBlock {
  type: 'text' | 'code' | 'heading' | 'blockquote' | 'list';
  content: string;
  language?: string;
  level?: number;
  items?: string[];
}

export function PostContent({ content }: PostContentProps) {
  const blocks = parseContent(content);

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20">
      {blocks.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'code':
      return (
        <div className="not-prose my-6">
          <CodeBlock
            code={block.content}
            language={block.language || 'text'}
            showLineNumbers={block.content.split('\n').length > 3}
          />
        </div>
      );

    case 'heading':
      const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
      const id = block.content.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return (
        <HeadingTag id={id} className="group">
          {block.content}
          <a
            href={`#${id}`}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
          >
            #
          </a>
        </HeadingTag>
      );

    case 'blockquote':
      return (
        <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground">
          {block.content}
        </blockquote>
      );

    case 'list':
      return (
        <ul className="list-disc pl-6 space-y-2">
          {block.items?.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: formatInlineText(item) }} />
          ))}
        </ul>
      );

    case 'text':
    default:
      if (!block.content.trim()) return null;
      return <p dangerouslySetInnerHTML={{ __html: formatInlineText(block.content) }} />;
  }
}

function parseContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text';
      const codeLines: string[] = [];
      i++;

      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }

      blocks.push({
        type: 'code',
        content: codeLines.join('\n'),
        language,
      });
      i++;
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        content: headingMatch[2],
        level: headingMatch[1].length,
      });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push({
        type: 'blockquote',
        content: quoteLines.join(' '),
      });
      continue;
    }

    // Unordered list
    if (line.match(/^[-*]\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({
        type: 'list',
        content: '',
        items,
      });
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({
        type: 'list',
        content: '',
        items,
      });
      continue;
    }

    // Regular text - collect paragraphs
    const textLines: string[] = [];
    while (
      i < lines.length &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('> ') &&
      !lines[i].match(/^[-*]\s+/) &&
      !lines[i].match(/^\d+\.\s+/)
    ) {
      if (lines[i].trim() === '' && textLines.length > 0) {
        // End of paragraph
        break;
      }
      if (lines[i].trim()) {
        textLines.push(lines[i]);
      }
      i++;
    }

    if (textLines.length > 0) {
      blocks.push({
        type: 'text',
        content: textLines.join(' '),
      });
    } else {
      i++;
    }
  }

  return blocks;
}

function formatInlineText(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="relative rounded bg-zinc-100 dark:bg-zinc-800 px-[0.4em] py-[0.2em] font-mono text-sm">$1</code>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
}
