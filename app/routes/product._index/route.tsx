import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node'
import { errorHandler } from '~/utills/response/errorHandler'
import { validate } from '~/utills/response/validate'
import { getUserId } from '~/utills/session.server'
import { productSchema } from '../product/productSchema'
import { productController } from '~/server/product/product.controller'

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = Object.fromEntries(await request.formData())
    const { data } = validate(formData, productSchema)
    await getUserId(request)
    const product = await productController.create(data)
    return json(product, {
      status: 201,
    })
  } catch (error) {
    return errorHandler(error)
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    await getUserId(request)
    const product = await productController.getAll()
    return json(product, { status: 200 })
  } catch (error) {
    return errorHandler(error)
  }
}
