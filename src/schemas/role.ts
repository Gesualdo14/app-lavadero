import { z } from "zod";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const roles = sqliteTable("Roles", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export const roleFormSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
});

export type InsertRole = typeof roles.$inferInsert;
export type SelectRole = typeof roles.$inferSelect;
export type Role = z.infer<typeof roleFormSchema>;
