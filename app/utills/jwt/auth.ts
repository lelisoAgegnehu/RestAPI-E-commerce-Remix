/**
 * - This file is used to create Json Web Token for login.
 */

// jwt

import jwt from 'jsonwebtoken'

// http-errors

import createError from 'http-errors'

// jwt export generator

export const signAccessToken = (payload: any) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { payload },
      process.env.JWT_SECRET_KEY as any,
      {},
      (err: any, token: any) => {
        if (err) {
          reject(createError.InternalServerError())
        }
        resolve(token)
      }
    )
  })
}
export const verifyAccessToken = (token: any) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as any,
      (err: any, payload: any) => {
        if (err) {
          const message =
            err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message
          return reject(createError.Unauthorized(message))
        }

        resolve(payload)
      }
    )
  })
}
