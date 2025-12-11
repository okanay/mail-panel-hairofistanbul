import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// -------------------
// Enums
// -------------------

export const userRoles = ['user', 'admin', 'guest'] as const
export type UserRole = (typeof userRoles)[number]

// -------------------
// Users Table
// -------------------

export const userTable = sqliteTable(
  'user',
  {
    id: int().primaryKey({ autoIncrement: true }),
    username: text().notNull().unique(),
    password: text().notNull(),
    role: text({ enum: userRoles }).notNull().default('admin'),
    name: text(),
    phone: text(),
    email: text(),
    created_at: int({ mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index('username_idx').on(table.username)],
)

export type User = typeof userTable.$inferSelect
export type UserView = Omit<User, 'password' | 'created_at'>
export type InsertUser = typeof userTable.$inferInsert

export const extractUserView = (user: typeof userTable.$inferSelect) => {
  const { password: _password, created_at: _created_at, ...userView } = user
  return userView
}

// -------------------
// Tokens Table
// -------------------

export const userAuthTokenTable = sqliteTable(
  'user_auth_token',
  {
    id: int().primaryKey({ autoIncrement: true }),
    user_id: int()
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    token: text().notNull().unique(),
    expires_at: int({ mode: 'timestamp' }).notNull(),
    created_at: int({ mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index('token_idx').on(table.token), index('user_id_idx').on(table.user_id)],
)

export type UserAuthToken = typeof userAuthTokenTable.$inferSelect
export type InsetUserAuthToken = typeof userAuthTokenTable.$inferInsert
