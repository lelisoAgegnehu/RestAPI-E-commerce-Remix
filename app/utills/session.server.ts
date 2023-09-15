import { createCookieSessionStorage, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { userServices } from '~/server/user/user.services'
import { verifyAccessToken } from './jwt/auth'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

const USER_SESSION_KEY = 'userId'

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

export const getUserId = async (request: Request) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-unused-expressions
  request.headers.get('Authorization') &&
    request.headers.get('Authorization')?.split(' ')[0] === 'Bearer'
  const token = request.headers.get('Authorization')?.split(' ')[1]

  const userId = (await verifyAccessToken(token)) as any
  if (userId) {
    return userId.payload
  } else {
    return null
  }
}

// export async function getUserId(
//   request: Request
// ): Promise<User['id'] | undefined> {
//   const session = await getSession(request)
//   const userId = session.get(USER_SESSION_KEY)
//   return userId
// }

export async function getUser(request: Request) {
  const userId = await getUserId(request)
  if (userId === undefined) return null

  const user = await userServices.getById(userId)
  if (user) return user

  throw await logout(request)
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request)
  if (!userId) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request)

  const user = await userServices.getById(userId)
  if (user) return user

  throw await logout(request)
}

export async function createUserSession({
  request,
  userId,
  redirectTo,
}: {
  request: Request
  userId: string
  redirectTo: string
}) {
  const session = await getSession(request)
  session.set(USER_SESSION_KEY, userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    },
  })
}

export async function logout(request: Request) {
  const session = await getSession(request)
  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}
