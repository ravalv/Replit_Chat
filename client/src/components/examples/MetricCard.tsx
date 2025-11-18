import { TrendingUp } from 'lucide-react';
import MetricCard from '../MetricCard';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
      <MetricCard
        label="Total Settlements"
        value="1,247"
        change="+12.5% from last month"
        changeType="positive"
        icon={TrendingUp}
      />
      <MetricCard
        label="Failed Trades"
        value="3"
        change="-40% from yesterday"
        changeType="positive"
      />
      <MetricCard
        label="Portfolio Value"
        value="$2.4B"
        change="+2.3% today"
        changeType="positive"
      />
      <MetricCard
        label="Compliance Issues"
        value="12"
        change="+3 from last week"
        changeType="negative"
      />
    </div>
  );
}
