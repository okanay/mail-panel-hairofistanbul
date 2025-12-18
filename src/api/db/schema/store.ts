import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { userTable } from './users'
import { z } from 'zod'

// -------------------
// Document Store Table
// -------------------

export const emailMetaSchema = z.object({
  sent_at: z.number(),
  pdf_url: z.string(),
  email_address: z.string(),
  email_title: z.string(),
  email_description: z.string(),
})

export type StoreEmailMeta = z.infer<typeof emailMetaSchema>

export const documentStoreTable = sqliteTable(
  'document_store',
  {
    id: int().primaryKey({ autoIncrement: true }),
    author_id: int()
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    hash: text().notNull(),
    version: text().notNull(),
    title: text(),
    description: text(),
    language: text().notNull(),
    content_type: text().notNull(),
    content_json: text({ mode: 'json' }).$type<any>().notNull(),
    email_meta: text({ mode: 'json' }).$type<StoreEmailMeta | null>(),
    created_at: int({ mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updated_at: int({ mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => [index('hash_idx').on(table.hash)],
)

export type DocumentStore = typeof documentStoreTable.$inferSelect
export type InsetDocumentStore = typeof documentStoreTable.$inferInsert
