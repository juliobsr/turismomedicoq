import React from 'react';
import { serializeLexical } from '@/utils/serializeLexical';

interface LexicalRendererProps {
  // Accepts the raw Lexical AST object from Payload's richText field
  data: Record<string, any> | null | undefined;
  className?: string;
}

/**
 * Enterprise Component: LexicalRenderer
 * 
 * Architecture: Completely decoupled from Payload's Admin UI packages.
 * Guarantees zero Context Leaks and 100% Server-Side Rendering compatibility.
 * 
 * @author Vzsoluciones Engineering Team
 */
export const LexicalRenderer = ({ data, className = '' }: LexicalRendererProps) => {
  // Defensive Programming: Validate the AST structure before attempting to map it
  if (!data?.root?.children || !Array.isArray(data.root.children)) {
    return null;
  }

  return (
    <div 
      className={`
        prose prose-slate max-w-none 
        prose-headings:font-bold prose-headings:text-slate-900 
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-2xl prose-img:shadow-md
        ${className}
      `}
    >
      {/* Feed the validated root children array into our custom engine */}
      {serializeLexical(data.root.children)}
    </div>
  );
};