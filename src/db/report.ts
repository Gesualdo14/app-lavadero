import { db } from ".";

export const getReports = async (
  report: "sale" | "cashflow"
): Promise<any[]> => {
  if (report === "sale") return await db.query.sales_daily_report.findMany();

  if (report === "cashflow")
    return await db.query.cashflows_daily_report.findMany();

  return await db.query.cashflows_daily_report.findMany();
};
