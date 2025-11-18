import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import DateFilters from "./DateFilters";
import { PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  hasTable?: boolean;
  hasChart?: boolean;
  feedback?: "up" | "down" | null;
}

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  onFeedback: (messageId: string, feedback: "up" | "down") => void;
  onToggleSuggestions: () => void;
  isSuggestionsOpen: boolean;
}

export default function ChatArea({
  messages,
  isTyping,
  onSendMessage,
  onFeedback,
  onToggleSuggestions,
  isSuggestionsOpen,
}: ChatAreaProps) {
  const [dateFilter, setDateFilter] = useState("today");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <DateFilters activeFilter={dateFilter} onFilterChange={setDateFilter} />
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSuggestions}
          data-testid="button-toggle-suggestions"
        >
          <PanelRightOpen className={`h-5 w-5 ${isSuggestionsOpen ? "rotate-180" : ""}`} />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              hasTable={message.hasTable}
              hasChart={message.hasChart}
              feedback={message.feedback}
              onFeedback={
                message.role === "assistant"
                  ? (feedback) => onFeedback(message.id, feedback)
                  : undefined
              }
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </ScrollArea>

      <ChatInput onSendMessage={onSendMessage} disabled={isTyping} />
    </div>
  );
}
