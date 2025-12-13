import db from '@/api/db'
import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq } from 'drizzle-orm'
import z from 'zod'
import { DocumentStore, documentStoreTable } from '../db/schema/store'
import { authMiddleware } from '../middlewares/auth'

const validation = z.object({
  hash: z.string(),
})

export const getStoreServerFn = createServerFn()
  .inputValidator(validation)
  .handler(async ({ data }) => {
    try {
      const store = await db
        .select()
        .from(documentStoreTable)
        .where(and(eq(documentStoreTable.hash, data.hash)))
        .get()

      if (!store) {
        return { success: false }
      }

      return { success: true, store: store }
    } catch (error) {
      console.log('Error in getStoreServerFn:', error)
      return { success: false }
    }
  })

const getDocumentHistoryValidation = z.object({
  limit: z.number().min(1).max(50).default(20),
  cursor: z.number().optional(),
})

type DocumentHistoryItem = Omit<DocumentStore, 'content_json' | 'author_id'>

interface GetDocumentHistoryResponse {
  success: boolean
  data?: {
    items: DocumentHistoryItem[]
    nextCursor: number | null
  }
  error?: string
}

export const getDocumentHistoryServerFn = createServerFn()
  .inputValidator(getDocumentHistoryValidation)
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<GetDocumentHistoryResponse> => {
    try {
      const userId = context.user.id

      // Cursor-based pagination
      const items = await db
        .select({
          id: documentStoreTable.id,
          hash: documentStoreTable.hash,
          title: documentStoreTable.title,
          description: documentStoreTable.description,
          language: documentStoreTable.language,
          content_type: documentStoreTable.content_type,
          email_meta: documentStoreTable.email_meta,
          created_at: documentStoreTable.created_at,
          updated_at: documentStoreTable.updated_at,
        })
        .from(documentStoreTable)
        .where(eq(documentStoreTable.author_id, userId))
        .orderBy(desc(documentStoreTable.created_at))
        .limit(data.limit + 1)
        .offset(data.cursor || 0)

      const hasMore = items.length > data.limit
      const resultItems = hasMore ? items.slice(0, data.limit) : items
      const nextCursor = hasMore ? (data.cursor || 0) + data.limit : null

      return {
        success: true,
        data: {
          items: resultItems,
          nextCursor,
        },
      }
    } catch (error) {
      console.error('Error in getDocumentHistoryServerFn:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  })
