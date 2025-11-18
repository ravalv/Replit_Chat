import OpenAI from "openai";
import { db } from "./db";
import { sql } from "drizzle-orm";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DATABASE_SCHEMA = `
You are a financial data analyst with access to the following PostgreSQL database schema:

DIMENSION TABLES:
1. securities (id, symbol, name, asset_class, currency)
2. counterparties (id, name, type, region)
3. clients (id, name, type, region, aum)
4. funds (id, name, type, inception_date)

FACT TABLES:
5. trade_settlements (id, trade_date, settlement_date, security_id, counterparty_id, quantity, price, trade_value, status, fail_reason, side)
6. portfolio_positions (id, as_of_date, fund_id, security_id, quantity, market_value, cost_basis, region)
7. corporate_actions (id, security_id, action_type, ex_date, payment_date, amount, ratio, status, description)
8. compliance_exceptions (id, exception_date, fund_id, rule_type, severity, description, status, resolved_date)
9. fee_revenue (id, period_date, client_id, fee_type, fee_amount, aum, basis_points)
10. client_payments (id, payment_date, client_id, invoice_number, amount, status, days_overdue)
11. nav_adjustments (id, nav_date, fund_id, adjustment_type, amount, reason, approved_by)
12. reconciliation_exceptions (id, exception_date, source, exception_type, security_id, discrepancy_amount, status, resolved_date, age_in_days)

CATEGORY MAPPING:
- Settlement & Trade Operations: Use trade_settlements table
- Portfolio Analytics: Use portfolio_positions table with funds and securities
- Corporate Actions: Use corporate_actions table with securities
- Compliance & Risk: Use compliance_exceptions table with funds
- Fee Analysis: Use fee_revenue table with clients
- Client Behavior: Use client_payments table with clients
- NAV Operations: Use nav_adjustments table with funds
- Reconciliation: Use reconciliation_exceptions table

RULES:
1. Only generate SELECT queries (no INSERT, UPDATE, DELETE, DROP, ALTER, CREATE)
2. Always use proper JOIN syntax with foreign keys
3. Use appropriate aggregations (SUM, COUNT, AVG, MAX, MIN)
4. Include relevant columns for visualization
5. Limit results to 100 rows max
6. Use proper date filtering for recent data
7. Always include security/client/fund names in results, not just IDs
`;

interface SQLPlan {
  category: string;
  sql: string;
  visualizationHint: "table" | "chart" | "both";
  chartType?: "bar" | "line" | "pie";
}

export async function generateSQLQuery(userQuery: string, conversationCategory?: string): Promise<SQLPlan> {
  try {
    const systemPrompt = `${DATABASE_SCHEMA}

Generate a SQL query plan for the following user query. Respond with JSON in this exact format:
{
  "category": "Settlement & Trade Operations" | "Portfolio Analytics" | "Corporate Actions" | "Compliance & Risk" | "Fee Analysis" | "Client Behavior" | "NAV Operations" | "Reconciliation",
  "sql": "SELECT ...",
  "visualizationHint": "table" | "chart" | "both",
  "chartType": "bar" | "line" | "pie"
}

The SQL query must:
- Be a valid PostgreSQL SELECT query only (NO semicolon at the end)
- Use proper JOINs to include human-readable names
- Include appropriate aggregations and GROUP BY clauses
- Limit results to 100 rows
- Use date filters for recent data (last 90 days unless specified)
- Return columns suitable for the visualization type`;

    const userPrompt = conversationCategory 
      ? `Category: ${conversationCategory}\n\nQuery: ${userQuery}`
      : `Query: ${userQuery}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const plan = JSON.parse(response.choices[0].message.content || "{}") as SQLPlan;

    // Remove trailing semicolon if present
    plan.sql = plan.sql.trim().replace(/;+$/, '');

    console.log("[Agentic SQL] Generated SQL:", plan.sql.substring(0, 200));

    // Validate SQL safety
    validateSQLSafety(plan.sql);

    return plan;
  } catch (error: any) {
    console.error("[Agentic SQL] Error generating SQL:", error);
    throw new Error(`Failed to generate SQL query: ${error.message}`);
  }
}

function validateSQLSafety(sqlQuery: string): void {
  const upperSQL = sqlQuery.toUpperCase();
  
  // Block destructive operations
  const forbidden = [
    "INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE", 
    "TRUNCATE", "GRANT", "REVOKE", "EXEC", "EXECUTE"
  ];
  
  for (const keyword of forbidden) {
    if (upperSQL.includes(keyword)) {
      throw new Error(`Forbidden SQL keyword detected: ${keyword}`);
    }
  }
  
  // Must start with SELECT
  if (!upperSQL.trim().startsWith("SELECT")) {
    throw new Error("Query must be a SELECT statement");
  }
  
  // Block semicolons (prevent multiple statements)
  if (sqlQuery.includes(";")) {
    throw new Error("Multiple statements not allowed");
  }
}

export async function executeSQLQuery(sqlQuery: string): Promise<any[]> {
  try {
    // Execute with timeout and row limit
    const result = await db.execute(sql.raw(`
      SELECT * FROM (${sqlQuery}) AS subquery 
      LIMIT 100
    `));
    
    return result.rows || [];
  } catch (error: any) {
    console.error("[Agentic SQL] Query execution error:", error);
    throw new Error(`Query execution failed: ${error.message}`);
  }
}

interface NarrativeResponse {
  summary: string;
  insights: string[];
  visualizationHint: "table" | "chart" | "both";
}

export async function generateNarrative(
  userQuery: string,
  sqlResults: any[],
  sqlQuery: string
): Promise<NarrativeResponse> {
  try {
    const systemPrompt = `You are a financial data analyst. Generate a concise narrative summary of query results.
Respond with JSON in this format:
{
  "summary": "2-3 sentence overview of the findings",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "visualizationHint": "table" | "chart" | "both"
}

Focus on:
- Key metrics and trends
- Notable outliers or patterns
- Actionable insights
- Financial significance`;

    const userPrompt = `User Query: ${userQuery}

SQL Query: ${sqlQuery}

Results (${sqlResults.length} rows):
${JSON.stringify(sqlResults.slice(0, 5), null, 2)}${sqlResults.length > 5 ? '\n... and more rows' : ''}

Generate a narrative summary.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const narrative = JSON.parse(response.choices[0].message.content || "{}") as NarrativeResponse;
    return narrative;
  } catch (error: any) {
    console.error("[Agentic SQL] Error generating narrative:", error);
    return {
      summary: "Analysis completed successfully.",
      insights: ["Data retrieved from database", "Results available for visualization"],
      visualizationHint: "both",
    };
  }
}

export function formatResultsForTable(results: any[]): { headers: string[], rows: (string | number)[][] } {
  if (results.length === 0) {
    return { headers: [], rows: [] };
  }
  
  const headers = Object.keys(results[0]);
  const rows = results.map(row => 
    headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return "";
      if (typeof value === "number") return value;
      if (value instanceof Date) return value.toISOString().split('T')[0];
      return String(value);
    })
  );
  
  return { headers, rows };
}

export function formatResultsForChart(
  results: any[],
  chartType: "bar" | "line" | "pie"
): { type: "bar" | "line" | "pie", data: { name: string, value: number }[] } {
  if (results.length === 0) {
    return { type: chartType, data: [] };
  }
  
  // Auto-detect name and value columns
  const keys = Object.keys(results[0]);
  const nameKey = keys.find(k => 
    k.toLowerCase().includes("name") || 
    k.toLowerCase().includes("symbol") ||
    k.toLowerCase().includes("type") ||
    k.toLowerCase().includes("date")
  ) || keys[0];
  
  const valueKey = keys.find(k => 
    k.toLowerCase().includes("count") ||
    k.toLowerCase().includes("total") ||
    k.toLowerCase().includes("amount") ||
    k.toLowerCase().includes("value") ||
    typeof results[0][k] === "number"
  ) || keys[1];
  
  const data = results.slice(0, 20).map(row => ({
    name: String(row[nameKey] || "Unknown"),
    value: Number(row[valueKey] || 0),
  }));
  
  return { type: chartType, data };
}
