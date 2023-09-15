import { json, type LoaderFunction } from '@remix-run/node'
import { paymentController } from '~/server/payment/payment.controller'
import { errorHandler } from '~/utills/response/errorHandler'
import { getUserId } from '~/utills/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  try {
    await getUserId(request)
    const order = await paymentController.getAll()
    return json(order, { status: 200 })
  } catch (error) {
    return errorHandler(error)
  }
}
