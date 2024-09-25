import { createClient } from "@libsql/client";

export const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL ?? "",
  authToken: import.meta.env.TURSO_AUTH_TOKEN ?? "",
});

export const getVehicles = async (user_id: number) => {
  const { rows } = await turso.execute({
    sql: "SELECT * FROM Vehicles WHERE id = ?",
    args: [user_id],
  });

  return rows;
};
