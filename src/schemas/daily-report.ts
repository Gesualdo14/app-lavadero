import {
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const dailyReport = sqliteTable(
  "DailyReport",
  {
    id: integer("id").primaryKey(),
    day: integer("day").notNull(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    company_id: integer("company_id").notNull(),
    sales_amount: real("sales_amount"),
    sales_gathered: real("sales_gathered"),
    sales: integer("sales"),
    clients: integer("clients"),
    vehicles: integer("vehicles"),
    created_at: text("created_at"),
  },
  (table) => {
    return {
      unq_entry: uniqueIndex("unq_enty").on(
        table.day,
        table.month,
        table.year,
        table.company_id
      ),
    };
  }
);

export type InsertDailyReport = typeof dailyReport.$inferInsert;
export type SelectDailyReport = typeof dailyReport.$inferSelect;
