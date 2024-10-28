import { z } from "zod";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";

export const vehicles = sqliteTable("Vehicles", {
  id: integer("id").primaryKey(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  patent: text("patent").notNull(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  deleted_by: integer("deleted_by").references(() => users.id),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const vehicleFormSchema = z.object({
  brand: z.string(),
  model: z.string(),
  user_id: z.number(),
  deleted_by: z.date().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type InsertVehicle = typeof vehicles.$inferInsert;
export type SelectVehicle = typeof vehicles.$inferSelect;

export type Vehicle = z.infer<typeof vehicleFormSchema>;
