import type { User } from '@prisma/client'
import { prisma } from '~/utills/prisma.server'
import bcrypt from 'bcryptjs'

const getAll = async () => {}
const getById = async (id: User['id']) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  })
}
const getByPhone = async (phone: string) => {
  return await prisma.user.findUnique({
    where: {
      phone,
    },
  })
}
const create = async (userData: User) => {
  userData.password = await bcrypt.hash(userData.password, 10)

  return await prisma.user.create({
    data: userData,
  })
}
const update = async () => {}
const softDelete = async () => {}

export const userServices = {
  getAll,
  getById,
  getByPhone,
  create,
  update,
  softDelete,
}
