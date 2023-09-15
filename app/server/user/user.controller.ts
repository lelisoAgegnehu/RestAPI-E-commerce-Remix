import type { User } from '@prisma/client'
import { userServices } from './user.services'
import { BadRequest, Forbidden } from '~/utills/response/errorHandler'
import bcrypt from 'bcryptjs'
import { signAccessToken } from '~/utills/jwt/auth'

const getAll = async () => {}
const getById = async () => {}

const verifyLogin = async (
  phone: User['phone'],
  password: User['password']
) => {
  const user = await userServices.getByPhone(phone)

  if (!user) {
    throw new BadRequest('Phone is not registered !')
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    throw new BadRequest('Invalid Password!')
  }

  const { password: _password, ...userWithoutPassword } = user
  const token = await signAccessToken(user.id)

  return { ...userWithoutPassword, token }
}

const create = async (userData: User) => {
  const isPhone = await userServices.getByPhone(userData.phone)
  if (isPhone) {
    throw new Forbidden('Phone already registerd !')
  }
  return await userServices.create(userData)
}

const update = async () => {}
const deleteUser = async () => {}

export const userController = {
  getAll,
  getById,
  create,
  update,
  deleteUser,
  verifyLogin,
}
