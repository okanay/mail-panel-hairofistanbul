import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth'
import { eq } from 'drizzle-orm'
import { userTable, UserView } from '../db/schema/users'
import db from '../db'
import { hashPassword } from '../libs/password'

const updateProfileValidation = z.object({
  name: z.string().min(1, 'İsim zorunludur').max(100, 'İsim en fazla 100 karakter olabilir'),
  email: z.email('Geçerli bir email adresi giriniz').optional().or(z.literal('')),
  phone: z.string().max(20, 'Telefon en fazla 20 karakter olabilir').optional().or(z.literal('')),
  password: z
    .string({ message: 'Şifre gerekli' })
    .min(6, { message: 'Şifre en az 6 karakter olmalıdır' })
    .max(16, { message: 'Şifre en fazla 16 karakter olmalıdır' })
    .optional(),
})

interface UpdateProfileResponse {
  success: boolean
  data?: UserView
  error?: string
  details?: any
}

export const updateProfileServerFn = createServerFn()
  .inputValidator(updateProfileValidation)
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<UpdateProfileResponse> => {
    try {
      const updateData: Partial<typeof userTable.$inferInsert> = {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
      }

      if (data.password) {
        const hashedPassword = await hashPassword(data.password)
        updateData.password = hashedPassword
      }

      // Kullanıcı bilgilerini güncelle
      const updatedUser = await db
        .update(userTable)
        .set(updateData)
        .where(eq(userTable.id, context.user.id))
        .returning({
          id: userTable.id,
          username: userTable.username,
          role: userTable.role,
          name: userTable.name,
          phone: userTable.phone,
          email: userTable.email,
        })
        .get()

      if (!updatedUser) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı',
        }
      }

      return {
        success: true,
        data: updatedUser,
      }
    } catch (error) {
      console.error('Error in updateProfileServerFn:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profil güncellenirken hata oluştu',
      }
    }
  })
