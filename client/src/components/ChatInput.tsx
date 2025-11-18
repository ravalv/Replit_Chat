import { useState } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-card p-4">
      <div className="relative flex items-end gap-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            data-testid="button-attach"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            data-testid="button-voice"
          >
            <Mic className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about trades, settlements, portfolio analytics..."
            className="min-h-12 max-h-32 resize-none pr-12"
            disabled={disabled}
            data-testid="textarea-chat-input"
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {message.length}/1000
          </div>
        </div>

        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled}
          className="flex-shrink-0"
          data-testid="button-send"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
}
