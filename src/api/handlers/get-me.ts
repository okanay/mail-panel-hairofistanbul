import db from '@/api/db'
import { extractUserView, userAuthTokenTable, userTable } from '@/api/db/schema/users'
import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { and, eq, gt } from 'drizzle-orm'
import { verifyAccessToken, createAccessToken, setAuthCookies } from '../libs/auth'

export const getMeByToken = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const accessToken = getCookie(process.env.APP_AUTH_COOKIE_ACCESS)
    const refreshToken = getCookie(process.env.APP_AUTH_COOKIE_REFRESH)

    // 1. Access Token ile doğrulama
    if (accessToken) {
      const userPayload = await verifyAccessToken(accessToken)
      if (userPayload) {
        return { user: userPayload }
      }
    }

    // 2. Refresh Token ile doğrulama ve yeni Access Token oluşturma
    if (refreshToken) {
      const result = await db
        .select({
          user: userTable,
          token: userAuthTokenTable,
        })
        .from(userAuthTokenTable)
        .innerJoin(userTable, eq(userAuthTokenTable.user_id, userTable.id))
        .where(
          and(
            eq(userAuthTokenTable.token, refreshToken),
            gt(userAuthTokenTable.expires_at, new Date()),
          ),
        )
        .get()

      if (result) {
        const newAccessToken = await createAccessToken(extractUserView(result.user))
        const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60
        setAuthCookies(newAccessToken, refreshToken, REFRESH_TOKEN_MAX_AGE)

        return { user: extractUserView(result.user) }
      }
    }

    return { user: null }
  } catch {
    return { user: null }
  }
})
