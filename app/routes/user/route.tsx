// import type { ActionFunction } from '@remix-run/node'
// import { errorHandler } from '~/utills/response/errorHandler'
// import { validate } from '~/utills/response/validate'
// import { userSchema } from '../user._index/userSchema'
// import { userController } from '~/server/user/user.controller'

// export const action: ActionFunction = async ({ request }) => {
//   try {
//     const formData = Object.fromEntries(await request.formData())
//     const { data } = validate(formData, userSchema)
//     return await userController.create(data)
//   } catch (error) {
//     return errorHandler(error)
//   }
// }
