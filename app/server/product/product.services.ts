import type { Product } from '@prisma/client'
import { prisma } from '~/utills/prisma.server'

const getAll = async () => {
  return await prisma.product.findMany()
}
const getBulkByIds = async (ids: Product['id'][]) => {
  return await prisma.product.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  })
}
const getById = async (id: Product['id']) => {
  return await prisma.product.findUnique({
    where: {
      id,
    },
  })
}
const create = async (productData: Product) => {
  return await prisma.product.create({
    data: productData,
  })
}
const update = async (id: Product['id'], productData: Product) => {
  return await prisma.product.update({
    where: {
      id,
    },
    data: productData,
  })
}

const decreaseStock = async (id: Product['id'], quantity: number) => {
  return await prisma.product.update({
    where: { id },
    data: {
      stock: {
        decrement: quantity,
      },
    },
  })
}

const softDelete = async () => {}

export const productServices = {
  getAll,
  getBulkByIds,
  getById,
  create,
  update,
  decreaseStock,
  softDelete,
}
