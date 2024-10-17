import { z } from "zod";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { companies } from "./company";

export const services = sqliteTable("Services", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  company_id: integer("company_id")
    .notNull()
    .references(() => companies.id),
});

export const serviceFormSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  price: z.number(),
  company_id: z.number(),
});

export type InsertService = typeof services.$inferInsert;
export type SelectService = typeof services.$inferSelect;
export type Service = z.infer<typeof serviceFormSchema>;
