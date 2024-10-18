import { z } from "zod";
import { eq, relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  sqliteView,
  alias,
} from "drizzle-orm/sqlite-core";
import { users, type SelectUser, type User } from "./user";
import { vehicles, type SelectVehicle, type Vehicle } from "./vehicle";
import { services, type Service } from "./service";
import { saleItems } from "./sale-item";
import { companies } from "./company";

export const sales = sqliteTable("Sales", {
  id: integer("id").primaryKey(),
  total_amount: integer("total_amount").notNull(),
  gathered: integer("gathered").default(0),
  client_id: integer("client_id")
    .notNull()
    .references(() => users.id),
  company_id: integer("company_id")
    .notNull()
    .references(() => companies.id),
  created_by: integer("created_by")
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
  client_id: z.number(),
  created_by: z.number(),
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
  company_id: z.number(),
  created_by: z.number(),
  client: selectSchema,
  vehicle: selectSchema,
  services: selectSchema,
  total_amount: z.number(),
  gathered: z.number().default(0),
});

let u1 = alias(users, "u1");
let u2 = alias(users, "u2");

export const salesRelations = relations(sales, ({ one, many }) => ({
  client: one(users, {
    fields: [sales.client_id],
    references: [users.id],
  }),
  user: one(users, {
    fields: [sales.created_by],
    references: [users.id],
  }),
  company: one(companies, {
    fields: [sales.company_id],
    references: [companies.id],
  }),
  vehicle: one(vehicles, {
    fields: [sales.vehicle_id],
    references: [vehicles.id],
  }),
  services: many(saleItems),
}));

export const view_sales = sqliteView("view_Sales").as((qb) => {
  return qb
    .select({
      id: sales.id,
      client: {
        id: sales.client_id,
        firstname: u1.firstname,
        lastname: u1.lastname,
        email: u1.email,
      },
      user: {
        id: sales.created_by,
        firstname: u2.firstname,
        lastname: u2.lastname,
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
    .leftJoin(u1, eq(u1.id, sales.client_id))
    .leftJoin(u2, eq(u2.id, sales.created_by))
    .leftJoin(vehicles, eq(vehicles.id, sales.vehicle_id))
    .leftJoin(saleItems, eq(saleItems.sale_id, sales.id))
    .leftJoin(services, eq(saleItems.service_id, services.id));
});

export type InsertSale = typeof sales.$inferInsert;
export type SelectSale = typeof sales.$inferSelect;

export type Sale = z.infer<typeof saleFormSchema>;

export interface TSale extends SelectSale {
  user: SelectUser;
  vehicle: SelectVehicle;
}
