import type { Category } from '@prisma/client'
import { prisma } from '~/utills/prisma.server'

const getAll = async () => {
  return await prisma.category.findMany()
}
const getById = async (id: Category['id']) => {
  return await prisma.category.findUnique({
    where: {
      id,
    },
  })
}
const create = async (categoryData: Category) => {
  return await prisma.category.create({
    data: categoryData,
  })
}
const update = async () => {}
const softDelete = async () => {}

export const categoryServices = {
  getAll,
  getById,
  create,
  update,
  softDelete,
}
