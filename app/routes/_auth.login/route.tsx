import type { ActionFunction } from '@remix-run/node'
import { errorHandler } from '~/utills/response/errorHandler'
import { userController } from '~/server/user/user.controller'

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = Object.fromEntries(await request.formData()) as any
    return await userController.verifyLogin(formData.phone, formData.password)
  } catch (error) {
    return errorHandler(error)
  }
}
