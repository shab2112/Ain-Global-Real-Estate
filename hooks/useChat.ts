
import { useState, useCallback, useEffect } from 'react';
import { ChatSession, ChatMessage, User, ChatMode, UserRole } from '../types';
// FIX: The geminiService file is no longer empty, so this import will work.
import { generateClientChatResponse, generateStaffChatResponse } from '../services/geminiService';

const CHAT_SESSIONS_STORAGE_KEY = 'lucra-chat-sessions';

const useChat = (currentUser: User, mode: ChatMode) => {
    const [sessions, setSessions] = useState<{ [key in ChatMode]: ChatSession[] }>(() => {
        try {
            const storedSessions = localStorage.getItem(CHAT_SESSIONS_STORAGE_KEY);
            if (storedSessions) {
                return JSON.parse(storedSessions);
            }
        } catch (error) {
            console.error("Could not load chat sessions from localStorage", error);
        }
        return { [ChatMode.Staff]: [], [ChatMode.Client]: [] };
    });

    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentSessions = sessions[mode];
    const currentSetActiveSessions = (newSessions: ChatSession[] | ((prev: ChatSession[]) => ChatSession[])) => {
        setSessions(prev => ({
            ...prev,
            [mode]: typeof newSessions === 'function' ? newSessions(prev[mode]) : newSessions
        }));
    };

    // Save sessions to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(CHAT_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
        } catch (error) {
            console.error("Could not save chat sessions to localStorage", error);
        }
    }, [sessions]);


    // Start a new session when mode changes if none exist for that mode
    useEffect(() => {
        if (currentSessions.length === 0) {
            handleNewSession();
        } else if (!currentSessions.find(s => s.id === activeSessionId)) {
            // If the active session is not in the current mode's list, switch to the first one
            setActiveSessionId(currentSessions[0]?.id || null);
        }
    }, [mode, currentUser]);

    const handleNewSession = () => {
        const isClientMode = mode === ChatMode.Client;
        const welcomeMessage = isClientMode
            ? `Hello ${currentUser.name}, how can I assist you with your real estate needs today?`
            : `Hello ${currentUser.name}. I am Pro AI, your internal assistant. How can I help you? You can ask about campaign metrics, content schedules, and more.`;

        const newSession: ChatSession = {
            id: `session_${Date.now()}`,
            title: 'New Conversation',
            messages: [{ role: 'model', content: welcomeMessage }],
        };
        currentSetActiveSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
    };

    const handleSendMessage = useCallback(async (message: string) => {
        if (!activeSessionId) return;

        const userMessage: ChatMessage = { role: 'user', content: message };
        const currentSession = currentSessions.find(s => s.id === activeSessionId);
        if (!currentSession) return;

        const historyWithUserMessage = [...currentSession.messages, userMessage];
        currentSetActiveSessions(prev =>
            prev.map(s =>
                s.id === activeSessionId ? { ...s, messages: historyWithUserMessage } : s
            )
        );

        setIsLoading(true);
        setError(null);
        let isWaitingForLocation = false;

        try {
            const generateFunction = mode === ChatMode.Client ? generateClientChatResponse : generateStaffChatResponse;
            const aiResponse = await generateFunction(historyWithUserMessage);

            if (mode === ChatMode.Client && aiResponse.action === 'request_location') {
                currentSetActiveSessions(prev =>
                    prev.map(s => s.id === activeSessionId ? { ...s, messages: [...historyWithUserMessage, aiResponse] } : s)
                );
                setIsLoading(false);
                isWaitingForLocation = true;
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const locationMessage = `(System Info: User location is Lat ${position.coords.latitude}, Lon ${position.coords.longitude}). Based on my location, please continue. Also, please ask if this location is significant for the search if I haven't specified another location.`;
                        handleSendMessage(locationMessage);
                    },
                    (error) => {
                        const errorMessage = "(System Info: User denied location access). Please ask for a specific location name to proceed.";
                        handleSendMessage(errorMessage);
                    }
                );
                return;
            }

            currentSetActiveSessions(prev =>
                prev.map(s => {
                    if (s.id === activeSessionId) {
                        const newMessages = [...historyWithUserMessage, aiResponse];
                        const newTitle = s.messages.length <= 1 ? message.substring(0, 40) + '...' : s.title;
                        return { ...s, title: newTitle, messages: newMessages };
                    }
                    return s;
                })
            );

        } catch (err) {
            const errorMessageContent = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessageContent);
            const errorMessage: ChatMessage = { role: 'model', content: errorMessageContent };
            currentSetActiveSessions(prev =>
                prev.map(s => s.id === activeSessionId ? { ...s, messages: [...historyWithUserMessage, errorMessage] } : s)
            );
        } finally {
            if (!isWaitingForLocation) {
                setIsLoading(false);
            }
        }
    }, [activeSessionId, currentSessions, mode]);

    const activeSession = currentSessions.find(s => s.id === activeSessionId);

    return {
        sessions: currentSessions,
        activeSessionId,
        activeSession,
        isLoading,
        error,
        handleNewSession,
        handleSendMessage,
        setActiveSessionId,
    };
};

export default useChat;