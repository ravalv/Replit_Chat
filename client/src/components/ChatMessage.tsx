import { ThumbsUp, ThumbsDown, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageDataTable } from "./MessageDataTable";
import { MessageDataChart } from "./MessageDataChart";

interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

interface ChartData {
  type: "bar" | "line" | "pie";
  data: {
    name: string;
    value: number;
  }[];
}

interface MessageData {
  table?: TableData;
  chart?: ChartData;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  hasTable?: boolean;
  hasChart?: boolean;
  data?: MessageData;
  feedback?: "up" | "down" | null;
  onFeedback?: (feedback: "up" | "down") => void;
}

export default function ChatMessage({
  role,
  content,
  timestamp,
  hasTable,
  hasChart,
  data,
  feedback,
  onFeedback,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
        </Avatar>
      )}

      <div className={`flex max-w-3xl flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl p-4 ${
            isUser ? "bg-primary text-primary-foreground" : "bg-card"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        {!isUser && data && (
          <div className="w-full max-w-3xl">
            {data.table && (
              <MessageDataTable
                headers={data.table.headers}
                rows={data.table.rows}
              />
            )}
            {data.chart && (
              <MessageDataChart
                type={data.chart.type}
                data={data.chart.data}
              />
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {!isUser && onFeedback && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onFeedback("up")}
                data-testid="button-feedback-up"
              >
                <ThumbsUp className={`h-3 w-3 ${feedback === "up" ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onFeedback("down")}
                data-testid="button-feedback-down"
              >
                <ThumbsDown className={`h-3 w-3 ${feedback === "down" ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" data-testid="button-copy">
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" data-testid="button-download">
                <Download className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {!isUser && (
          <span className="text-xs text-muted-foreground">Query logged</span>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="text-xs">JD</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
