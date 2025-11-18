import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TypingIndicator() {
  return (
    <div className="flex gap-4">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1 rounded-2xl bg-card px-4 py-3">
        <div className="h-2 w-2 animate-bounce rounded-full bg-foreground" style={{ animationDelay: "0ms" }} />
        <div className="h-2 w-2 animate-bounce rounded-full bg-foreground" style={{ animationDelay: "150ms" }} />
        <div className="h-2 w-2 animate-bounce rounded-full bg-foreground" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
