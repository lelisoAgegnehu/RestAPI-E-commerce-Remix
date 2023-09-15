import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node'
import { errorHandler } from '~/utills/response/errorHandler'
import { validate } from '~/utills/response/validate'
import { getUserId } from '~/utills/session.server'
import { orderController } from '~/server/order/order.controller'
import { orderSchema } from '../order/orderSchema'

export const action: ActionFunction = async ({ request }) => {
  try {
    const userId = await getUserId(request)
    const formData = await request.json()
    const { data } = validate(formData, orderSchema)
    const order = await orderController.create(userId, data)
    return json(order, {
      status: 201,
    })
  } catch (error) {
    return errorHandler(error)
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    await getUserId(request)
    const order = await orderController.getAll()
    return json(order, { status: 200 })
  } catch (error) {
    return errorHandler(error)
  }
}
