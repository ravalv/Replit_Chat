import { useState } from 'react';
import DateFilters from '../DateFilters';

export default function DateFiltersExample() {
  const [active, setActive] = useState('today');

  return (
    <div className="p-6">
      <DateFilters
        activeFilter={active}
        onFilterChange={setActive}
      />
    </div>
  );
}
