import { z } from "zod";

export const serviceFormSchema = z.object({
  name: z.string(),
  price: z.number(),
});

export type Service = z.infer<typeof serviceFormSchema>;
