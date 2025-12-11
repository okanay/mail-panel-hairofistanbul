import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth'
import { eq } from 'drizzle-orm'
import { userTable, UserView } from '../db/schema/users'
import db from '../db'

const updateProfileValidation = z.object({
  name: z.string().min(1, 'İsim zorunludur').max(100, 'İsim en fazla 100 karakter olabilir'),
  email: z.email('Geçerli bir email adresi giriniz').optional().or(z.literal('')),
  phone: z.string().max(20, 'Telefon en fazla 20 karakter olabilir').optional().or(z.literal('')),
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
      const userId = context.user.id

      // Email benzersizlik kontrolü (eğer email değiştiriliyorsa)
      if (data.email && data.email !== context.user.email) {
        const existingUser = await db
          .select()
          .from(userTable)
          .where(eq(userTable.email, data.email))
          .get()

        if (existingUser) {
          return {
            success: false,
            error: 'Bu email adresi zaten kullanılıyor',
          }
        }
      }

      // Kullanıcı bilgilerini güncelle
      const updatedUser = await db
        .update(userTable)
        .set({
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
        })
        .where(eq(userTable.id, userId))
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
