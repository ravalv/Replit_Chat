import { db } from "./db";
import { 
  securities, 
  counterparties, 
  clients, 
  funds,
  tradeSettlements,
  portfolioPositions,
  corporateActions,
  complianceExceptions,
  feeRevenue,
  clientPayments,
  navAdjustments,
  reconciliationExceptions
} from "../shared/schema";

async function seed() {
  console.log("Starting database seed...");

  console.log("Seeding securities...");
  const securitiesData = await db.insert(securities).values([
    { symbol: "AAPL", name: "Apple Inc.", assetClass: "Equity", currency: "USD" },
    { symbol: "MSFT", name: "Microsoft Corporation", assetClass: "Equity", currency: "USD" },
    { symbol: "GOOGL", name: "Alphabet Inc.", assetClass: "Equity", currency: "USD" },
    { symbol: "AMZN", name: "Amazon.com Inc.", assetClass: "Equity", currency: "USD" },
    { symbol: "JPM", name: "JPMorgan Chase & Co.", assetClass: "Equity", currency: "USD" },
    { symbol: "T", name: "US Treasury 10Y", assetClass: "Fixed Income", currency: "USD" },
    { symbol: "BAC", name: "Bank of America Corp", assetClass: "Equity", currency: "USD" },
    { symbol: "XOM", name: "Exxon Mobil Corporation", assetClass: "Equity", currency: "USD" },
    { symbol: "SPY", name: "SPDR S&P 500 ETF", assetClass: "Alternative", currency: "USD" },
    { symbol: "GLD", name: "SPDR Gold Shares", assetClass: "Alternative", currency: "USD" },
  ]).returning();

  console.log("Seeding counterparties...");
  const counterpartiesData = await db.insert(counterparties).values([
    { name: "Goldman Sachs", type: "Broker-Dealer", region: "North America" },
    { name: "Morgan Stanley", type: "Broker-Dealer", region: "North America" },
    { name: "Deutsche Bank", type: "Broker-Dealer", region: "Europe" },
    { name: "UBS", type: "Broker-Dealer", region: "Europe" },
    { name: "Nomura", type: "Broker-Dealer", region: "Asia Pacific" },
    { name: "HSBC", type: "Custodian", region: "Asia Pacific" },
    { name: "BNY Mellon", type: "Custodian", region: "North America" },
    { name: "State Street", type: "Custodian", region: "North America" },
  ]).returning();

  console.log("Seeding clients...");
  const clientsData = await db.insert(clients).values([
    { name: "Pension Fund Alpha", type: "Pension", region: "North America", aum: "5400000000.00" },
    { name: "Endowment Beta", type: "Endowment", region: "North America", aum: "2100000000.00" },
    { name: "Insurance Co Gamma", type: "Insurance", region: "Europe", aum: "3800000000.00" },
    { name: "Family Office Delta", type: "Family Office", region: "North America", aum: "850000000.00" },
    { name: "Sovereign Wealth Epsilon", type: "Sovereign Wealth", region: "Asia Pacific", aum: "12000000000.00" },
    { name: "Corporate Treasury Zeta", type: "Corporate", region: "North America", aum: "1200000000.00" },
  ]).returning();

  console.log("Seeding funds...");
  const fundsData = await db.insert(funds).values([
    { name: "Global Equity Fund", type: "Equity", inceptionDate: "2020-01-01" },
    { name: "Fixed Income Fund", type: "Fixed Income", inceptionDate: "2018-06-15" },
    { name: "Balanced Fund", type: "Mixed", inceptionDate: "2019-03-20" },
    { name: "Alternative Strategies Fund", type: "Alternative", inceptionDate: "2021-09-01" },
  ]).returning();

  console.log("Seeding trade settlements...");
  const tradeSettlementsData = [];
  const statuses = ["Settled", "Settled", "Settled", "Failed", "Pending"];
  const sides = ["Buy", "Sell"];
  const failReasons = [null, null, null, "Insufficient Securities", "Counterparty Delay"];
  
  for (let i = 0; i < 500; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const tradeDate = new Date();
    tradeDate.setDate(tradeDate.getDate() - daysAgo);
    
    const settlementDate = new Date(tradeDate);
    settlementDate.setDate(settlementDate.getDate() + 2);
    
    const security = securitiesData[Math.floor(Math.random() * securitiesData.length)];
    const counterparty = counterpartiesData[Math.floor(Math.random() * counterpartiesData.length)];
    const quantity = Math.floor(Math.random() * 10000) + 100;
    const price = Math.random() * 500 + 50;
    const statusIndex = Math.floor(Math.random() * statuses.length);
    
    tradeSettlementsData.push({
      tradeDate: tradeDate.toISOString().split('T')[0],
      settlementDate: settlementDate.toISOString().split('T')[0],
      securityId: security.id,
      counterpartyId: counterparty.id,
      quantity: quantity.toFixed(2),
      price: price.toFixed(4),
      tradeValue: (quantity * price).toFixed(2),
      status: statuses[statusIndex],
      failReason: failReasons[statusIndex],
      side: sides[Math.floor(Math.random() * sides.length)],
    });
  }
  await db.insert(tradeSettlements).values(tradeSettlementsData);

  console.log("Seeding portfolio positions...");
  const portfolioPositionsData = [];
  for (let i = 0; i < 200; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const asOfDate = new Date();
    asOfDate.setDate(asOfDate.getDate() - daysAgo);
    
    const fund = fundsData[Math.floor(Math.random() * fundsData.length)];
    const security = securitiesData[Math.floor(Math.random() * securitiesData.length)];
    const quantity = Math.floor(Math.random() * 50000) + 1000;
    const price = Math.random() * 500 + 50;
    const marketValue = quantity * price;
    const costBasis = marketValue * (0.85 + Math.random() * 0.3);
    
    portfolioPositionsData.push({
      asOfDate: asOfDate.toISOString().split('T')[0],
      fundId: fund.id,
      securityId: security.id,
      quantity: quantity.toFixed(2),
      marketValue: marketValue.toFixed(2),
      costBasis: costBasis.toFixed(2),
      region: ["North America", "Europe", "Asia Pacific", "Emerging Markets"][Math.floor(Math.random() * 4)],
    });
  }
  await db.insert(portfolioPositions).values(portfolioPositionsData);

  console.log("Seeding corporate actions...");
  const corporateActionsData = [];
  const actionTypes = ["Dividend", "Split", "Merger", "Spin-off"];
  const caStatuses = ["Pending", "Processed", "Cancelled"];
  
  for (let i = 0; i < 100; i++) {
    const daysAhead = Math.floor(Math.random() * 60) - 30;
    const exDate = new Date();
    exDate.setDate(exDate.getDate() + daysAhead);
    
    const paymentDate = new Date(exDate);
    paymentDate.setDate(paymentDate.getDate() + 15);
    
    const security = securitiesData[Math.floor(Math.random() * securitiesData.length)];
    const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
    
    corporateActionsData.push({
      securityId: security.id,
      actionType,
      exDate: exDate.toISOString().split('T')[0],
      paymentDate: actionType === "Dividend" ? paymentDate.toISOString().split('T')[0] : null,
      amount: actionType === "Dividend" ? (Math.random() * 5).toFixed(4) : null,
      ratio: actionType === "Split" ? "2:1" : null,
      status: caStatuses[Math.floor(Math.random() * caStatuses.length)],
      description: `${actionType} for ${security.name}`,
    });
  }
  await db.insert(corporateActions).values(corporateActionsData);

  console.log("Seeding compliance exceptions...");
  const complianceExceptionsData = [];
  const ruleTypes = ["Position Limit", "Concentration Risk", "Liquidity Threshold", "VaR Breach"];
  const severities = ["High", "Medium", "Low"];
  const ceStatuses = ["Open", "Resolved", "Under Review"];
  
  for (let i = 0; i < 80; i++) {
    const daysAgo = Math.floor(Math.random() * 45);
    const exceptionDate = new Date();
    exceptionDate.setDate(exceptionDate.getDate() - daysAgo);
    
    const fund = fundsData[Math.floor(Math.random() * fundsData.length)];
    const status = ceStatuses[Math.floor(Math.random() * ceStatuses.length)];
    const resolvedDate = status === "Resolved" ? new Date(exceptionDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000) : null;
    
    complianceExceptionsData.push({
      exceptionDate: exceptionDate.toISOString().split('T')[0],
      fundId: fund.id,
      ruleType: ruleTypes[Math.floor(Math.random() * ruleTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: `Compliance exception detected for ${fund.name}`,
      status,
      resolvedDate: resolvedDate ? resolvedDate.toISOString().split('T')[0] : null,
    });
  }
  await db.insert(complianceExceptions).values(complianceExceptionsData);

  console.log("Seeding fee revenue...");
  const feeRevenueData = [];
  const feeTypes = ["Management Fee", "Performance Fee", "Advisory Fee", "Transaction Fee"];
  
  for (let i = 0; i < 150; i++) {
    const monthsAgo = Math.floor(Math.random() * 12);
    const periodDate = new Date();
    periodDate.setMonth(periodDate.getMonth() - monthsAgo);
    periodDate.setDate(1);
    
    const client = clientsData[Math.floor(Math.random() * clientsData.length)];
    const aum = parseFloat(client.aum || "0");
    const basisPoints = Math.floor(Math.random() * 100) + 20;
    const feeAmount = (aum * basisPoints) / 10000;
    
    feeRevenueData.push({
      periodDate: periodDate.toISOString().split('T')[0],
      clientId: client.id,
      feeType: feeTypes[Math.floor(Math.random() * feeTypes.length)],
      feeAmount: feeAmount.toFixed(2),
      aum: aum.toFixed(2),
      basisPoints,
    });
  }
  await db.insert(feeRevenue).values(feeRevenueData);

  console.log("Seeding client payments...");
  const clientPaymentsData = [];
  const paymentStatuses = ["Paid", "Paid", "Paid", "Overdue", "Pending"];
  
  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const paymentDate = new Date();
    paymentDate.setDate(paymentDate.getDate() - daysAgo);
    
    const client = clientsData[Math.floor(Math.random() * clientsData.length)];
    const amount = Math.random() * 500000 + 50000;
    const statusIndex = Math.floor(Math.random() * paymentStatuses.length);
    const status = paymentStatuses[statusIndex];
    const daysOverdue = status === "Overdue" ? Math.floor(Math.random() * 30) + 1 : 0;
    
    clientPaymentsData.push({
      paymentDate: paymentDate.toISOString().split('T')[0],
      clientId: client.id,
      invoiceNumber: `INV-${Date.now()}-${i}`,
      amount: amount.toFixed(2),
      status,
      daysOverdue,
    });
  }
  await db.insert(clientPayments).values(clientPaymentsData);

  console.log("Seeding NAV adjustments...");
  const navAdjustmentsData = [];
  const adjustmentTypes = ["Accrual", "Fee Adjustment", "Price Correction", "Income Accrual"];
  const approvers = ["John Smith", "Jane Doe", "Mike Johnson", "Sarah Williams"];
  
  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const navDate = new Date();
    navDate.setDate(navDate.getDate() - daysAgo);
    
    const fund = fundsData[Math.floor(Math.random() * fundsData.length)];
    const amount = (Math.random() * 100000 - 50000);
    
    navAdjustmentsData.push({
      navDate: navDate.toISOString().split('T')[0],
      fundId: fund.id,
      adjustmentType: adjustmentTypes[Math.floor(Math.random() * adjustmentTypes.length)],
      amount: amount.toFixed(2),
      reason: `NAV adjustment for ${fund.name}`,
      approvedBy: approvers[Math.floor(Math.random() * approvers.length)],
    });
  }
  await db.insert(navAdjustments).values(navAdjustmentsData);

  console.log("Seeding reconciliation exceptions...");
  const reconciliationExceptionsData = [];
  const sources = ["Custodian", "Prime Broker", "Fund Admin", "Internal System"];
  const exceptionTypes = ["Price Discrepancy", "Quantity Mismatch", "Missing Security", "Duplicate Trade"];
  const recStatuses = ["Open", "Resolved", "Under Investigation"];
  
  for (let i = 0; i < 90; i++) {
    const daysAgo = Math.floor(Math.random() * 45);
    const exceptionDate = new Date();
    exceptionDate.setDate(exceptionDate.getDate() - daysAgo);
    
    const security = Math.random() > 0.3 ? securitiesData[Math.floor(Math.random() * securitiesData.length)] : null;
    const status = recStatuses[Math.floor(Math.random() * recStatuses.length)];
    const resolvedDate = status === "Resolved" ? new Date(exceptionDate.getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000) : null;
    const ageInDays = status === "Resolved" ? 
      Math.floor((new Date(resolvedDate!).getTime() - exceptionDate.getTime()) / (24 * 60 * 60 * 1000)) :
      Math.floor((new Date().getTime() - exceptionDate.getTime()) / (24 * 60 * 60 * 1000));
    
    reconciliationExceptionsData.push({
      exceptionDate: exceptionDate.toISOString().split('T')[0],
      source: sources[Math.floor(Math.random() * sources.length)],
      exceptionType: exceptionTypes[Math.floor(Math.random() * exceptionTypes.length)],
      securityId: security?.id || null,
      discrepancyAmount: (Math.random() * 50000 - 25000).toFixed(2),
      status,
      resolvedDate: resolvedDate ? resolvedDate.toISOString().split('T')[0] : null,
      ageInDays,
    });
  }
  await db.insert(reconciliationExceptions).values(reconciliationExceptionsData);

  console.log("Database seed completed successfully!");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
