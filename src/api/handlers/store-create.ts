import db from '@/api/db'
import { createServerFn } from '@tanstack/react-start'
import { uuidv7 } from 'uuidv7'
import { documentStoreTable } from '../db/schema/store'
import z from 'zod'
import { authMiddleware } from '../middlewares/auth'

const saveValidation = z.object({
  language: z.any(),
  content_type: z.any(),
  content_json: z.any(),
})

export const createNewStoreServerFn = createServerFn()
  .inputValidator(saveValidation)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    try {
      const newHash = uuidv7()

      const newStore = await db
        .insert(documentStoreTable)
        .values({
          author_id: context.user.id,
          hash: newHash,
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
