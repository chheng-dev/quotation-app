import { cookies } from 'next/headers'

export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  })
}

export async function setRefreshTokenCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getCookies(name: string) {
  const cookieStore = await cookies()
  return cookieStore.get(name)?.value
}

export async function deleteCookies(name: string) {
  const cookieStore = await cookies()
  return cookieStore.delete(name)
}

export async function clearAuth() {
  await deleteCookies('accessToken')
  await deleteCookies('refreshToken')
}
