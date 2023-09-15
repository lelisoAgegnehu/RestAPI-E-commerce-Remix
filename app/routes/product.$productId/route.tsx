import { json, type ActionFunction } from '@remix-run/node'
import { BadRequest, errorHandler } from '~/utills/response/errorHandler'
import { validate } from '~/utills/response/validate'
import { getUserId } from '~/utills/session.server'
import { productSchema } from '../product/productSchema'
import { productController } from '~/server/product/product.controller'

export const action: ActionFunction = async ({ request, params }) => {
  try {
    await getUserId(request)
    const method = request.method
    const productId = params.productId as string
    switch (method) {
      case 'PATCH': {
        const formData = Object.fromEntries(await request.formData())
        const { data } = validate(formData, productSchema.partial())
        const product = await productController.update(productId, data)
        return json(product, {
          status: 200,
        })
      }
      default: {
        throw new BadRequest('unsupport method')
      }
    }
  } catch (error) {
    return errorHandler(error)
  }
}
