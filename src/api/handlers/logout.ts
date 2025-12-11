import db from '@/api/db'
import { userAuthTokenTable } from '@/api/db/schema/users'
import { getCookie } from '@tanstack/react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { clearAuthCookies } from '../libs/auth'

export const logoutServerFn = createServerFn().handler(async () => {
  try {
    const refreshToken = getCookie(process.env.APP_AUTH_COOKIE_REFRESH)

    if (refreshToken) {
      await db.delete(userAuthTokenTable).where(eq(userAuthTokenTable.token, refreshToken))
    }

    clearAuthCookies()

    return { success: true, message: 'Çıkış başarılı' }
  } catch (error: any) {
    return { success: false, message: error.message || 'Sunucu Hatası' }
  }
})
