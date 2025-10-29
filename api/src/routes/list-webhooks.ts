import { db } from '@/db'
import { webhooks } from '@/db/schema'
import { asc, gt, lt } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/webhooks',
    {
      schema: {
        summary: 'List all webhooks',
        tags: ['Webhooks'],
        querystring: z.object({
          cursor: z.uuidv7().optional(),
          limit: z.coerce.number().min(1).max(100).default(20),
        }),
        response: {
          200: z.object({
            webhooks: z.array(
              createSelectSchema(webhooks).pick({
                id: true,
                method: true,
                pathname: true,
                createdAt: true,
              }),
            ),
            cursor: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { cursor, limit } = request.query

      const { id, pathname, createdAt, method } = webhooks

      const listOfWebhooks = await db
        .select({
          id,
          pathname,
          method,
          createdAt,
        })
        .from(webhooks)
        .limit(limit + 1)
        .where(cursor ? lt(id, cursor) : undefined)
        .orderBy(asc(id))

      const hasMore = listOfWebhooks.length > limit
      const items = hasMore ? listOfWebhooks.slice(0, limit) : listOfWebhooks

      const nextCursor = hasMore
        ? listOfWebhooks[listOfWebhooks.length - 1]?.id
        : null

      return reply.status(200).send({
        webhooks: items,
        cursor: nextCursor,
      })
    },
  )
}
