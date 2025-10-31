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

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2 pl-4">{currentList}</ul>);
      currentList = [];
    }
  };

  const flushTable = () => {
    if (tableHeaders.length > 0) {
      elements.push(
        <div key={`table-wrapper-${elements.length}`} className="overflow-x-auto my-4 border border-brand-accent rounded-lg">
          <table key={`table-${elements.length}`} className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-accent/30">
                {tableHeaders.map((header, i) => (
                  <th key={i} className="p-3 text-sm font-semibold text-brand-text">{renderLine(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={i} className="border-t border-brand-accent hover:bg-brand-accent/20 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="p-3 text-sm text-brand-light">{renderLine(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    inTable = false;
    tableHeaders = [];
    tableRows = [];
  };

  lines.forEach((line, i) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      flushList(); // Make sure we're not in a list
      const cells = trimmedLine.split('|').slice(1, -1).map(cell => cell.trim());

      if (!inTable) { // This is the header row
        inTable = true;
        tableHeaders = cells;
      } else if (cells.every(cell => /^-+$/.test(cell.replace(/ /g, '')))) { // This is the separator line, ignore it
        return;
      } else { // This is a data row
        tableRows.push(cells);
      }
    } else {
      if (inTable) { // The table has ended
        flushTable();
      }

      if (line.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={i} className="text-xl font-bold text-brand-text mt-6 mb-2 border-b border-brand-accent pb-1">{renderLine(line.substring(3))}</h2>);
      } else if (line.startsWith('# ')) {
        flushList();
        elements.push(<h1 key={i} className="text-2xl font-bold text-brand-gold mt-4 mb-3">{renderLine(line.substring(2))}</h1>);
      } else if (trimmedLine.startsWith('- ')) {
        currentList.push(<li key={i}>{renderLine(trimmedLine.substring(2))}</li>);
      } else if (trimmedLine === '') {
        flushList();
        if (elements.length > 0 && !(elements[elements.length - 1] as React.ReactElement).key?.toString().includes('spacer')) {
          elements.push(<div key={`spacer-${i}`} className="h-2"></div>);
        }
      } else {
        flushList();
        elements.push(<p key={i} className="my-2">{renderLine(line)}</p>);
      }
    }
  });

  flushTable(); // Flush any remaining table at the end
  flushList(); // Flush any remaining list items at the end

  return <div className="text-brand-text max-w-none">{elements}</div>;
};

export default MarkdownRenderer;