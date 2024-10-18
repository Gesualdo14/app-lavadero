import { sales, view_sales, type Sale } from "@/schemas/sale";
import { desc, eq, like, or, sql } from "drizzle-orm";
import { db } from ".";
import { dailyReport } from "@/schemas/daily-report";
import {
  saleItems,
  type InsertSaleItem,
  type SelectSaleItem,
} from "@/schemas/sale-item";

export const getSales = async (searchText: string | null | undefined) => {
  try {
    let where;
    if (!!searchText) {
      where = or(
        like(view_sales.user.firstname, `%${searchText}%`),
        like(view_sales.user.lastname, `%${searchText}%`),
        like(view_sales.vehicle.brand, `%${searchText}%`),
        like(view_sales.vehicle.model, `%${searchText}%`),
        like(view_sales.vehicle.patent, `%${searchText}%`)
      );
    }

    const result = await db
      .select()
      .from(view_sales)
      .where(where)
      .limit(8)
      .orderBy(desc(view_sales.id));

    return result;
  } catch (error) {
    console.log({ error });
  }
};

export async function createSale(data: Sale) {
  const { services, client, vehicle, total_amount } = data;
  return await db.transaction(async (tx) => {
    try {
      const { lastInsertRowid } = await tx.insert(sales).values({
        vehicle_id: vehicle[0].id,
        company_id: 1,
        created_by: 1,
        client_id: client[0].id,
        total_amount,
      });
      const now = new Date();
      await tx
        .insert(dailyReport)
        .values({
          company_id: 1,
          day: now.getDate(),
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          sales_amount: total_amount,
          sales_gathered: 0,
          sales: 1,
          clients: 1,
          vehicles: 1,
        })
        .onConflictDoUpdate({
          target: [
            dailyReport.day,
            dailyReport.month,
            dailyReport.year,
            dailyReport.company_id,
          ],
          set: {
            sales_amount: sql`${dailyReport.sales_amount} + ${total_amount}`,
            sales: sql`${dailyReport.sales} + 1`,
            clients: sql`${dailyReport.clients} + 1`,
            vehicles: sql`${dailyReport.vehicles} + 1`,
          },
        });

      await tx.insert(saleItems).values(
        services.map((s) => ({
          service_id: s.id,
          sale_id: Number(lastInsertRowid),
          price: s.value as number,
        }))
      );
    } catch (error) {
      console.log("ERROR AL CREAR LA VENTA", { error });
      await tx.rollback();
    }
  });
}

export async function updateSale(data: Sale) {
  const { id, services, client, vehicle, total_amount } = data;
  console.log({ id, client, vehicle });
  return await db.transaction(async (tx) => {
    const saleId = id as number;
    await tx
      .update(sales)
      .set({ vehicle_id: vehicle[0].id, client_id: client[0].id, total_amount })
      .where(eq(sales.id, saleId));

    await tx.delete(saleItems).where(eq(saleItems.sale_id, saleId));

    await tx.insert(saleItems).values(
      services.map((s) => ({
        sale_id: saleId,
        service_id: s.id,
        price: s.value as number,
      }))
    );
  });
}

export const getSaleItems = async (): Promise<SelectSaleItem[]> => {
  return await db.query.saleItems.findMany({
    limit: 5,
    orderBy: [desc(saleItems.id)],
  });
};

export async function createSaleItems(data: InsertSaleItem[]) {
  return await db.insert(saleItems).values(data);
}
