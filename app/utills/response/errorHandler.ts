//@ts-nocheck
import { ForbiddenError } from '@casl/ability'
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library'
import { json } from '@remix-run/node'
import { Response } from './response'

/**
 *
 * @description Custom Errors
 * @returns custom response from error handler
 * @params error : Name of error
 * @params message :Message relate to the error
 */

export type customErrorT = {
  error?: string
  message?: string
  status?: number
  fieldError?: object
  field?: any
}

export class NotFound {
  constructor(message?: string) {
    this.message = message
  }
  error() {
    return {
      message: this.message,
    }
  }
}

export class BadRequest {
  constructor(message?: string) {
    this.message = message
  }
  error() {
    return {
      message: this.message,
    }
  }
}

export class Forbidden {
  constructor(message?: string) {
    this.message = message
  }
  error() {
    return {
      message: this.message,
    }
  }
}

export class Unprocessable {
  constructor(message?: string, fieldError?: any, field?: any) {
    this.message = message
    this.fieldError = fieldError
    this.field = field
  }
  error() {
    return {
      message: this.message,
      fieldError: this.fieldError,
      field: this.field,
    }
  }
}

export class Unauthorized {
  constructor(message?: string) {
    this.message = message
  }
  error() {
    return {
      message: this.message,
    }
  }
}

export default class CustomErr {
  constructor(
    error: 'UNKNOWN_ROUTE' | 'CUSTOME' | 'VALIDATION',
    message: string,
    status: 200 | 201 | 400 | 401 | 403 | 422 | 500,
    fieldError?: object,
    field?: any
  ) {
    this.error = error
    this.message = message
    this.status = status
    this.fieldError = fieldError
    this.field = field
  }
  getAllErrors() {
    return {
      error: this.error,
      message: this.message,
      status: this.status,
      fieldError: this.fieldError,
      field: this.field,
    }
  }
}

export const errorHandler = (err: any) => {
  console.log({ err })
  if (err.status === 302) {
    return err
  }
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return json(
        Response({
          message: `${err.meta.target.join(',')} already exists.`,
        }),
        { status: 422 }
      )
    }
    if (err.code === 'P2011') {
      return json(
        Response({
          message: `Empty value invalid input ${err.meta.target.join(',')}`,
        }),
        { status: 422 }
      )
    }
    if (err.code === 'P2009') {
      return json(
        Response({
          message: 'Prisma query validation error',
        }),
        { status: 422 }
      )
    }
  }
  if (err instanceof PrismaClientValidationError) {
    return json(
      Response({
        message: `Input validation failed ${err?.meta?.target?.join(',')}`,
      }),
      { status: 422 }
    )
  }
  if (err instanceof PrismaClientInitializationError) {
    if (
      err.errorCode === 'P1001' ||
      err.errorCode === 'P1002' ||
      err.errorCode === 'P1017'
    ) {
      return json(
        Response({
          message: `Could not connect with db server, please check you connection ${err?.meta?.target?.join(
            ','
          )}`,
        }),
        { status: 422 }
      )
    }
  }
  if (err instanceof PrismaClientUnknownRequestError) {
    return json(
      Response({
        message: `'Better restart the app ${err?.meta?.target?.join(',')}`,
      }),
      { status: 500 }
    )
  }
  //Casl Error
  if (err instanceof ForbiddenError) {
    const newMessage = err.message
      .replace(' excute "', ' ')
      .replace('" on "', ' ')
      .replace('"', '')
      .replace('read', 'view')
    return json(
      Response({
        message: newMessage,
      }),
      { status: 403 }
    )
  }

  if (err instanceof BadRequest) {
    const badRequest = new BadRequest(err)
    const message = badRequest.error().message
    return json(
      Response({
        message: message || 'BadRequest',
      }),
      {
        status: 400,
      }
    )
  }

  if (err instanceof Forbidden) {
    const forbidden = new Forbidden(err)
    const message = forbidden.error().message
    return json(
      Response({
        message: message || 'Forbidden',
      }),
      {
        status: 403,
      }
    )
  }

  if (err instanceof Unauthorized) {
    const unauthorized = new Unauthorized(err)
    const message = unauthorized.error().message
    return json(
      Response({
        message: message || 'Unauthorized',
      }),
      {
        status: 401,
      }
    )
  }

  if (err instanceof NotFound) {
    const notFound = new NotFound(err)
    const message = notFound.error().message
    return json(
      Response({
        message: message || 'Not Found',
      }),
      {
        status: 404,
      }
    )
  }

  if (err instanceof Unprocessable) {
    const unprocessable = new Unprocessable(err)
    const { message, field, fieldError } = unprocessable.error()
    return json(
      Response({
        message: message || 'Validation Error',
        error: {
          error: {
            fieldError,
            field,
          },
        },
      }),
      {
        status: 422,
      }
    )
  }

  //Unknown Error
  if (err.name === 'Error') {
    return json(
      Response({ message: err?.message || 'Something went wrong !!' }),
      {
        status: 500,
      }
    )
  }
  if (err.name === 'TypeError') {
    return json(
      Response({ message: err?.message || 'Something went wrong !!' }),
      {
        status: 500,
      }
    )
  }

  if (err) {
    return json(
      Response({
        message: err?.message,
      }),
      { status: err.status }
    )
  }
}