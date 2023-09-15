import { categoryServices } from './category.services'
import type { Category } from '@prisma/client'

const getAll = async () => {
  return await categoryServices.getAll()
}
const getById = async () => {}

const create = async (categoryData: Category) => {
  return await categoryServices.create(categoryData)
}

const update = async () => {}
const deletecategory = async () => {}

export const categoryController = {
  getAll,
  getById,
  create,
  update,
  deletecategory,
}
