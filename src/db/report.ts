import { cashflows_daily_report } from "@/schemas/report";
import { db } from ".";
import { sql } from "drizzle-orm";

export const getReports = async (
  report: "sale" | "cashflow"
): Promise<any[]> => {
  if (report === "sale") return await db.query.sales_daily_report.findMany();

  if (report === "cashflow")
    return await db
      .select({
        amount: sql`SUM(${cashflows_daily_report.amount})`,
        method: cashflows_daily_report.method,
      })
      .from(cashflows_daily_report)
      .groupBy(cashflows_daily_report.method);

  return await db
    .select({
      amount: sql`SUM(${cashflows_daily_report.amount})`,
      method: cashflows_daily_report.method,
    })
    .from(cashflows_daily_report)
    .groupBy(cashflows_daily_report.method);
};
