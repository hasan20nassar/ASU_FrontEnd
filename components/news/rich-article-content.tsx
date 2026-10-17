"use client";

import React from "react";
import Image from "next/image";

interface RichArticleContentProps {
  content: string;
  isArabic?: boolean;
}

export function RichArticleContent({ content, isArabic = true }: RichArticleContentProps) {
  if (!content) return null;

  // Split into blocks by double newlines or single newlines
  const rawBlocks = content.split(/\n\n+/);

  return (
    <div className={`space-y-6 text-foreground/90 leading-relaxed ${isArabic ? "font-sans" : "font-sans"}`}>
      {rawBlocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Image Markdown: ![caption](url)
        const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imageMatch) {
          const caption = imageMatch[1];
          const url = imageMatch[2];
          return (
            <figure key={idx} className="my-8 overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="relative aspect-video max-h-[500px] w-full overflow-hidden bg-muted">
                <img
                  src={url}
                  alt={caption || "News image"}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-102"
                />
              </div>
              {caption && (
                <figcaption className="border-t bg-muted/40 px-4 py-2.5 text-center text-xs font-medium text-muted-foreground">
                  {caption}
                </figcaption>
              )}
            </figure>
          );
        }

        // Heading 2: ## ...
        if (trimmed.startsWith("## ")) {
          const text = trimmed.replace(/^##\s+/, "");
          return (
            <h2
              key={idx}
              className="mt-10 mb-4 border-s-4 border-primary ps-3.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              {text}
            </h2>
          );
        }

        // Heading 3: ### ...
        if (trimmed.startsWith("### ")) {
          const text = trimmed.replace(/^###\s+/, "");
          return (
            <h3 key={idx} className="mt-8 mb-3 text-xl font-bold text-foreground sm:text-2xl">
              {text}
            </h3>
          );
        }

        // Blockquote: > ...
        if (trimmed.startsWith("> ")) {
          const text = trimmed.replace(/^>\s+/, "").replace(/^"(.*)"$/, "$1");
          return (
            <blockquote
              key={idx}
              className="my-8 rounded-2xl border-s-4 border-primary bg-primary/5 p-6 dark:bg-primary/10"
            >
              <div className="text-xl font-medium italic text-foreground sm:text-2xl">
                &ldquo;{text}&rdquo;
              </div>
            </blockquote>
          );
        }

        // Bullet List: lines starting with - or *
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split("\n").filter((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "));
          return (
            <ul key={idx} className="my-5 space-y-2 ps-6 list-disc marker:text-primary">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-base sm:text-lg">
                  {renderInlineFormatting(item.replace(/^[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        // Horizontal Divider: ---
        if (trimmed === "---") {
          return <hr key={idx} className="my-10 border-border" />;
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-base sm:text-lg leading-relaxed text-foreground/85">
            {renderInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Handles inline bold (**text**), italic (*text*), and links ([text](url))
 */
function renderInlineFormatting(text: string): React.ReactNode {
  // Regex to match markdown links: [label](url)
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(renderBoldItalic(text.substring(lastIndex, match.index)));
    }
    const label = match[1];
    const url = match[2];
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-primary underline underline-offset-4 hover:opacity-80"
      >
        {label}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(renderBoldItalic(text.substring(lastIndex)));
  }

  return parts.length > 0 ? parts : text;
}

function renderBoldItalic(text: string): React.ReactNode {
  // Simple bold replacer: **bold**
  if (!text.includes("**")) return text;

  const segments = text.split(/\*\*(.*?)\*\*/g);
  return segments.map((seg, i) => {
    if (i % 2 === 1) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {seg}
        </strong>
      );
    }
    return seg;
  });
}
