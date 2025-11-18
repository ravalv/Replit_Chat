import { ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuerySuggestion {
  id: string;
  text: string;
  category: string;
}

interface QuerySuggestionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

const queryCategories = [
  {
    category: "Settlement & Trade Operations",
    queries: [
      "Have there been any settlement fails or unmatched trades today?",
      "Show me all pending trades awaiting settlement confirmation",
      "What is the total value of failed settlements this month?",
    ],
  },
  {
    category: "Portfolio Analytics & Holdings",
    queries: [
      "Can I get a breakdown of my asset holdings by region, asset class, or currency?",
      "What is my current portfolio performance vs benchmark?",
      "Show top 10 holdings by market value",
    ],
  },
  {
    category: "Corporate Actions & Cash Flow",
    queries: [
      "What are the corporate actions impacting my portfolio today and its impact on cashflow?",
      "Show upcoming dividend payments for the next quarter",
      "List all recent stock splits and their impact",
    ],
  },
  {
    category: "Compliance & Risk Monitoring",
    queries: [
      "Is there a trend in pre-trade vs post-trade compliance exceptions?",
      "Show all compliance breaches in the last 30 days",
      "What are the current risk exposure levels by asset class?",
    ],
  },
  {
    category: "Fee Analysis & Revenue",
    queries: [
      "Are there recurring anomalies in expense allocations across share classes?",
      "How do fee revenues trend vs AUM growth across client portfolios?",
      "Show fee breakdown by service type for this quarter",
    ],
  },
  {
    category: "Client Behavior & Payments",
    queries: [
      "Do clients with higher AUM have proportionally higher invoice adjustments?",
      "Which clients consistently pay late and what is the average delay?",
      "Show payment patterns by client segment",
    ],
  },
  {
    category: "NAV & Fund Operations",
    queries: [
      "How do accrual adjustments trend across different fund types (equity vs fixed income)?",
      "What is the distribution of NAV strike delays by fund size and complexity?",
      "Show NAV calculation accuracy metrics for the last month",
    ],
  },
  {
    category: "Reconciliation & Data Quality",
    queries: [
      "How do stale price occurrences trend by asset class and market volatility periods?",
      "Are there clusters of funds with consistently higher reconciliation exceptions?",
      "Show data quality metrics across all data sources",
    ],
  },
];

export default function QuerySuggestionsPanel({ isOpen, onClose, onSelectQuery }: QuerySuggestionsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="flex h-full w-80 flex-col border-l bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-sm font-semibold">Query Suggestions</h2>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-suggestions">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {queryCategories.map((category, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.queries.map((query, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => onSelectQuery(query)}
                    className="group flex w-full items-start gap-2 rounded-lg p-3 text-left text-sm hover-elevate"
                    data-testid={`suggestion-${idx}-${qIdx}`}
                  >
                    <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="leading-snug">{query}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
