import { sales } from "@/schemas/sale";
import { db } from ".";
import { gt, sql } from "drizzle-orm";
import { addDays } from "date-fns";

export const getSalesReport = async () => {
  return await db
    .select({
      day: sales.day,
      week: sales.week,
      month: sales.month,
      year: sales.year,
      amount: sql`SUM(${sales.total_amount})`,
      gathered: sql`SUM(${sales.gathered})`,
      count: sql`COUNT(${sales.id})`,
    })
    .from(sales)
    .where(gt(sales.sale_date, +addDays(new Date(), -90)))
    .groupBy(sales.company_id, sales.day, sales.week, sales.month, sales.year);
};
