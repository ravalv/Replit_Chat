import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import TopNavigation from "@/components/TopNavigation";
import ConversationHistory from "@/components/ConversationHistory";
import ChatArea from "@/components/ChatArea";
import QuerySuggestionsPanel from "@/components/QuerySuggestionsPanel";
import SessionTimeoutWarning from "@/components/SessionTimeoutWarning";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type { Conversation, Message, MessageData } from "@shared/schema";

interface ChatPageProps {
  username: string;
  role: string;
  onLogout: () => void;
}

export default function ChatPage({ username, role, onLogout }: ChatPageProps) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const { toast } = useToast();

  // Fetch conversations
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    queryFn: () => api.getConversations(),
  });

  // Fetch messages for active conversation
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/conversations", activeConversationId, "messages"],
    queryFn: () => api.getMessages(activeConversationId!),
    enabled: !!activeConversationId,
  });

  // Session monitoring
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await api.getSession();
        setSessionTimeRemaining(Math.floor(session.sessionTimeRemaining / 1000));
        setShowSessionWarning(session.showWarning);
      } catch (error) {
        // Session expired
        onLogout();
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [onLogout]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (activeConversationId) {
        return api.sendMessage(activeConversationId, content);
      } else {
        return api.chat(content);
      }
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: (data: any) => {
      if ("conversation" in data) {
        // New conversation created
        setActiveConversationId(data.conversation.id);
        queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      }
      queryClient.invalidateQueries({
        queryKey: ["/api/conversations", activeConversationId || data.conversation?.id, "messages"],
      });
      setIsTyping(false);
    },
    onError: (error: any) => {
      setIsTyping(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update conversation mutation
  const updateConversationMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      api.updateConversation(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: (id: string) => api.deleteConversation(id),
    onSuccess: () => {
      if (activeConversationId === deleteConversationMutation.variables) {
        setActiveConversationId(null);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });

  // Update message feedback mutation
  const updateFeedbackMutation = useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: "up" | "down" | null }) =>
      api.updateMessageFeedback(id, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/conversations", activeConversationId, "messages"],
      });
    },
  });

  const handleSendMessage = (message: string) => {
    sendMessageMutation.mutate(message);
  };

  const handleFeedback = (messageId: string, feedback: "up" | "down") => {
    updateFeedbackMutation.mutate({ id: messageId, feedback });
  };

  const handleSelectQuery = (query: string) => {
    handleSendMessage(query);
    setIsSuggestionsOpen(false);
  };

  const handleExtendSession = async () => {
    try {
      const result = await api.extendSession();
      setSessionTimeRemaining(Math.floor(result.sessionTimeRemaining / 1000));
      setShowSessionWarning(false);
      toast({
        title: "Session extended",
        description: "Your session has been extended",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
  };

  const handleToggleBookmark = (id: string) => {
    const conversation = conversations.find((c) => c.id === id);
    if (conversation) {
      updateConversationMutation.mutate({
        id,
        updates: { isBookmarked: !conversation.isBookmarked },
      });
    }
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversationMutation.mutate(id);
  };

  const conversationList = conversations.map((c) => ({
    id: c.id,
    title: c.title,
    timestamp: new Date(c.updatedAt),
    category: c.category,
    isBookmarked: c.isBookmarked,
  }));

  const messageList = messages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    content: m.content,
    timestamp: new Date(m.createdAt),
    hasTable: m.hasTable || false,
    hasChart: m.hasChart || false,
    data: m.data as MessageData | undefined,
    feedback: m.feedback as "up" | "down" | null,
  }));

  return (
    <div className="flex h-screen flex-col">
      <TopNavigation username={username} role={role} onLogout={onLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 border-r">
          <ConversationHistory
            conversations={conversationList}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onDeleteConversation={handleDeleteConversation}
            onToggleBookmark={handleToggleBookmark}
            onNewConversation={handleNewConversation}
          />
        </div>

        <div className="flex-1">
          <ChatArea
            messages={messageList}
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
