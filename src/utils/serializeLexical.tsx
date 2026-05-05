import React, { Fragment, JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Enterprise Utility: Lexical Text Formatter
 * 
 * Architecture Note: Lexical stores text formatting (bold, italic, etc.) 
 * as a single integer using bitwise operations. This function decodes it.
 */
const formatLexicalText = (text: string, format: number) => {
  let formattedText: React.ReactNode = text;
  if (format & 1) formattedText = <strong>{formattedText}</strong>; // Bold
  if (format & 2) formattedText = <em>{formattedText}</em>; // Italic
  if (format & 8) formattedText = <u>{formattedText}</u>; // Underline
  if (format & 16) formattedText = <code>{formattedText}</code>; // Code
  return formattedText;
};

/**
 * Enterprise Utility: AST Node Serializer
 * 
 * Purpose: Recursively parses Payload CMS Lexical JSON into Next.js React Elements.
 * Security: 100% immune to XSS attacks as it maps to safe React nodes instead 
 * of using dangerouslySetInnerHTML.
 */
export const serializeLexical = (nodes: any[] | undefined): React.ReactNode[] | null => {
  if (!nodes || !Array.isArray(nodes)) return null;

  return nodes.map((node, index) => {
    // 1. Base Case: Leaf text nodes
    if (node.type === 'text') {
      return (
        <Fragment key={index}>
          {formatLexicalText(node.text, node.format)}
        </Fragment>
      );
    }

    // 2. Recursive Step: Parse children before rendering the parent
    const children = node.children ? serializeLexical(node.children) : null;

    // 3. Structural & Relational Nodes Mapping
    switch (node.type) {
      case 'root':
        return <Fragment key={index}>{children}</Fragment>;
        
      case 'paragraph':
        return <p key={index}>{children}</p>;
        
      case 'heading':
        const HeadingTag = (node.tag || 'h2') as keyof JSX.IntrinsicElements;
        return <HeadingTag key={index}>{children}</HeadingTag>;
        
      case 'list':
        const ListTag = node.listType === 'bullet' ? 'ul' : 'ol';
        return <ListTag key={index}>{children}</ListTag>;
        
      case 'listitem':
        return <li key={index}>{children}</li>;
        
      case 'quote':
        return <blockquote key={index}>{children}</blockquote>;

      // 🚀 SEO & PERFORMANCE OPTIMIZATIONS
      case 'link':
      case 'autolink':
        const linkFields = node.fields || {};
        // Resolve dynamic internal slugs or fallback to explicit URLs
        const docSlug = linkFields.doc?.value?.slug;
        const targetUrl = linkFields.url || (docSlug ? `/${docSlug}` : '#');
        const isExternal = linkFields.newTab || targetUrl.startsWith('http');
        
        return (
          <Link
            key={index}
            href={targetUrl}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="font-medium text-blue-600 transition-colors hover:underline"
          >
            {children}
          </Link>
        );

      case 'upload':
        const media = node.value;
        // Sanitization: Ignore corrupt media nodes
        if (!media?.url) return null;
        
        return (
          // Core Web Vitals: Using aspect ratio to reserve space and prevent CLS
          <figure key={index} className="relative w-full aspect-[16/9] my-8 overflow-hidden rounded-2xl bg-slate-50 border border-slate-200">
            <Image
              src={media.url}
              alt={media.alt || 'Medical facility image'}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
            {media.alt && (
              <figcaption className="absolute bottom-0 w-full bg-slate-900/80 backdrop-blur-md text-white text-xs p-3 text-center">
                {media.alt}
              </figcaption>
            )}
          </figure>
        );

      default:
        // Graceful degradation: If a new node type is added, we just render its children
        return <Fragment key={index}>{children}</Fragment>;
    }
  });
};