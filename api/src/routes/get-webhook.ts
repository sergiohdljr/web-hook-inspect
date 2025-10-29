import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createSelectSchema } from 'drizzle-zod'
import { webhooks } from '../db/schema'
import { db } from '@/db'
import { eq } from 'drizzle-orm'

export const getWebhook: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/webhooks/:id',
    {
      schema: {
        summary: 'Get webhook',
        tags: ['Webhooks'],
        params: z.object({
          id: z.uuidv7(),
        }),
        response: {
          200: createSelectSchema(webhooks),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const [webhook] = await db
        .select()
        .from(webhooks)
        .where(eq(webhooks.id, id))

      if (!webhook) {
        return reply.status(404).send({ error: 'Webhook not found' })
      }

      return webhook
    },
  )
}
