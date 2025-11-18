import { MessageSquare, Search, Star, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  category: string;
  isBookmarked: boolean;
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onNewConversation: () => void;
}

export default function ConversationHistory({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onToggleBookmark,
  onNewConversation,
}: ConversationHistoryProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar p-4">
      <div className="mb-4">
        <Button onClick={onNewConversation} className="w-full" data-testid="button-new-conversation">
          <MessageSquare className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            data-testid="input-search-conversations"
          />
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`group relative cursor-pointer rounded-lg p-4 hover-elevate ${
              activeConversationId === conversation.id ? "bg-sidebar-accent" : ""
            }`}
            data-testid={`conversation-${conversation.id}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">{conversation.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{conversation.category}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(conversation.timestamp, { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(conversation.id);
                  }}
                  data-testid={`button-bookmark-${conversation.id}`}
                >
                  <Star className={`h-4 w-4 ${conversation.isBookmarked ? "fill-current" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                  data-testid={`button-delete-${conversation.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
