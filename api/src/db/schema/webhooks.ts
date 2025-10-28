import { integer } from 'drizzle-orm/pg-core'
import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const webhooks = pgTable('webhooks', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  method: text('method').notNull(),
  ip: text('ip').notNull(),
  statusCode: integer().notNull().default(200),
  contentType: text(),
  contentLength: integer(),
  queryParameters: jsonb().$type<Record<string, string>>(),
  headers: jsonb().$type<Record<string, string>>().notNull(),
  body: text(),
  createdAt: timestamp().notNull().defaultNow(),
})
