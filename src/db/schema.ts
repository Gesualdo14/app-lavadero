import { relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  numeric,
  real,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("Users", {
  id: integer("id").primaryKey(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  email: text("email").unique().notNull(),
});
export const services = sqliteTable("Services", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
});

export const vehicles = sqliteTable("Vehicles", {
  id: integer("id").primaryKey(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const sales = sqliteTable("Sales", {
  id: integer("id").primaryKey(),
  total_amount: integer("total_amount").notNull(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  vehicle_id: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
  service_id: integer("service_id")
    .notNull()
    .references(() => services.id),
  created_at: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: text("updated_at").$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const salesRelations = relations(sales, ({ one }) => ({
  user: one(users, {
    fields: [sales.user_id],
    references: [users.id],
  }),
  vehicle: one(vehicles, {
    fields: [sales.vehicle_id],
    references: [vehicles.id],
  }),
  service: one(services, {
    fields: [sales.service_id],
    references: [services.id],
  }),
}));

export type InsertVehicle = typeof vehicles.$inferInsert;
export type SelectVehicle = typeof vehicles.$inferSelect;

export type InsertSale = typeof sales.$inferInsert;
export type SelectSale = typeof sales.$inferSelect;

export type InsertService = typeof services.$inferInsert;
export type SelectService = typeof services.$inferSelect;

export interface TSale extends SelectSale {
  user: SelectUser;
  vehicle: SelectVehicle;
}

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
