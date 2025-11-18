import { useState } from 'react';
import QuerySuggestionsPanel from '../QuerySuggestionsPanel';

export default function QuerySuggestionsPanelExample() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="h-screen flex">
      <div className="flex-1" />
      <QuerySuggestionsPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelectQuery={(query) => console.log('Selected query:', query)}
      />
    </div>
  );
}
