import db from '@/api/db'
import { extractUserView, userAuthTokenTable, userTable } from '@/api/db/schema/users'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { uuidv7 } from 'uuidv7'
import { authValidation, createAccessToken, setAuthCookies } from '../libs/auth'
import { verifyPassword } from '../libs/password'

const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 // 7 Gün

export const loginServerFn = createServerFn()
  .inputValidator(authValidation)
  .handler(async ({ data }) => {
    try {
      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.username, data.username))
        .get()

      if (!user || !(await verifyPassword(data.password, user.password))) {
        console.error('Invalid credentials provided.')
        throw new Error('Invalid credentials')
      }

      // 1. Refresh Token Oluştur (Veritabanı için)
      const refreshToken = uuidv7()
      const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000)

      await db.insert(userAuthTokenTable).values({
        user_id: user.id,
        token: refreshToken,
        expires_at: expiresAt,
        created_at: new Date(),
      })

      const accessToken = await createAccessToken(extractUserView(user))

      // 3. Cookie'leri set et
      setAuthCookies(accessToken, refreshToken, REFRESH_TOKEN_MAX_AGE)
      return { success: true }
    } catch (error: any) {
      return { success: false }
    }
  })
