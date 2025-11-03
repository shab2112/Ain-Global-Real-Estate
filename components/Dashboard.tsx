
import React, { useState } from 'react';
import { User, UserRole, ChatMode } from '../types';
import useChat from '../hooks/useChat';
import ChatHistorySidebar from './ChatHistorySidebar';
import ChatWindow from './ChatWindow';
import { HomeIcon } from './icons/HomeIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface DashboardProps {
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const isStaff = currentUser.role !== UserRole.Client;
  const [mode, setMode] = useState<ChatMode>(isStaff ? ChatMode.Staff : ChatMode.Client);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const {
    sessions,
    activeSessionId,
    activeSession,
    isLoading,
    error,
    handleNewSession,
    handleSendMessage,
    setActiveSessionId,
  } = useChat(currentUser, mode);

  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center gap-3 mb-4">
        <HomeIcon className="w-8 h-8 text-brand-gold" />
        <h2 className="text-2xl font-bold text-brand-text">AI Assistant Dashboard</h2>
      </div>
      <div className="flex-1 bg-brand-secondary rounded-xl shadow-lg flex overflow-hidden">
        <ChatHistorySidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewSession={handleNewSession}
          onSelectSession={setActiveSessionId}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <main className="flex-1 flex flex-col h-full">
            {isStaff && (
                <div className="p-2 border-b border-brand-accent flex-shrink-0">
                    <div className="flex items-center gap-2 bg-brand-primary p-1 rounded-lg w-fit mx-auto">
                        <button
                            onClick={() => setMode(ChatMode.Staff)}
                            className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${
                                mode === ChatMode.Staff ? 'bg-brand-gold text-brand-primary' : 'text-brand-light hover:text-brand-text'
                            }`}
                        >
                            Staff Assistant
                        </button>
                        <button
                            onClick={() => setMode(ChatMode.Client)}
                            className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${
                                mode === ChatMode.Client ? 'bg-brand-gold text-brand-primary' : 'text-brand-light hover:text-brand-text'
                            }`}
                        >
                            Client Simulation
                        </button>
                    </div>
                </div>
            )}
            {activeSession ? (
                <ChatWindow
                    key={activeSession.id} // Add key to force re-mount on session change
                    session={activeSession}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    error={error}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <SparklesIcon className="w-16 h-16 text-brand-gold mb-4" />
                    <h2 className="text-2xl font-bold">Welcome, {currentUser.name}</h2>
                    <p className="text-brand-light">
                        {sessions.length > 0 ? 'Select a conversation or start a new one.' : 'Start a new conversation to get started.'}
                    </p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
