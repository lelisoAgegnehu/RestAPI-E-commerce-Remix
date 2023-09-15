import type { Product } from '@prisma/client'
import { productServices } from './product.services'

const getAll = async () => {
  return await productServices.getAll()
}
const getById = async () => {}

const create = async (productData: Product) => {
  return await productServices.create(productData)
}

const update = async (id: Product['id'], productData: Product) => {
  return await productServices.update(id, productData)
}
const deleteProduct = async () => {}

export const productController = {
  getAll,
  getById,
  create,
  update,
  deleteProduct,
}
