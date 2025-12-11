import db from '@/api/db'
import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { documentStoreTable } from '../db/schema/store'
import { authMiddleware } from '../middlewares/auth'

const validation = z.object({
  hash: z.string(),
})

export const deleteStoreServerFn = createServerFn()
  .inputValidator(validation)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    try {
      const deletedStore = await db
        .delete(documentStoreTable)
        .where(
          and(
            eq(documentStoreTable.hash, data.hash),
            eq(documentStoreTable.author_id, context.user.id),
          ),
        )
        .returning()
        .get()

      return { success: true, store: deletedStore }
    } catch (error) {
      console.log('Error in deleteStoreServerFn:', error)
      return { success: false }
    }
  })
