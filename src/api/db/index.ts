import { drizzle } from 'drizzle-orm/d1'
import { env } from 'cloudflare:workers'

const db = drizzle(env.DB)
export default db
