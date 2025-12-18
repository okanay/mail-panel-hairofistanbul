import db from '@/api/db'
import { createServerFn } from '@tanstack/react-start'
import { uuidv7 } from 'uuidv7'
import { documentStoreTable } from '../db/schema/store'
import z from 'zod'
import { authMiddleware } from '../middlewares/auth'
import { and, eq } from 'drizzle-orm'

const createValidation = z.object({
  version: z.any(),
  language: z.any(),
  content_type: z.any(),
  content_json: z.any(),
})

export const storeCreateServerFn = createServerFn()
  .inputValidator(createValidation)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    try {
      const newHash = uuidv7()

      const newStore = await db
        .insert(documentStoreTable)
        .values({
          author_id: context.user.id,
          hash: newHash,
          version: data.version,
          language: data.language,
          content_type: data.content_type,
          content_json: data.content_json,
        })
        .returning()
        .get()

      return { success: true, store: newStore }
    } catch (error) {
      console.log('Error in createNewStoreServerFn:', error)
      return { success: false }
    }
  })

const saveValidation = z.object({
  hash: z.any(),
  content_json: z.any(),
  language: z.any(),
})

export const storeSaveServerFn = createServerFn()
  .inputValidator(saveValidation)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    try {
      const updatedStore = await db
        .update(documentStoreTable)
        .set({
          content_json: data.content_json,
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
