import { 
  generateSQLQuery, 
  executeSQLQuery, 
  generateNarrative,
  formatResultsForTable,
  formatResultsForChart
} from "./agenticSQL";
import { generateAIResponse } from "./mockAI";

export interface AIResponse {
  content: string;
  hasTable: boolean;
  hasChart: boolean;
  data?: any;
  availableViews?: {
    table: boolean;
    chart: boolean;
  };
}

function isDrillDownRequest(query: string): { isRequest: boolean; viewType: 'table' | 'chart' | null } {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes("show") && (queryLower.includes("table") || queryLower.includes("tabular"))) {
    return { isRequest: true, viewType: 'table' };
  }
  
  if (queryLower.includes("show") && (queryLower.includes("chart") || queryLower.includes("graph") || queryLower.includes("visualiz"))) {
    return { isRequest: true, viewType: 'chart' };
  }
  
  if (queryLower.includes("view as table") || queryLower.includes("display as table")) {
    return { isRequest: true, viewType: 'table' };
  }
  
  if (queryLower.includes("view as chart") || queryLower.includes("display as chart")) {
    return { isRequest: true, viewType: 'chart' };
  }
  
  return { isRequest: false, viewType: null };
}

export async function generateAgenticResponse(
  userQuery: string, 
  conversationCategory?: string,
  useAgenticSQL: boolean = true
): Promise<AIResponse> {
  const drillDown = isDrillDownRequest(userQuery);

  // If agentic SQL is disabled, fall back to mockAI
  if (!useAgenticSQL) {
    return generateAIResponse(userQuery, conversationCategory);
  }

  try {
    // Generate SQL query plan
    const sqlPlan = await generateSQLQuery(userQuery, conversationCategory);
    
    // Execute SQL query
    const results = await executeSQLQuery(sqlPlan.sql);
    
    // Handle drill-down requests
    if (drillDown.isRequest) {
      if (drillDown.viewType === 'table') {
        const tableData = formatResultsForTable(results);
        return {
          content: `Here's the data in table format (${results.length} rows):`,
          hasTable: true,
          hasChart: false,
          data: {
            table: tableData,
          },
        };
      } else if (drillDown.viewType === 'chart') {
        const chartData = formatResultsForChart(results, sqlPlan.chartType || 'bar');
        return {
          content: `Here's the data visualized as a ${sqlPlan.chartType || 'bar'} chart:`,
          hasTable: false,
          hasChart: true,
          data: {
            chart: chartData,
          },
        };
      }
    }

    // Generate narrative for initial response
    const narrative = await generateNarrative(userQuery, results, sqlPlan.sql);
    
    // Format insights into readable text
    const insightsText = narrative.insights.length > 0
      ? "\n\n**Key Insights:**\n" + narrative.insights.map(i => `- ${i}`).join("\n")
      : "";
    
    const content = `${narrative.summary}${insightsText}`;

    // Determine available views based on results
    const hasData = results.length > 0;
    const availableViews = hasData ? {
      table: true,
      chart: sqlPlan.chartType !== undefined || narrative.visualizationHint !== "table",
    } : undefined;

    return {
      content,
      hasTable: false,
      hasChart: false,
      data: {
        availableViews,
        // Store results and SQL for drill-down requests
        _sqlResults: results,
        _sqlPlan: sqlPlan,
      },
      availableViews,
    };
  } catch (error: any) {
    console.error("[Agentic Response] Error:", error);
    
    // Fallback to mockAI on error
    console.log("[Agentic Response] Falling back to mockAI due to error");
    return generateAIResponse(userQuery, conversationCategory);
  }
}

export async function handleDrillDownRequest(
  userQuery: string,
  previousMessageData: any
): Promise<AIResponse> {
  const drillDown = isDrillDownRequest(userQuery);
  
  if (!drillDown.isRequest || !previousMessageData) {
    throw new Error("Invalid drill-down request");
  }

  const sqlResults = previousMessageData._sqlResults;
  const sqlPlan = previousMessageData._sqlPlan;

  if (!sqlResults || !sqlPlan) {
    throw new Error("No SQL results available for drill-down");
  }

  if (drillDown.viewType === 'table') {
    const tableData = formatResultsForTable(sqlResults);
    return {
      content: `Here's the data in table format (${sqlResults.length} rows):`,
      hasTable: true,
      hasChart: false,
      data: {
        table: tableData,
      },
    };
  } else if (drillDown.viewType === 'chart') {
    const chartData = formatResultsForChart(sqlResults, sqlPlan.chartType || 'bar');
    return {
      content: `Here's the data visualized as a ${sqlPlan.chartType || 'bar'} chart:`,
      hasTable: false,
      hasChart: true,
      data: {
        chart: chartData,
      },
    };
  }

  throw new Error("Invalid visualization type");
}
