import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'

let dbInstance: ReturnType<typeof drizzle> | null = null
let instanceId = 0

export function getDb(binding: D1Database) {
  if (!dbInstance) {
    instanceId = Math.random()
    console.log('🆕 New Drizzle instance created:', instanceId)
    dbInstance = drizzle(binding)
  } else {
    console.log('♻️ Reusing instance:', instanceId)
  }
  return dbInstance
}

const db = getDb(env.DB)
export default db
