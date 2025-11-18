import { useState } from 'react';
import ConversationHistory from '../ConversationHistory';

export default function ConversationHistoryExample() {
  const [conversations, setConversations] = useState([
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
  ]);
  const [activeId, setActiveId] = useState('1');

  return (
    <div className="h-screen">
      <ConversationHistory
        conversations={conversations}
        activeConversationId={activeId}
        onSelectConversation={setActiveId}
        onDeleteConversation={(id) => {
          console.log('Delete:', id);
          setConversations(conversations.filter(c => c.id !== id));
        }}
        onToggleBookmark={(id) => {
          console.log('Toggle bookmark:', id);
          setConversations(conversations.map(c =>
            c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c
          ));
        }}
        onNewConversation={() => console.log('New conversation')}
      />
    </div>
  );
}
