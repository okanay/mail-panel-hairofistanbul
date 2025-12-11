import db from '@/api/db'
import { userTable } from '@/api/db/schema/users'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { authValidation } from '../libs/auth'
import { hashPassword } from '../libs/password'

export const registerServerFn = createServerFn()
  .inputValidator(authValidation)
  .handler(async ({ data }) => {
    try {
      const { username, password } = data

      const existingUser = await db
        .select()
        .from(userTable)
        .where(eq(userTable.username, username))
        .get()

      if (existingUser) {
        throw new Error('Kullanıcı zaten mevcut.')
      }

      // Hash the password
      const hashedPassword = await hashPassword(password)

      // Create the new user
      await db
        .insert(userTable)
        .values({
          username: username,
          password: hashedPassword,
          role: 'user',
          created_at: new Date(),
        })
        .returning({ id: userTable.id })

      return {
        success: true,
      }
    } catch (error: any) {
      return {
        success: false,
      }
    }
  })
