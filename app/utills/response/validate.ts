import { Unprocessable } from './errorHandler'

export const validate = (field: unknown, schema: any) => {
  const { success, data, error } = schema.safeParse(field)
  const fieldError = error?.flatten().fieldErrors
  if (!success) {
    const message = 'Validation Error'
    throw new Unprocessable(message, fieldError, field)
  }
  return { success, data, field, fieldErrors: fieldError }
}
