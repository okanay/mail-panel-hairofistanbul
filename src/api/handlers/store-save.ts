import db from '@/api/db'
import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { documentStoreTable } from '../db/schema/store'
import { authMiddleware } from '../middlewares/auth'

const saveValidation = z.object({
  hash: z.string(),
  content: z.unknown(),
  language: z.string(),
})

export const saveStoreServerFn = createServerFn()
  .inputValidator(saveValidation)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    try {
      const updatedStore = await db
        .update(documentStoreTable)
        .set({
          content_json: data.content,
          language: data.language,
        })
        .where(
          and(
            eq(documentStoreTable.hash, data.hash),
            eq(documentStoreTable.author_id, context.user.id),
          ),
        )
        .returning()
        .get()

      if (!updatedStore) {
        return { success: false }
      }

      return { success: true, store: updatedStore }
    } catch (error) {
      console.log('Error in saveStoreServerFn:', error)
      return { success: false }
    }
  })
