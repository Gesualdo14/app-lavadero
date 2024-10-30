import { sales } from "@/schemas/sale";
import { db } from ".";
import { sql } from "drizzle-orm";

export const getSalesReport = async () => {
  return await db
    .select({
      day: sales.day,
      week: sales.week,
      month: sales.month,
      year: sales.year,
      amount: sql`SUM(${sales.total_amount})`,
      count: sql`COUNT(${sales.id})`,
    })
    .from(sales)
    .groupBy(sales.company_id, sales.day, sales.week, sales.month, sales.year);
};
