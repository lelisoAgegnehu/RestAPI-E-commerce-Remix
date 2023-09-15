import z from 'zod'

export const orderSchema = z.array(
  z.object({
    quantity: z.coerce.number().min(1),
    productId: z.string().uuid(),
  })
)
