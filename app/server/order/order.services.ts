import type { Order, OrderItems, User } from '@prisma/client'
import { prisma } from '~/utills/prisma.server'

const getAll = async () => {
  return await prisma.order.findMany()
}
const getById = async (id: Order['id']) => {
  return await prisma.order.findUnique({
    where: {
      id,
    },
  })
}
const create = async (userId: User['id'], orderItems: OrderItems[]) => {
  return await prisma.order.create({
    data: {
      userId: userId,
      orderList: {
        createMany: {
          data: orderItems,
        },
      },
    },
    include: {
      orderList: true,
    },
  })
}
const update = async (id: Order['id'], orderData: Order) => {
  return await prisma.order.update({
    where: {
      id,
    },
    data: orderData,
  })
}
const softDelete = async () => {}

export const orderServices = {
  getAll,
  getById,
  create,
  update,
  softDelete,
}
