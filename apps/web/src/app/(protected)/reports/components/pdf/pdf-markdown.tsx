'use client';

import { pdfStyles as styles } from '@/app/(protected)/reports/components/pdf/pdf-design';
import { Text, type TextProps, View } from '@react-pdf/renderer';

type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'unordered-list'; items: string[] };

type InlineSegment =
  | { type: 'text'; text: string }
  | { type: 'bold'; text: string }
  | { type: 'italic'; text: string };

export const ReportMarkdownBlock = ({ content }: { content: string }) => {
  const blocks = parseMarkdownBlocks(content);

  return (
    <View style={styles.markdownBlock}>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <InlineText
              key={index}
              style={
                block.level === 1
                  ? styles.heading1
                  : block.level === 2
                    ? styles.heading2
                    : styles.heading3
              }
              text={block.text}
            />
          );
        }

        if (block.type === 'paragraph') {
          return (
            <InlineText
              key={index}
              style={styles.paragraph}
              text={block.text}
            />
          );
        }

        return (
          <View key={index} style={styles.list}>
            {block.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.listItem}>
                <Text style={styles.listMarker}>
                  {block.type === 'ordered-list' ? `${itemIndex + 1}.` : '•'}
                </Text>
                <InlineText style={styles.listContent} text={item} />
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
};

const InlineText = ({
  style,
  text,
}: {
  style: TextProps['style'];
  text: string;
}) => {
  const segments = parseInlineSegments(text);

  return (
    <Text style={style}>
      {segments.map((segment, index) => (
        <Text
          key={index}
          style={
            segment.type === 'bold'
              ? styles.bold
              : segment.type === 'italic'
                ? styles.italic
                : undefined
          }
        >
          {segment.text}
        </Text>
      ))}
    </Text>
  );
};

function parseMarkdownBlocks(content: string): MarkdownBlock[] {
  return content
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.every((line) => line.startsWith('- '))) {
        return {
          type: 'unordered-list',
          items: lines.map((line) => line.slice(2).trim()),
        } satisfies MarkdownBlock;
      }

      if (lines.every((line) => /^\d+\.\s/.test(line))) {
        return {
          type: 'ordered-list',
          items: lines.map((line) => line.replace(/^\d+\.\s/, '').trim()),
        } satisfies MarkdownBlock;
      }

      const firstLine = lines[0] ?? '';

      if (firstLine.startsWith('### ')) {
        return {
          type: 'heading',
          level: 3,
          text: firstLine.slice(4).trim(),
        } satisfies MarkdownBlock;
      }

      if (firstLine.startsWith('## ')) {
        return {
          type: 'heading',
          level: 2,
          text: firstLine.slice(3).trim(),
        } satisfies MarkdownBlock;
      }

      if (firstLine.startsWith('# ')) {
        return {
          type: 'heading',
          level: 1,
          text: firstLine.slice(2).trim(),
        } satisfies MarkdownBlock;
      }

      return {
        type: 'paragraph',
        text: lines.join(' '),
      } satisfies MarkdownBlock;
    });
}

function parseInlineSegments(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  const matcher = /(\*\*[^*]+\*\*|_[^_]+_)/g;
  let cursor = 0;

  for (const match of text.matchAll(matcher)) {
    const start = match.index ?? 0;
    const matchedText = match[0];

    if (start > cursor) {
      segments.push({
        type: 'text',
        text: text.slice(cursor, start),
      });
    }

    if (matchedText.startsWith('**')) {
      segments.push({
        type: 'bold',
        text: matchedText.slice(2, -2),
      });
    } else {
      segments.push({
        type: 'italic',
        text: matchedText.slice(1, -1),
      });
    }

    cursor = start + matchedText.length;
  }

  if (cursor < text.length) {
    segments.push({
      type: 'text',
      text: text.slice(cursor),
    });
  }

  return segments.length > 0 ? segments : [{ type: 'text', text }];
}
