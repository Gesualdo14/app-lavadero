import { z } from "zod";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sales } from "./sale";
import { selectSchema, users } from "./user";

export const cashflows = sqliteTable("Cashflows", {
  id: integer("id").primaryKey(),
  sale_id: integer("sale_id")
    .notNull()
    .references(() => sales.id),
  method: text("method").notNull(),
  amount: integer("amount").notNull(),
  created_at: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: text("updated_at").$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  deleted_by: integer("deleted_by").references(() => users.id),
});

export const cashflowsRelations = relations(cashflows, ({ one }) => ({
  sale: one(sales, {
    fields: [cashflows.sale_id],
    references: [sales.id],
  }),
  deleter: one(users, {
    fields: [cashflows.deleted_by],
    references: [users.id],
  }),
}));

export const cashflowFormSchema = z.object({
  id: z.number().optional(),
  sale_id: z.number(),
  method: selectSchema,
  amount: z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  deleted_by: z.number().optional(),
});

export type InsertCashflow = typeof cashflows.$inferInsert;
export type SelectCashflow = typeof cashflows.$inferSelect;

export type Cashflow = z.infer<typeof cashflowFormSchema>;
