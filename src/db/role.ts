import { db } from ".";

export const getRoles = async () => {
  return await db.query.roles.findMany();
};
