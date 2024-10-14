import { z } from "zod";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const selectSchema = z
  .array(
    z.object({ id: z.number(), name: z.string(), value: z.number().optional() })
  )
  .optional();

export const users = sqliteTable("Users", {
  id: integer("id").primaryKey(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  email: text("email").unique().notNull(),
});

export const userFormSchema = z.object({
  id: z.number().optional(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email("Email inválido"),
  brand: selectSchema,
  model: z.string().optional(),
  patent: z.string().optional(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type User = z.infer<typeof userFormSchema>;
