import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'

let dbInstance: ReturnType<typeof drizzle> | null = null

export function getDb(binding: D1Database) {
  if (!dbInstance) {
    dbInstance = drizzle(binding)
  }
  return dbInstance
}

const db = getDb(env.DB)
export default db
