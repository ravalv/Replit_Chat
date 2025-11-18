import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface DateFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: "today", label: "Today" },
  { id: "7days", label: "Last 7 days" },
  { id: "30days", label: "Last 30 days" },
  { id: "custom", label: "Custom" },
];

export default function DateFilters({ activeFilter, onFilterChange }: DateFiltersProps) {
  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          data-testid={`filter-${filter.id}`}
        >
          {filter.id === "custom" && <Calendar className="mr-2 h-4 w-4" />}
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
