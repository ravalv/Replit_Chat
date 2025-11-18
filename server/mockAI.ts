// Mock AI response generator for financial queries

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

export interface ChartData {
  type: "bar" | "line" | "pie";
  data: {
    name: string;
    value: number;
  }[];
}

export interface MessageData {
  table?: TableData;
  chart?: ChartData;
}

interface AIResponse {
  content: string;
  hasTable: boolean;
  hasChart: boolean;
  data?: MessageData;
  availableViews?: {
    table: boolean;
    chart: boolean;
  };
}

const mockResponses: Record<string, AIResponse> = {
  settlement: {
    content: `Based on today's data, there are 3 settlement fails totaling $2.4M across different counterparties. The main reasons include:

1. Insufficient securities (2 trades - $1.6M)
2. Missing settlement instructions (1 trade - $800K)

The affected counterparties are Goldman Sachs, Morgan Stanley, and JP Morgan. All trades are flagged for immediate follow-up with T+1 settlement recovery procedures.`,
    hasTable: true,
    hasChart: false,
    data: {
      table: {
        headers: ["Trade ID", "Counterparty", "Security", "Amount", "Reason", "Status"],
        rows: [
          ["TRD-2024-1001", "Goldman Sachs", "AAPL 100 shares", "$18,450", "Insufficient securities", "Pending"],
          ["TRD-2024-1002", "Morgan Stanley", "TSLA 50 shares", "$12,350", "Insufficient securities", "In Progress"],
          ["TRD-2024-1003", "JP Morgan", "MSFT 25 shares", "$8,125", "Missing instructions", "Escalated"]
        ]
      }
    }
  },
  portfolio: {
    content: `Your current asset holdings breakdown:

**By Region:**
- North America: 45% ($1.08B)
- Europe: 30% ($720M)
- Asia Pacific: 20% ($480M)
- Emerging Markets: 5% ($120M)

**By Asset Class:**
- Equities: 60% ($1.44B)
- Fixed Income: 25% ($600M)
- Alternatives: 10% ($240M)
- Cash: 5% ($120M)

**By Currency:**
- USD: 65%
- EUR: 20%
- GBP: 10%
- Other: 5%

Total portfolio value: $2.4B with a YTD return of +8.3%.`,
    hasTable: true,
    hasChart: true,
    data: {
      table: {
        headers: ["Asset Class", "Value", "Allocation", "YTD Return", "Risk Level"],
        rows: [
          ["Equities", "$1.44B", "60%", "+12.5%", "Medium"],
          ["Fixed Income", "$600M", "25%", "+4.2%", "Low"],
          ["Alternatives", "$240M", "10%", "+6.8%", "High"],
          ["Cash", "$120M", "5%", "+2.1%", "Very Low"]
        ]
      },
      chart: {
        type: "pie",
        data: [
          { name: "Equities", value: 60 },
          { name: "Fixed Income", value: 25 },
          { name: "Alternatives", value: 10 },
          { name: "Cash", value: 5 }
        ]
      }
    }
  },
  corporate_actions: {
    content: `Today's corporate actions affecting your portfolio:

**Dividends (3 securities):**
- AAPL: $0.24/share ex-date today - Impact: +$48K cash inflow
- MSFT: $0.68/share ex-date today - Impact: +$136K cash inflow
- JNJ: $1.13/share ex-date today - Impact: +$67.8K cash inflow

**Stock Splits (1 security):**
- TSLA: 3-for-1 split effective today - No cash impact, position rebalanced

**Total estimated cash flow impact: +$251.8K**

All dividend payments will settle within T+2. Position updates have been automatically reflected in your holdings.`,
    hasTable: true,
    hasChart: false,
    data: {
      table: {
        headers: ["Security", "Action Type", "Details", "Ex-Date", "Cash Impact", "Status"],
        rows: [
          ["AAPL", "Dividend", "$0.24/share", "2024-11-18", "+$48,000", "Pending"],
          ["MSFT", "Dividend", "$0.68/share", "2024-11-18", "+$136,000", "Pending"],
          ["JNJ", "Dividend", "$1.13/share", "2024-11-18", "+$67,800", "Pending"],
          ["TSLA", "Stock Split", "3-for-1", "2024-11-18", "$0", "Completed"]
        ]
      }
    }
  },
  compliance: {
    content: `Compliance exception analysis:

**Pre-Trade Exceptions:** 8 instances (down 20% from last month)
- Concentration limits: 5
- Restricted securities: 2
- Liquidity constraints: 1

**Post-Trade Exceptions:** 12 instances (up 15% from last month)
- Trade reporting delays: 7
- Allocation errors: 3
- Price verification: 2

**Trend Analysis:**
The increase in post-trade exceptions is primarily driven by T+1 settlement migration challenges. Pre-trade controls are performing well. Recommended action: Review allocation workflow automation.`,
    hasTable: true,
    hasChart: true,
    data: {
      table: {
        headers: ["Exception Type", "Category", "Count", "Severity", "Change vs Last Month"],
        rows: [
          ["Concentration limits", "Pre-Trade", 5, "Medium", "-20%"],
          ["Restricted securities", "Pre-Trade", 2, "High", "-30%"],
          ["Liquidity constraints", "Pre-Trade", 1, "Low", "0%"],
          ["Trade reporting delays", "Post-Trade", 7, "Medium", "+40%"],
          ["Allocation errors", "Post-Trade", 3, "High", "+50%"],
          ["Price verification", "Post-Trade", 2, "Low", "-33%"]
        ]
      },
      chart: {
        type: "bar",
        data: [
          { name: "Pre-Trade", value: 8 },
          { name: "Post-Trade", value: 12 }
        ]
      }
    }
  },
  fees: {
    content: `Fee revenue and expense allocation analysis:

**Recurring Anomalies Detected:**
- Share Class A: Expense ratio variance of +0.03% vs prospectus
- Share Class C: Administrative fee allocation error ($12K impact)

**Fee Revenue vs AUM Trend:**
- Q1: 0.85% of AUM ($20.4M fees on $2.4B AUM)
- Q2: 0.83% of AUM ($19.9M fees on $2.4B AUM)
- Q3: 0.87% of AUM ($20.9M fees on $2.4B AUM)
- Q4 YTD: 0.86% of AUM

Fee compression of 2 bps year-over-year, offset by 5% AUM growth. Net revenue impact: +3.2%.`,
    hasTable: true,
    hasChart: true,
    data: {
      table: {
        headers: ["Quarter", "AUM", "Fee Revenue", "Fee Rate", "YoY Change"],
        rows: [
          ["Q1 2024", "$2.40B", "$20.4M", "0.85%", "+3.1%"],
          ["Q2 2024", "$2.40B", "$19.9M", "0.83%", "+2.8%"],
          ["Q3 2024", "$2.40B", "$20.9M", "0.87%", "+3.5%"],
          ["Q4 2024 (YTD)", "$2.42B", "$5.2M", "0.86%", "+3.2%"]
        ]
      },
      chart: {
        type: "line",
        data: [
          { name: "Q1", value: 20.4 },
          { name: "Q2", value: 19.9 },
          { name: "Q3", value: 20.9 },
          { name: "Q4 YTD", value: 5.2 }
        ]
      }
    }
  },
  client_behavior: {
    content: `Client payment behavior analysis:

**High AUM Clients ($50M+):**
- Invoice adjustments: 15% of invoices
- Average adjustment amount: $8,500
- Primary reason: Fee calculation methodology disputes

**Late Payment Analysis:**
- Consistently late payers: 12 clients (8% of client base)
- Average delay: 18 days past due date
- Total outstanding: $450K

**Top 3 Late Payers:**
1. Client XYZ Corp - Avg delay 28 days, $120K outstanding
2. Client ABC Fund - Avg delay 22 days, $95K outstanding  
3. Client DEF Partners - Avg delay 15 days, $67K outstanding

Correlation detected: Higher AUM clients have 2.3x higher adjustment rates but better payment timing (avg 5 days vs 18 days).`,
    hasTable: true,
    hasChart: true,
    data: {
      table: {
        headers: ["Client Name", "AUM", "Avg Payment Delay", "Outstanding", "Adjustment Rate"],
        rows: [
          ["XYZ Corp", "$125M", "28 days", "$120,000", "18%"],
          ["ABC Fund", "$85M", "22 days", "$95,000", "22%"],
          ["DEF Partners", "$65M", "15 days", "$67,000", "12%"],
          ["GHI Holdings", "$95M", "12 days", "$45,000", "8%"],
          ["JKL Capital", "$78M", "8 days", "$32,000", "5%"]
        ]
      },
      chart: {
        type: "bar",
        data: [
          { name: "XYZ Corp", value: 28 },
          { name: "ABC Fund", value: 22 },
          { name: "DEF Partners", value: 15 },
          { name: "GHI Holdings", value: 12 },
          { name: "JKL Capital", value: 8 }
        ]
      }
    }
  },
  nav: {
    content: `NAV and accrual adjustment trends:

**Equity Funds:**
- Average accrual adjustments: $2,400 per fund per month
- Typical variance: ±0.02% of NAV
- Primary drivers: Dividend accruals, expense estimates

**Fixed Income Funds:**
- Average accrual adjustments: $8,700 per fund per month
- Typical variance: ±0.05% of NAV
- Primary drivers: Interest accruals, amortization schedules

**NAV Strike Delays by Fund Size:**
- Small funds (<$100M): 2% experience delays, avg 15 mins
- Medium funds ($100M-$1B): 5% experience delays, avg 25 mins
- Large funds (>$1B): 8% experience delays, avg 45 mins

Complexity correlation: 0.73 between number of securities and delay probability.`,
    hasTable: true,
    hasChart: true,
    data: {
      table: {
        headers: ["Fund Type", "Fund Size", "Avg Accrual Adj", "NAV Variance", "Delay Rate", "Avg Delay"],
        rows: [
          ["Equity", "Small", "$2,400", "±0.02%", "2%", "15 mins"],
          ["Equity", "Medium", "$2,400", "±0.02%", "5%", "25 mins"],
          ["Equity", "Large", "$2,400", "±0.02%", "8%", "45 mins"],
          ["Fixed Income", "Small", "$8,700", "±0.05%", "3%", "20 mins"],
          ["Fixed Income", "Medium", "$8,700", "±0.05%", "7%", "30 mins"],
          ["Fixed Income", "Large", "$8,700", "±0.05%", "12%", "50 mins"]
        ]
      },
      chart: {
        type: "bar",
        data: [
          { name: "Small Funds", value: 2 },
          { name: "Medium Funds", value: 5 },
          { name: "Large Funds", value: 8 }
        ]
      }
    }
  },
  reconciliation: {
    content: `Reconciliation and data quality analysis:

**Stale Price Occurrences:**
- Equities: 0.3% of positions during normal volatility
- Fixed Income: 1.2% of positions during normal volatility
- Alternatives: 4.5% of positions (expected due to illiquidity)

**During High Volatility Periods (+20% VIX):**
- Stale prices increase 3.2x across all asset classes

**Fund Clusters with High Exception Rates:**
- Emerging Market Equity funds: 8.5% exception rate
- High Yield Fixed Income funds: 6.2% exception rate
- Multi-Asset funds: 5.1% exception rate

**Root Causes:**
- Vendor data delays: 45% of exceptions
- Manual pricing required: 30% of exceptions
- Market closures/holidays: 25% of exceptions`,
    hasTable: true,
    hasChart: true,
    data: {
      table: {
        headers: ["Asset Class", "Normal Stale Rate", "High Vol Stale Rate", "Primary Cause", "Resolution Time"],
        rows: [
          ["Equities", "0.3%", "0.96%", "Vendor delays", "2 hours"],
          ["Fixed Income", "1.2%", "3.84%", "Manual pricing", "4 hours"],
          ["Alternatives", "4.5%", "14.4%", "Illiquidity", "24 hours"],
          ["Emerging Markets", "2.8%", "8.96%", "Market closures", "12 hours"]
        ]
      },
      chart: {
        type: "bar",
        data: [
          { name: "Vendor delays", value: 45 },
          { name: "Manual pricing", value: 30 },
          { name: "Market closures", value: 25 }
        ]
      }
    }
  },
};

function isDrillDownRequest(query: string): { isRequest: boolean; viewType: 'table' | 'chart' | 'both' | null } {
  const queryLower = query.toLowerCase();
  
  // Check for explicit drill-down requests
  const tableKeywords = ['show as table', 'view as table', 'display table', 'show table', 'table view', 'show data table', 'view data table'];
  const chartKeywords = ['show as chart', 'view as chart', 'display chart', 'show chart', 'chart view', 'show graph', 'view graph', 'visualize'];
  const bothKeywords = ['show all data', 'show both', 'show everything', 'view all'];
  
  if (bothKeywords.some(keyword => queryLower.includes(keyword))) {
    return { isRequest: true, viewType: 'both' };
  }
  if (tableKeywords.some(keyword => queryLower.includes(keyword))) {
    return { isRequest: true, viewType: 'table' };
  }
  if (chartKeywords.some(keyword => queryLower.includes(keyword))) {
    return { isRequest: true, viewType: 'chart' };
  }
  
  return { isRequest: false, viewType: null };
}

function getResponseCategory(query: string): string | null {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes("settlement") || queryLower.includes("trade") || queryLower.includes("fail")) {
    return "settlement";
  } else if (queryLower.includes("portfolio") || queryLower.includes("holding") || queryLower.includes("asset")) {
    return "portfolio";
  } else if (queryLower.includes("corporate action") || queryLower.includes("dividend") || queryLower.includes("cash flow")) {
    return "corporate_actions";
  } else if (queryLower.includes("compliance") || queryLower.includes("risk") || queryLower.includes("exception")) {
    return "compliance";
  } else if (queryLower.includes("fee") || queryLower.includes("revenue") || queryLower.includes("expense")) {
    return "fees";
  } else if (queryLower.includes("client") || queryLower.includes("payment") || queryLower.includes("invoice")) {
    return "client_behavior";
  } else if (queryLower.includes("nav") || queryLower.includes("accrual") || queryLower.includes("fund")) {
    return "nav";
  } else if (queryLower.includes("reconcil") || queryLower.includes("stale") || queryLower.includes("data quality")) {
    return "reconciliation";
  }
  
  return null;
}

export function generateAIResponse(userQuery: string, lastCategory?: string): AIResponse {
  const drillDown = isDrillDownRequest(userQuery);
  
  // If this is a drill-down request, use the last category
  if (drillDown.isRequest && lastCategory) {
    const fullResponse = mockResponses[lastCategory];
    if (!fullResponse) {
      return {
        content: "I don't have data available for that visualization request. Please ask a specific financial query first.",
        hasTable: false,
        hasChart: false,
      };
    }
    
    // Return appropriate visualization
    if (drillDown.viewType === 'table' && fullResponse.data?.table) {
      return {
        content: "Here's the data in table format:",
        hasTable: true,
        hasChart: false,
        data: { table: fullResponse.data.table },
      };
    } else if (drillDown.viewType === 'chart' && fullResponse.data?.chart) {
      return {
        content: "Here's the data visualized as a chart:",
        hasTable: false,
        hasChart: true,
        data: { chart: fullResponse.data.chart },
      };
    } else if (drillDown.viewType === 'both') {
      return {
        content: "Here's the complete data with both table and chart:",
        hasTable: fullResponse.hasTable,
        hasChart: fullResponse.hasChart,
        data: fullResponse.data,
      };
    }
  }
  
  // Get the category for this query
  const category = getResponseCategory(userQuery);
  
  if (category) {
    const fullResponse = mockResponses[category];
    
    // Return text-only response with metadata about available views
    return {
      content: fullResponse.content,
      hasTable: false,
      hasChart: false,
      availableViews: {
        table: fullResponse.hasTable,
        chart: fullResponse.hasChart,
      },
    };
  }

  // Default response
  return {
    content: `I've analyzed your query regarding "${userQuery}". Based on the latest financial data, I can provide insights across settlement operations, portfolio analytics, compliance monitoring, and more. 

Could you provide more specific details about what aspect you'd like to explore? For example:
- Settlement fails and trade matching
- Portfolio performance and holdings breakdown
- Compliance exceptions and trends
- Fee analysis and revenue metrics

I'm here to help you navigate your financial data.`,
    hasTable: false,
    hasChart: false,
  };
}

export function generateConversationTitle(userQuery: string): string {
  const queryLower = userQuery.toLowerCase();
  
  if (queryLower.includes("settlement") || queryLower.includes("trade") || queryLower.includes("fail")) {
    return "Settlement fails analysis";
  } else if (queryLower.includes("portfolio") || queryLower.includes("holding")) {
    return "Portfolio holdings breakdown";
  } else if (queryLower.includes("corporate action") || queryLower.includes("dividend")) {
    return "Corporate actions review";
  } else if (queryLower.includes("compliance") || queryLower.includes("exception")) {
    return "Compliance exceptions trend";
  } else if (queryLower.includes("fee") || queryLower.includes("revenue")) {
    return "Fee revenue analysis";
  } else if (queryLower.includes("client") || queryLower.includes("payment")) {
    return "Client payment behavior";
  } else if (queryLower.includes("nav") || queryLower.includes("accrual")) {
    return "NAV and accrual analysis";
  } else if (queryLower.includes("reconcil") || queryLower.includes("data quality")) {
    return "Reconciliation review";
  }

  return userQuery.slice(0, 50) + (userQuery.length > 50 ? "..." : "");
}

export function categorizeQuery(userQuery: string): string {
  const queryLower = userQuery.toLowerCase();

  if (queryLower.includes("settlement") || queryLower.includes("trade") || queryLower.includes("fail")) {
    return "Settlement & Trade Operations";
  } else if (queryLower.includes("portfolio") || queryLower.includes("holding") || queryLower.includes("asset")) {
    return "Portfolio Analytics";
  } else if (queryLower.includes("corporate action") || queryLower.includes("dividend") || queryLower.includes("cash flow")) {
    return "Corporate Actions";
  } else if (queryLower.includes("compliance") || queryLower.includes("risk") || queryLower.includes("exception")) {
    return "Compliance & Risk";
  } else if (queryLower.includes("fee") || queryLower.includes("revenue") || queryLower.includes("expense")) {
    return "Fee Analysis";
  } else if (queryLower.includes("client") || queryLower.includes("payment") || queryLower.includes("invoice")) {
    return "Client Behavior";
  } else if (queryLower.includes("nav") || queryLower.includes("accrual") || queryLower.includes("fund")) {
    return "NAV Operations";
  } else if (queryLower.includes("reconcil") || queryLower.includes("stale") || queryLower.includes("data quality")) {
    return "Reconciliation";
  }

  return "General Query";
}
