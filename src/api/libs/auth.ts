import z from 'zod'
import { setCookie } from '@tanstack/react-start/server'
import { UserView } from '../db/schema/users'
import { SignJWT, jwtVerify } from 'jose'

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

const getSecretKey = () => new TextEncoder().encode(process.env.APP_AUTH_COOKIE_SECRET)

export async function createAccessToken(userView: UserView) {
  const secret = getSecretKey()

  // Jose kütüphanesi Türkçe, Rusça, Emoji ayırt etmeksizin her şeyi otomatik halleder.
  const jwt = await new SignJWT({ ...userView })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m') // 15 dakika
    .sign(secret)

  return jwt
}

export async function verifyAccessToken(token: string): Promise<UserView | null> {
  try {
    const secret = getSecretKey()

    // Token doğrulama ve decode işlemi
    const { payload } = await jwtVerify(token, secret)

    // payload içinde 'exp', 'iat' gibi JWT standart alanları da gelir, onları ayıklayabilirsin
    // veya doğrudan kullanabilirsin.
    const { exp, iat, ...user } = payload

    return user as unknown as UserView
  } catch (error) {
    // Token süresi dolmuşsa veya imza geçersizse buraya düşer
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
