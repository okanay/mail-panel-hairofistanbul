import db from '@/api/db'
import { userAuthTokenTable, userTable } from '@/api/db/schema/users'
import { createMiddleware } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/router-core'
import { and, eq, gt } from 'drizzle-orm'
import {
  clearAuthCookies,
  createAccessToken,
  setAuthCookies,
  verifyAccessToken,
} from '../libs/auth'

export const authMiddleware = createMiddleware()
  .middleware([])
  .server(async ({ next }) => {
    try {
      const accessTokenCookie = getCookie(process.env.APP_AUTH_COOKIE_ACCESS)
      const refreshTokenCookie = getCookie(process.env.APP_AUTH_COOKIE_REFRESH)

      if (accessTokenCookie) {
        const userPayload = await verifyAccessToken(accessTokenCookie)
        if (userPayload) {
          return next({
            context: {
              user: userPayload,
              token: null as typeof userAuthTokenTable.$inferSelect | null,
            },
          })
        }
      }

      if (refreshTokenCookie) {
        const result = await db
          .select({
            user: userTable,
            token: userAuthTokenTable,
          })
          .from(userAuthTokenTable)
          .innerJoin(userTable, eq(userAuthTokenTable.user_id, userTable.id))
          .where(
            and(
              eq(userAuthTokenTable.token, refreshTokenCookie),
              gt(userAuthTokenTable.expires_at, new Date()),
            ),
          )
          .get()

        if (result) {
          const newAccessToken = await createAccessToken(result.user)
          const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60
          setAuthCookies(newAccessToken, refreshTokenCookie, REFRESH_TOKEN_MAX_AGE)
          return next({
            context: {
              user: result.user,
              token: result.token,
            },
          })
        }
      }

      clearAuthCookies()
      throw redirect({ to: '/' })
    } catch {
      clearAuthCookies()
      throw redirect({ to: '/' })
    }
  })
