import type { Order, OrderItems, User } from '@prisma/client'
import { orderServices } from './order.services'
import { productServices } from '../product/product.services'
import { paymentServices } from '../payment/payment.services'

const getAll = async () => {
  return await orderServices.getAll()
}
const getById = async () => {}

const create = async (userId: User['id'], orderData: OrderItems[]) => {
  
  let availableProduct: string[] = []
  let totaAmount = 0
  const productIds = orderData.map((el) => el.productId)
  const products = await productServices.getBulkByIds(productIds)
  orderData.map((el) => {
    const product = products.find((e) => e.id === el.productId)
    const stock = Number(product?.stock)
    totaAmount += Number(product?.price) * el.quantity
    if (el.quantity > stock) {
      availableProduct.push(`${product?.name} is only available ${stock}`)
    }
  })

  if (availableProduct.length > 0) {
    return availableProduct
  }

  const order = await orderServices.create(userId, orderData)
  await Promise.all([
    paymentServices.create(order.id, totaAmount),
    order.orderList.map((el) =>
      productServices.decreaseStock(el.productId, el.quantity)
    ),
  ])
  return order
}

const update = async (id: Order['id'], orderData: Order) => {
  return await orderServices.update(id, orderData)
}
const deleteOrder = async () => {}

export const orderController = {
  getAll,
  getById,
  create,
  update,
  deleteOrder,
}
