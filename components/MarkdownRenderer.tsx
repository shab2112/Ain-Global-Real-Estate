import React from 'react';

// A simple regex to find **bold** text
const boldRegex = /\*\*(.*?)\*\*/g;

const renderLine = (line: string) => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Using string.replace with a callback is a neat way to iterate over matches
  line.replace(boldRegex, (match, p1, offset) => {
    // Add text before the match
    if (offset > lastIndex) {
      parts.push(line.substring(lastIndex, offset));
    }
    // Add the bolded part, wrapped in a <strong> tag for semantic correctness
    parts.push(<strong key={offset}>{p1}</strong>);
    lastIndex = offset + match.length;
    return match; // return value is not used here
  });

  // Add any remaining text after the last match
  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex));
  }

  // Wrap parts in fragments for unique keys
  return <>{parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>)}</>;
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2 pl-4">{currentList}</ul>);
      currentList = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={i} className="text-xl font-bold text-brand-text mt-6 mb-2 border-b border-brand-accent pb-1">{renderLine(line.substring(3))}</h2>);
    } else if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={i} className="text-2xl font-bold text-brand-gold mt-4 mb-3">{renderLine(line.substring(2))}</h1>);
    } else if (line.trim().startsWith('- ')) {
      currentList.push(<li key={i}>{renderLine(line.trim().substring(2))}</li>);
    } else if (line.trim() === '') {
      flushList();
      // Add a spacer for empty lines for better paragraph separation, but only if it's not redundant
      if (elements.length > 0 && !(elements[elements.length - 1] as React.ReactElement).key?.toString().includes('spacer')) {
        elements.push(<div key={`spacer-${i}`} className="h-2"></div>);
      }
    } else {
      flushList();
      elements.push(<p key={i} className="my-2">{renderLine(line)}</p>);
    }
  });

  flushList(); // Flush any remaining list items at the end

  // The 'prose' class and 'max-w-none' are utilities that can help style rendered markdown nicely.
  // Although not from a library like Tailwind Typography, they are good conventions.
  return <div className="text-brand-text max-w-none">{elements}</div>;
};

export default MarkdownRenderer;
