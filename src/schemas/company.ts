import { z } from "zod";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const companies = sqliteTable("Companies", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  logo_url: text("logo_url"),
  created_at: text("created_at"),
});

export const companyFormSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
});

export type InsertCompany = typeof companies.$inferInsert;
export type SelectCompany = typeof companies.$inferSelect;
export type Company = z.infer<typeof companyFormSchema>;
