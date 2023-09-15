import z from 'zod'

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5).optional(),
  price: z.coerce.number().min(1),
  stock: z.coerce.number().min(1),
  categoryId: z.string().uuid().optional(),
})
