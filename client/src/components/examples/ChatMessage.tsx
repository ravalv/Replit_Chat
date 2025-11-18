import { useState } from 'react';
import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  return (
    <div className="space-y-6 p-6">
      <ChatMessage
        role="user"
        content="Have there been any settlement fails or unmatched trades today?"
        timestamp={new Date()}
      />
      <ChatMessage
        role="assistant"
        content="Based on today's data, there are 3 settlement fails totaling $2.4M. Here's the breakdown by counterparty and reason code."
        timestamp={new Date()}
        hasTable={true}
        hasChart={false}
        feedback={feedback}
        onFeedback={setFeedback}
      />
    </div>
  );
}
