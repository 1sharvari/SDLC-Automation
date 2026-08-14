import { z } from 'zod';

export const getProductsQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  featuredOnly: z
    .string()
    .optional()
    .transform((val) => val === 'true')
});

export type GetProductsQueryDto = z.infer<typeof getProductsQuerySchema>;
