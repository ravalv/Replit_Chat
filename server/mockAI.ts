// Mock AI response generator for financial queries

interface AIResponse {
  content: string;
  hasTable: boolean;
  hasChart: boolean;
}

const mockResponses: Record<string, AIResponse> = {
  settlement: {
    content: `Based on today's data, there are 3 settlement fails totaling $2.4M across different counterparties. The main reasons include:

1. Insufficient securities (2 trades - $1.6M)
2. Missing settlement instructions (1 trade - $800K)

The affected counterparties are Goldman Sachs, Morgan Stanley, and JP Morgan. All trades are flagged for immediate follow-up with T+1 settlement recovery procedures.`,
    hasTable: true,
    hasChart: false,
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
  },
};

export function generateAIResponse(userQuery: string): AIResponse {
  const queryLower = userQuery.toLowerCase();

  // Match query to category
  if (queryLower.includes("settlement") || queryLower.includes("trade") || queryLower.includes("fail")) {
    return mockResponses.settlement;
  } else if (queryLower.includes("portfolio") || queryLower.includes("holding") || queryLower.includes("asset")) {
    return mockResponses.portfolio;
  } else if (queryLower.includes("corporate action") || queryLower.includes("dividend") || queryLower.includes("cash flow")) {
    return mockResponses.corporate_actions;
  } else if (queryLower.includes("compliance") || queryLower.includes("risk") || queryLower.includes("exception")) {
    return mockResponses.compliance;
  } else if (queryLower.includes("fee") || queryLower.includes("revenue") || queryLower.includes("expense")) {
    return mockResponses.fees;
  } else if (queryLower.includes("client") || queryLower.includes("payment") || queryLower.includes("invoice")) {
    return mockResponses.client_behavior;
  } else if (queryLower.includes("nav") || queryLower.includes("accrual") || queryLower.includes("fund")) {
    return mockResponses.nav;
  } else if (queryLower.includes("reconcil") || queryLower.includes("stale") || queryLower.includes("data quality")) {
    return mockResponses.reconciliation;
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
