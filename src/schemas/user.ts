import { z } from "zod";

export const userFormSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email("Email inválido"),
});

export type User = z.infer<typeof userFormSchema>;
