import db from '@/api/db'
import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { documentStoreTable, emailMetaSchema } from '../db/schema/store'
import { authMiddleware } from '../middlewares/auth'

const editDocumentValidation = z.object({
  hash: z.string(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
})

export type EditNoteValidation = z.infer<typeof editDocumentValidation>

export const editDocumentServerFn = createServerFn()
  .inputValidator(editDocumentValidation)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    try {
      const userId = context.user.id

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

      const updateFields: { title?: string | null; description?: string | null; updated_at: Date } =
        { updated_at: new Date() }

      if (data.title !== null) {
        updateFields.title = data.title
      }

      if (data.description !== null) {
        updateFields.description = data.description
      }

      await db
        .update(documentStoreTable)
        .set(updateFields)
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

const updateEmailMetaValidation = z.object({
  hash: z.string(),
  emailMeta: emailMetaSchema,
})

export const updateEmailMetaServerFn = createServerFn()
  .inputValidator(updateEmailMetaValidation)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    try {
      const userId = context.user.id

      // Dokümanın kullanıcıya ait olup olmadığını kontrol et
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

      // Email meta güncelle
      await db
        .update(documentStoreTable)
        .set({
          email_meta: data.emailMeta,
          updated_at: new Date(),
        })
        .where(
          and(eq(documentStoreTable.hash, data.hash), eq(documentStoreTable.author_id, userId)),
        )

      return { success: true }
    } catch (error) {
      console.error('Error in updateEmailMetaServerFn:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      }
    }
  })
