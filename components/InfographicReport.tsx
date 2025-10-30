import React from 'react';

// A simple regex to find **bold** text for stats
const statRegex = /-\s+\*\*(.*?):\*\*(.*)/;
const boldRegex = /\*\*(.*?)\*\*/g;

const renderText = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
  
    text.replace(boldRegex, (match, p1, offset) => {
      if (offset > lastIndex) {
        parts.push(text.substring(lastIndex, offset));
      }
      parts.push(<strong key={offset}>{p1}</strong>);
      lastIndex = offset + match.length;
      return match;
    });
  
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
  
    return <>{parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>)}</>;
};

const InfographicReport: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const elements: React.ReactNode[] = [];
  
    lines.forEach((line, i) => {
      const statMatch = line.match(statRegex);

      if (line.startsWith('### ')) {
        const headerText = line.substring(4);
        const emojiMatch = headerText.match(/(\s[📈📉➡️])$/);
        const cityName = emojiMatch ? headerText.replace(emojiMatch[0], '') : headerText;
        const emoji = emojiMatch ? emojiMatch[1] : null;

        elements.push(
            <div key={i} className="bg-brand-primary/50 p-4 rounded-lg border border-brand-accent mt-4">
                <div className="flex items-center gap-3">
                    {emoji && <span className="text-2xl">{emoji}</span>}
                    <h3 className="text-lg font-bold text-brand-text">{cityName}</h3>
                </div>
            </div>
        );
      } else if (statMatch) {
          const [, key, value] = statMatch;
          elements.push(
              <div key={i} className="bg-brand-primary/20 p-3 rounded-md my-2">
                  <div className="flex justify-between items-center text-sm">
                      <span className="text-brand-light">{key.trim()}</span>
                      <span className="font-bold text-brand-text text-right">{value.trim()}</span>
                  </div>
              </div>
          );
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-xl font-bold text-brand-text mt-6 mb-2 border-b border-brand-accent pb-1">{renderText(line.substring(3))}</h2>);
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-2xl font-bold text-brand-gold mt-4 mb-3">{renderText(line.substring(2))}</h1>);
      } else if (line.startsWith('- ')) {
        // This handles general list items that are not stats
        elements.push(<p key={i} className="text-sm my-1 pl-4">{renderText(line.substring(2))}</p>);
      }
      else {
        // Regular paragraph text
        elements.push(<p key={i} className="my-2 text-brand-light text-sm">{renderText(line)}</p>);
      }
    });
  
    return <div className="text-brand-text max-w-none">{elements}</div>;
  };
  
  export default InfographicReport;
  