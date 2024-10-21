import { db } from ".";

export const getReports = async () => {
  return await db.query.daily_reports.findMany();
};
