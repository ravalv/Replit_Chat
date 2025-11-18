import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
}

export default function MetricCard({ label, value, change, changeType = "neutral", icon: Icon }: MetricCardProps) {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-muted-foreground",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs uppercase text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold font-mono">{value}</p>
            {change && (
              <p className={`mt-1 text-sm ${changeColors[changeType]}`}>{change}</p>
            )}
          </div>
          {Icon && (
            <div className="rounded-full bg-muted p-3">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
