import type { Payment } from '@prisma/client'
import { prisma } from '~/utills/prisma.server'

const getAll = async () => {
  return await prisma.payment.findMany()
}
const getById = async () => {}

const create = async (
  orderId: Payment['orderId'],
  amount: Payment['amount']
) => {
  return await prisma.payment.create({
    data: {
      orderId: orderId,
      amount: amount,
    },
  })
}
const update = async () => {}
const softDelete = async () => {}

export const paymentServices = {
  getAll,
  getById,
  create,
  update,
  softDelete,
}
