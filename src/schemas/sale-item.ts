import { z } from "zod";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { services } from "./service";
import { sales } from "./sale";

export const saleItems = sqliteTable("SaleItems", {
  id: integer("id").primaryKey(),
  service_id: integer("service_id")
    .notNull()
    .references(() => services.id),
  sale_id: integer("sale_id")
    .notNull()
    .references(() => sales.id),
  price: integer("price").notNull(),
  created_at: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: text("updated_at").$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  service: one(services, {
    fields: [saleItems.service_id],
    references: [services.id],
  }),
  sale: one(sales, {
    fields: [saleItems.sale_id],
    references: [sales.id],
  }),
}));

export const saleItemSchema = z.object({
  id: z.number().optional(),
  sale_id: z.number(),
  item_id: z.number(),
  item_name: z.string(),
  price: z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type InsertSaleItem = typeof saleItems.$inferInsert;
export type SelectSaleItem = typeof saleItems.$inferSelect;

export type SaleItem = z.infer<typeof saleItemSchema>;
