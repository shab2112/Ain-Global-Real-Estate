import React, { useState } from 'react';
import { User, ChatMode } from '../types';
import ChatHistorySidebar from './ChatHistorySidebar';
import ChatWindow from './ChatWindow';
import useChat from '../hooks/useChat';

const ClientAIView: React.FC<{ currentUser: User }> = ({ currentUser }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { 
        sessions, 
        activeSession, 
        activeSessionId,
        isLoading,
        error, 
        handleNewSession,
        handleSendMessage,
        setActiveSessionId 
    } = useChat(currentUser, ChatMode.Client);

    const renderContent = () => {
        if (!activeSession) {
            return (
                <div className="flex-1 flex items-center justify-center text-brand-light">
                    Select a conversation or start a new one to ask the AI Assistant.
                </div>
            );
        }
        return (
            <ChatWindow 
                session={activeSession}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                error={error}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
        );
    }
    
    return (
        <div className="flex h-full overflow-hidden bg-brand-secondary rounded-xl shadow-lg">
            <ChatHistorySidebar 
                sessions={sessions}
                activeSessionId={activeSessionId}
                onNewSession={handleNewSession}
                onSelectSession={setActiveSessionId}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            {renderContent()}
        </div>
    );
};

export default ClientAIView;
