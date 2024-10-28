import { z } from "zod";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { companies } from "./company";
import { users } from "./user";

export const brands = sqliteTable("Brands", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  company_id: integer("company_id")
    .notNull()
    .references(() => companies.id),
  deleted_by: integer("deleted_by").references(() => users.id),
});

export const brandFormSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  deleted_by: z.number().optional(),
});

export type InsertBrand = typeof brands.$inferInsert;
export type SelectBrand = typeof brands.$inferSelect;
export type Brand = z.infer<typeof brandFormSchema>;
