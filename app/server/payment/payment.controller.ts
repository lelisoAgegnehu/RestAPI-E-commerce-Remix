import { paymentServices } from './payment.services'

const getAll = async () => {
  return await paymentServices.getAll()
}
const getById = async () => {}

const create = async () => {}

const update = async () => {}
const deleteProduct = async () => {}

export const paymentController = {
  getAll,
  getById,
  create,
  update,
  deleteProduct,
}
