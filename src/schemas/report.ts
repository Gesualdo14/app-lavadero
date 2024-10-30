import {
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const sales_daily_report = sqliteTable(
  "SalesDailyReport",
  {
    id: integer("id").primaryKey(),
    day: integer("day").notNull(),
    week: integer("week").notNull(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    company_id: integer("company_id").notNull(),
    amount: real("amount"),
    quantity: integer("quantity"),
  },
  (table) => {
    return {
      unq_entry: uniqueIndex("unq_entry_sales_report").on(
        table.day,
        table.month,
        table.year,
        table.company_id
      ),
    };
  }
);

export type InsertSaleDailyReport = typeof sales_daily_report.$inferInsert;
export type SelectSaleDailyReport = typeof sales_daily_report.$inferSelect;

export const cashflows_daily_report = sqliteTable(
  "CashflowsDailyReport",
  {
    id: integer("id").primaryKey(),
    day: integer("day").notNull(),
    week: integer("week").notNull(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    company_id: integer("company_id").notNull(),
    amount: real("amount"),
    quantity: integer("quantity"),
    method: text("method"),
  },
  (table) => {
    return {
      unq_entry: uniqueIndex("unq_entry_cashflows_report").on(
        table.day,
        table.month,
        table.year,
        table.method,
        table.company_id
      ),
    };
  }
);

export type InsertCashflowDailyReport = typeof sales_daily_report.$inferInsert;
export type SelectCashflowDailyReport = typeof sales_daily_report.$inferSelect;
