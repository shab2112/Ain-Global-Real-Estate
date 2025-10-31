import React from 'react';
import { ChatSession } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewSession: () => void;
  onSelectSession: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  sessions,
  activeSessionId,
  onNewSession,
  onSelectSession,
  isOpen,
  setIsOpen
}) => {
  return (
    <aside className={`bg-brand-secondary flex-shrink-0 flex flex-col transition-all duration-300 ${isOpen ? 'w-72' : 'w-0'}`}>
        <div className={`p-4 border-b border-brand-accent flex-shrink-0 flex justify-between items-center overflow-hidden ${!isOpen && 'hidden'}`}>
            <div className="flex items-center gap-3">
                <SparklesIcon className="w-7 h-7 text-brand-gold" />
                <h1 className="text-lg font-bold tracking-wider">
                    Client AI
                </h1>
            </div>
            
        </div>
        <div className={`p-2 overflow-hidden ${!isOpen && 'hidden'}`}>
            <button
                onClick={onNewSession}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-brand-text bg-brand-primary hover:bg-brand-accent transition-colors"
            >
                <PlusIcon className="w-5 h-5"/>
                New Conversation
            </button>
        </div>
      
        <nav className={`flex-1 overflow-y-auto p-2 space-y-1 overflow-hidden ${!isOpen && 'hidden'}`}>
            {sessions.map(session => (
            <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left p-3 rounded-lg truncate text-sm transition-colors ${
                activeSessionId === session.id
                    ? 'bg-brand-accent font-semibold'
                    : 'text-brand-light hover:bg-brand-primary/50'
                }`}
            >
                {session.title}
            </button>
            ))}
        </nav>
    </aside>
  );
};

export default ChatHistorySidebar;
