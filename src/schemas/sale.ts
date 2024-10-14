import { z } from "zod";
import { eq, relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  sqliteView,
} from "drizzle-orm/sqlite-core";
import { users, type SelectUser, type User } from "./user";
import { vehicles, type SelectVehicle, type Vehicle } from "./vehicle";
import { services, type Service } from "./service";
import { saleItems } from "./sale-item";

export const sales = sqliteTable("Sales", {
  id: integer("id").primaryKey(),
  total_amount: integer("total_amount").notNull(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  vehicle_id: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
  created_at: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: text("updated_at").$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const saleSchema = z.object({
  user_id: z.number(),
  vehicle_id: z.number(),
  total_amount: z.number(),
  id: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const selectSchema = z.array(
  z.object({ id: z.number(), name: z.string(), value: z.number().optional() })
);

export interface TSelect<T> extends z.infer<typeof selectSchema> {
  details: T extends "service" ? Service : T extends "user" ? User : Vehicle;
}

export const saleFormSchema = z.object({
  id: z.number().optional(),
  user: selectSchema,
  vehicle: selectSchema,
  services: selectSchema,
  total_amount: z.number(),
});

export const salesRelations = relations(sales, ({ one, many }) => ({
  user: one(users, {
    fields: [sales.user_id],
    references: [users.id],
  }),
  vehicle: one(vehicles, {
    fields: [sales.vehicle_id],
    references: [vehicles.id],
  }),
  services: many(saleItems),
}));

export const view_sales = sqliteView("view_Sales").as((qb) =>
  qb
    .select({
      id: sales.id,
      user: {
        id: sales.user_id,
        firstname: users.firstname,
        lastname: users.lastname,
      },
      vehicle: {
        id: sales.vehicle_id,
        brand: vehicles.brand,
        model: vehicles.model,
        patent: vehicles.patent,
      },
      total_amount: sales.total_amount,
      services: sql``.as("services"),
    })
    .from(sales)
    .leftJoin(users, eq(users.id, sales.user_id))
    .leftJoin(vehicles, eq(vehicles.id, sales.vehicle_id))
    .leftJoin(saleItems, eq(saleItems.sale_id, sales.id))
    .leftJoin(services, eq(saleItems.service_id, services.id))
);

export type InsertSale = typeof sales.$inferInsert;
export type SelectSale = typeof sales.$inferSelect;

export type Sale = z.infer<typeof saleFormSchema>;

export interface TSale extends SelectSale {
  user: SelectUser;
  vehicle: SelectVehicle;
}
