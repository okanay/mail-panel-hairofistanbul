import db from '@/api/db'
import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { documentStoreTable } from '../db/schema/store'
import { authMiddleware } from '../middlewares/auth'

const editDocumentValidation = z.object({
  hash: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
})

export const editDocumentServerFn = createServerFn()
  .inputValidator(editDocumentValidation)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    try {
      const userId = context.user.id

      // Önce dokümanın bu kullanıcıya ait olduğunu kontrol et
      const existingDoc = await db
        .select()
        .from(documentStoreTable)
        .where(
          and(eq(documentStoreTable.hash, data.hash), eq(documentStoreTable.author_id, userId)),
        )
        .get()

      if (!existingDoc) {
        return {
          success: false,
          error: 'Doküman bulunamadı veya yetkiniz yok',
        }
      }

      // Güncelleme yap
      await db
        .update(documentStoreTable)
        .set({
          title: data.title,
          description: data.description,
          updated_at: new Date(),
        })
        .where(
          and(eq(documentStoreTable.hash, data.hash), eq(documentStoreTable.author_id, userId)),
        )

      return { success: true }
    } catch (error) {
      console.error('Error in editDocumentServerFn:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      }
    }
  })
