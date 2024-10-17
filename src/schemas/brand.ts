import { z } from "zod";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { companies } from "./company";

export const brands = sqliteTable("Brands", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  company_id: integer("company_id")
    .notNull()
    .references(() => companies.id),
});

export const brandFormSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  company_id: z.number(),
});

export type InsertBrand = typeof brands.$inferInsert;
export type SelectBrand = typeof brands.$inferSelect;
export type Brand = z.infer<typeof brandFormSchema>;
