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

      // Check if the user already exists
      const existingUser = await db
        .select()
        .from(userTable)
        .where(eq(userTable.username, username))
        .get()

      if (existingUser) {
        throw new Error('User already exists.')
      }

      // Hash the password
      const hashedPassword = await hashPassword(password)

      // Create the new user
      await db
        .insert(userTable)
        .values({
          username: username,
          password: hashedPassword,
          created_at: new Date(),
        })
        .returning({ id: userTable.id })

      return {
        success: true,
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      return {
        success: false,
      }
    }
  })
