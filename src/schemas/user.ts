import { z } from "zod";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const selectSchema = z
  .array(
    z.object({ id: z.number(), name: z.string(), value: z.number().optional() })
  )
  .optional();

export const users = sqliteTable("Users", {
  id: integer("id").primaryKey(),
  company_id: integer("company_id").notNull(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  phone: text("phone"),
  email: text("email").unique().notNull(),
  avatar: text("avatar_url"),
  password: text("password"),
  deleted_by: integer("deleted_by"),
  role: text("role"),
  is_client: integer("is_client").default(1),
});

export const userFormSchema = z.object({
  id: z.number().optional(),
  company_id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email("Email inválido"),
  avatar: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().optional(),
  role: selectSchema,
  brand: selectSchema,
  model: z.string().optional(),
  patent: z.string().optional(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type User = z.infer<typeof userFormSchema>;
export type LoggedUser = Omit<User, "role" & "id"> & {
  id: number;
  role: string;
};
