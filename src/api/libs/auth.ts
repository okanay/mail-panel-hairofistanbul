import z from 'zod'
import { setCookie } from '@tanstack/react-start/server'
import { UserView } from '../db/schema/users'

export const authValidation = z.object({
  username: z
    .string({ message: 'Kullanıcı adı gerekli' })
    .min(3, { message: 'Kullanıcı adı en az 3 karakter olmalıdır' })
    .max(20, { message: 'Kullanıcı adı en fazla 20 karakter olmalıdır' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Kullanıcı adı sadece harfler, sayılar ve alt çizgiler içerebilir',
    }),
  password: z
    .string({ message: 'Şifre gerekli' })
    .min(6, { message: 'Şifre en az 6 karakter olmalıdır' })
    .max(16, { message: 'Şifre en fazla 16 karakter olmalıdır' }),
})

async function getKey() {
  const secret = process.env.APP_AUTH_COOKIE_SECRET
  const enc = new TextEncoder()
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

export async function createAccessToken(userView: UserView) {
  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' })
  const payload = JSON.stringify({
    ...userView,
    exp: Math.floor(Date.now() / 1000) + 15 * 60,
  })

  const base64UrlEncode = (str: string) =>
    btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  const encodedHeader = base64UrlEncode(header)
  const encodedPayload = base64UrlEncode(payload)

  const key = await getKey()
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
  )

  const encodedSignature = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)))
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
}

export async function verifyAccessToken(token: string): Promise<UserView | null> {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.')
    if (!encodedHeader || !encodedPayload || !encodedSignature) return null

    const key = await getKey()
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
    )

    const base64UrlEncode = (str: string) =>
      btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

    const calculatedSignature = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)))

    if (calculatedSignature !== encodedSignature) return null

    const payload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')))

    if (payload.exp && Date.now() >= payload.exp * 1000) return null

    const { exp, ...user } = payload
    return user
  } catch (e) {
    return null
  }
}

export const setAuthCookies = (
  accessToken: string,
  refreshToken: string,
  refreshMaxAge: number,
) => {
  setCookie(process.env.APP_AUTH_COOKIE_ACCESS, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 30 * 60,
    domain: process.env.APP_DOMAIN,
    path: '/',
  })

  setCookie(process.env.APP_AUTH_COOKIE_REFRESH, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: refreshMaxAge,
    domain: process.env.APP_DOMAIN,
    path: '/',
  })
}

export const clearAuthCookies = () => {
  setCookie(process.env.APP_AUTH_COOKIE_ACCESS, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    domain: process.env.APP_DOMAIN,
    path: '/',
  })
  setCookie(process.env.APP_AUTH_COOKIE_REFRESH, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    domain: process.env.APP_DOMAIN,
    path: '/',
  })
}
