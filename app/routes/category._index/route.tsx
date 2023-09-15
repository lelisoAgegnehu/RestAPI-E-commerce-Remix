import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node'
import { errorHandler } from '~/utills/response/errorHandler'
import { validate } from '~/utills/response/validate'
import { categoryController } from '~/server/category/category.controller'
import { categorySchema } from '../category/categorySchema'
import { getUserId } from '~/utills/session.server'

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = Object.fromEntries(await request.formData())
    const { data } = validate(formData, categorySchema)
    await getUserId(request)
    const category = await categoryController.create(data)
    return json(category, {
      status: 201,
    })
  } catch (error) {
    return errorHandler(error)
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    await getUserId(request)
    const category = await categoryController.getAll()
    return json(category, { status: 200 })
  } catch (error) {
    return errorHandler(error)
  }
}
