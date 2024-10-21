import { sales, view_sales, type Sale } from "@/schemas/sale";
import { desc, eq, like, or, sql } from "drizzle-orm";
import { db } from ".";
import { daily_reports } from "@/schemas/report";
import { saleItems, type SelectSaleItem } from "@/schemas/sale-item";

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
  const {
    sale_date,
    services,
    client,
    created_by,
    company_id,
    vehicle,
    total_amount,
  } = data;

  return await db.transaction(async (tx) => {
    const date = new Date(sale_date);
    console.log({ data, sale_date });
    const timestamp = +date;
    try {
      const { lastInsertRowid } = await tx.insert(sales).values({
        sale_date: timestamp,
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        vehicle_id: vehicle[0].id,
        company_id,
        created_by: created_by as number,
        client_id: client[0].id,
        total_amount,
      });
      await tx
        .insert(daily_reports)
        .values({
          company_id: 1,
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          sales_amount: total_amount,
          sales_gathered: 0,
          sales: 1,
          clients: 1,
          vehicles: 1,
        })
        .onConflictDoUpdate({
          target: [
            daily_reports.day,
            daily_reports.month,
            daily_reports.year,
            daily_reports.company_id,
          ],
          set: {
            sales_amount: sql`${daily_reports.sales_amount} + ${total_amount}`,
            sales: sql`${daily_reports.sales} + 1`,
            clients: sql`${daily_reports.clients} + 1`,
            vehicles: sql`${daily_reports.vehicles} + 1`,
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
  const { id, services, sale_date, client, vehicle, total_amount } = data;
  const date = new Date(sale_date);

  const timestamp = +date;

  return await db.transaction(async (tx) => {
    const saleId = id as number;
    await tx
      .update(sales)
      .set({
        sale_date: timestamp,
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        vehicle_id: vehicle[0].id,
        client_id: client[0].id,
        total_amount,
      })
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
