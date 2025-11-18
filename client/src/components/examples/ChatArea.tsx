import { useState } from 'react';
import ChatArea from '../ChatArea';

export default function ChatAreaExample() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'user' as const,
      content: 'Have there been any settlement fails or unmatched trades today?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: 'Based on today\'s data, there are 3 settlement fails totaling $2.4M. Here\'s the breakdown by counterparty and reason code.',
      timestamp: new Date(Date.now() - 4 * 60 * 1000),
      hasTable: true,
      feedback: null,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (msg: string) => {
    setMessages([...messages, {
      id: String(messages.length + 1),
      role: 'user' as const,
      content: msg,
      timestamp: new Date(),
    }]);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  return (
    <div className="h-screen">
      <ChatArea
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSend}
        onFeedback={(id, feedback) => {
          console.log('Feedback:', id, feedback);
          setMessages(messages.map(m => m.id === id ? { ...m, feedback } as any : m));
        }}
        onToggleSuggestions={() => console.log('Toggle suggestions')}
        isSuggestionsOpen={false}
      />
    </div>
  );
}
