import z from 'zod'

export const userSchema = z.object({
  phone: z.string().length(9, { message: 'Invalid Phone' }),
  password: z.string(),
})
