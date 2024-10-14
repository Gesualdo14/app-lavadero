import { z } from "zod";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const brands = sqliteTable("Brands", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export const brandFormSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
});

export type InsertBrand = typeof brands.$inferInsert;
export type SelectBrand = typeof brands.$inferSelect;
export type Brand = z.infer<typeof brandFormSchema>;
