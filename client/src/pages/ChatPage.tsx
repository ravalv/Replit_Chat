import { useState, useEffect } from "react";
import TopNavigation from "@/components/TopNavigation";
import ConversationHistory from "@/components/ConversationHistory";
import ChatArea from "@/components/ChatArea";
import QuerySuggestionsPanel from "@/components/QuerySuggestionsPanel";
import SessionTimeoutWarning from "@/components/SessionTimeoutWarning";

interface ChatPageProps {
  username: string;
  role: string;
  onLogout: () => void;
}

// todo: remove mock functionality
const mockConversations = [
  {
    id: '1',
    title: 'Settlement fails analysis',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'Settlement & Trade Operations',
    isBookmarked: true,
  },
  {
    id: '2',
    title: 'Portfolio holdings breakdown',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    category: 'Portfolio Analytics',
    isBookmarked: false,
  },
  {
    id: '3',
    title: 'Compliance exceptions trend',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    category: 'Compliance & Risk',
    isBookmarked: false,
  },
];

const mockMessages = [
  {
    id: '1',
    role: 'user' as const,
    content: 'Have there been any settlement fails or unmatched trades today?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '2',
    role: 'assistant' as const,
    content: 'Based on today\'s data, there are 3 settlement fails totaling $2.4M across different counterparties. The main reasons include:\n\n1. Insufficient securities (2 trades)\n2. Missing settlement instructions (1 trade)\n\nWould you like me to provide a detailed breakdown?',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    hasTable: true,
    feedback: null,
  },
];

export default function ChatPage({ username, role, onLogout }: ChatPageProps) {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [messages, setMessages] = useState(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(300); // 5 minutes for demo

  // Session timeout simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimeRemaining((prev) => {
        if (prev <= 1) {
          setShowSessionWarning(false);
          onLogout();
          return 0;
        }
        if (prev === 300) { // Show warning at 5 minutes (25 minutes in real app)
          setShowSessionWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onLogout]);

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: String(messages.length + 1),
      role: 'user' as const,
      content: message,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: String(messages.length + 2),
        role: 'assistant' as const,
        content: 'I\'ve analyzed your query. Here are the insights based on the latest financial data...',
        timestamp: new Date(),
        hasTable: Math.random() > 0.5,
        hasChart: Math.random() > 0.5,
        feedback: null,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleFeedback = (messageId: string, feedback: "up" | "down") => {
    setMessages(messages.map(m => m.id === messageId ? { ...m, feedback } as any : m));
  };

  const handleSelectQuery = (query: string) => {
    handleSendMessage(query);
    setIsSuggestionsOpen(false);
  };

  const handleExtendSession = () => {
    setSessionTimeRemaining(1800); // Reset to 30 minutes
    setShowSessionWarning(false);
  };

  return (
    <div className="flex h-screen flex-col">
      <TopNavigation username={username} role={role} onLogout={onLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 border-r">
          <ConversationHistory
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onDeleteConversation={(id) => setConversations(conversations.filter(c => c.id !== id))}
            onToggleBookmark={(id) => setConversations(conversations.map(c =>
              c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c
            ))}
            onNewConversation={() => {
              setActiveConversationId('');
              setMessages([]);
            }}
          />
        </div>

        <div className="flex-1">
          <ChatArea
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onFeedback={handleFeedback}
            onToggleSuggestions={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
            isSuggestionsOpen={isSuggestionsOpen}
          />
        </div>

        <QuerySuggestionsPanel
          isOpen={isSuggestionsOpen}
          onClose={() => setIsSuggestionsOpen(false)}
          onSelectQuery={handleSelectQuery}
        />
      </div>

      <SessionTimeoutWarning
        isOpen={showSessionWarning}
        remainingSeconds={sessionTimeRemaining}
        onExtendSession={handleExtendSession}
        onLogout={onLogout}
      />
    </div>
  );
}
