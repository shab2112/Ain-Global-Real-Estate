import React, { useState, useCallback, useEffect } from 'react';
import { User, ChatSession, ChatMessage } from '../types';
// FIX: The geminiService file is no longer empty, so this import will work.
import { generateClientChatResponse } from '../services/geminiService';
import ChatHistorySidebar from './ChatHistorySidebar';
import ChatWindow from './ChatWindow';
import { SparklesIcon } from './icons/SparklesIcon';

interface ClientDashboardProps {
  currentUser: User;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ currentUser }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  // Start a new session when component mounts if none exist
  useEffect(() => {
    if (sessions.length === 0) {
      handleNewSession();
    }
  }, []);

  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: 'New Conversation',
      messages: [
        {
            role: 'model',
            content: `Hello ${currentUser.name}, how can I assist you with your real estate needs today?`
        }
      ],
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleSendMessage = useCallback(async (message: string) => {
    if (!activeSessionId) return;

    const userMessage: ChatMessage = { role: 'user', content: message };
    
    // Immediately update the UI with the user's message
    const currentSession = sessions.find(s => s.id === activeSessionId);
    if (!currentSession) return;
    const historyWithUserMessage = [...currentSession.messages, userMessage];
    
    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? { ...s, messages: historyWithUserMessage }
          : s
      )
    );

    setIsLoading(true);
    setError(null);
    let isWaitingForLocation = false;

    try {
        const aiResponse = await generateClientChatResponse(historyWithUserMessage);

        // Handle the special action for geolocation
        if (aiResponse.action === 'request_location') {
            // Add the AI's question to the chat history
            setSessions(prev =>
                prev.map(s =>
                    s.id === activeSessionId
                        ? { ...s, messages: [...historyWithUserMessage, aiResponse] }
                        : s
                )
            );
            
            isWaitingForLocation = true;
            setIsLoading(false); // The app is now waiting for user permission, not the AI

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // On success, create a follow-up message with coordinates to continue the conversation
                    const locationMessage = `(System Info: User location is Lat ${position.coords.latitude}, Lon ${position.coords.longitude}). Based on my location, please continue. Also, please ask if this location is significant for the search if I haven't specified another location.`;
                    handleSendMessage(locationMessage);
                },
                (error) => {
                    // On failure, inform the AI so it can ask for a location manually
                    const errorMessage = "(System Info: User denied location access). Please ask for a specific location name to proceed.";
                    handleSendMessage(errorMessage);
                }
            );
            return; // Stop execution for this turn; the conversation continues in the callbacks.
        }

        // For normal AI responses, update the session with the new message
        setSessions(prev =>
            prev.map(s => {
                if (s.id === activeSessionId) {
                    const newMessages = [...historyWithUserMessage, aiResponse];
                    const newTitle = s.messages.length <= 1 ? message.substring(0, 40) + '...' : s.title;
                    return {
                        ...s,
                        title: newTitle,
                        messages: newMessages,
                    };
                }
                return s;
            })
        );

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      const errorMessage: ChatMessage = {
        role: 'model',
        content: err instanceof Error ? err.message : 'An unknown error occurred.',
      };
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId
            ? { ...s, messages: [...historyWithUserMessage, errorMessage] }
            : s
        )
      );
    } finally {
      if (!isWaitingForLocation) {
        setIsLoading(false);
      }
    }
  }, [activeSessionId, sessions]);
  
  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="h-screen w-screen bg-brand-primary text-brand-text flex overflow-hidden">
      <ChatHistorySidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewSession={handleNewSession}
        onSelectSession={setActiveSessionId}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main className="flex-1 flex flex-col h-full">
        {activeSession ? (
          <ChatWindow
            session={activeSession}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            error={error}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
             <SparklesIcon className="w-16 h-16 text-brand-gold mb-4" />
             <h2 className="text-2xl font-bold">Welcome, {currentUser.name}</h2>
             <p className="text-brand-light">Start a new conversation to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;