import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, ChatMessage } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { ShareIcon } from './icons/ShareIcon';
import { SendIcon } from './icons/SendIcon';
import { MenuIcon } from './icons/MenuIcon';

interface ChatWindowProps {
  session: ChatSession;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error: string | null;
  toggleSidebar: () => void;
}

const ChatMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isModel = message.role === 'model';
    return (
        <div className={`flex gap-4 my-4 ${isModel ? 'justify-start' : 'justify-end'}`}>
            <div className={`w-fit max-w-2xl p-4 rounded-2xl ${isModel ? 'bg-brand-secondary rounded-tl-none' : 'bg-brand-gold text-brand-primary rounded-br-none'}`}>
                <MarkdownRenderer content={message.content} />
                {message.sources && message.sources.length > 0 && (
                     <div className="mt-4 pt-2 border-t border-brand-accent/30">
                        <h4 className="text-xs font-bold text-brand-light mb-1">Sources:</h4>
                        <ul className="list-decimal list-inside space-y-1 text-xs">
                            {message.sources.map((source, index) => (
                                source.web && (
                                    <li key={index}>
                                        <a 
                                            href={source.web.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={`${isModel ? 'text-brand-gold/80 hover:text-brand-gold' : 'text-blue-800 hover:text-blue-600'} underline transition break-all`}
                                        >
                                            {source.web.title || source.web.uri}
                                        </a>
                                    </li>
                                )
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};


const ChatWindow: React.FC<ChatWindowProps> = ({ session, onSendMessage, isLoading, error, toggleSidebar }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages, isLoading]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  const handleShare = () => {
    // In a real app, this would generate a unique URL to this conversation
    navigator.clipboard.writeText(`Shared conversation: ${session.title}\n(URL functionality not implemented)`);
    alert("Conversation details copied to clipboard (simulation).");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-brand-primary">
      <header className="p-4 border-b border-brand-accent flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-brand-secondary">
                <MenuIcon className="w-6 h-6 text-brand-light"/>
            </button>
            <h2 className="font-bold text-lg text-brand-text truncate">{session.title}</h2>
        </div>
        <button 
            onClick={handleShare}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-brand-secondary text-brand-light hover:text-brand-text transition-colors"
            aria-label="Share Conversation"
        >
          <ShareIcon className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6">
        {session.messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
            <div className="flex gap-4 my-4 justify-start">
                <div className="w-fit max-w-2xl p-4 rounded-2xl bg-brand-secondary rounded-tl-none">
                   <div className="flex items-center gap-2 text-brand-light">
                        <div className="w-3 h-3 bg-brand-gold rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-brand-gold rounded-full animate-pulse delay-75"></div>
                        <div className="w-3 h-3 bg-brand-gold rounded-full animate-pulse delay-150"></div>
                   </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 flex-shrink-0">
        <div className="bg-brand-secondary rounded-xl p-2 flex items-center gap-2 border border-brand-accent focus-within:border-brand-gold transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about Dubai real estate..."
            className="w-full bg-transparent p-2 focus:outline-none resize-none text-brand-text"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-brand-gold text-brand-primary p-2 rounded-lg hover:bg-yellow-400 disabled:bg-brand-accent disabled:cursor-not-allowed transition-colors"
            aria-label="Send Message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;