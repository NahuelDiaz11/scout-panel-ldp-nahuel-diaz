import { z } from "zod";

export const playersQuerySchema = z.object({
  name: z.string().optional(),
  position: z.string().optional(),
  nationality: z.string().optional(),
  ageMin: z.coerce.number().min(15).max(50).optional(),
  ageMax: z.coerce.number().min(15).max(50).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export const compareQuerySchema = z.object({
  ids: z
    .string()
    .regex(/^\d+(,\d+){1,2}$/, "Provide 2 or 3 comma-separated player IDs"),
});

export type PlayersQuery = z.infer<typeof playersQuerySchema>;
export type CompareQuery = z.infer<typeof compareQuerySchema>;