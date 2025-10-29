import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createSelectSchema } from 'drizzle-zod'
import { webhooks } from '../db/schema'
import { db } from '@/db'
import { eq } from 'drizzle-orm'

export const deleteWebhook: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/api/webhooks/:id',
    {
      schema: {
        summary: 'Delete webhook',
        tags: ['Webhooks'],
        params: z.object({
          id: z.uuidv7(),
        }),
        response: {
          200: z.void(),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const [webhook] = await db
        .delete(webhooks)
        .where(eq(webhooks.id, id))
        .returning()

      if (!webhook) {
        return reply.status(404).send({ error: 'Webhook not found' })
      }

      return reply.status(200).send()
    },
  )
}
