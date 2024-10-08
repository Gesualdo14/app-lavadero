import { z } from "zod";

export const saleFormSchema = z.object({
  user_id: z.number(),
  vehicle_id: z.number(),
  service_id: z.number(),
  total_amount: z.number(),
  id: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Sale = z.infer<typeof saleFormSchema>;
