import { db } from '@/db'
import { webhooks } from '@/db/schema'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const captureWebhook: FastifyPluginAsyncZod = async (app) => {
  app.all(
    '/capture/*',
    {
      schema: {
        summary: 'Capture external webhooks',
        tags: ['External'],
        response: {
          200: z.object({
            id: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
       const method = request.method
       const ip = request.ip
       const contentType = request.headers['content-type']
       const contentLength = request.headers['content-length'] ? Number(request.headers['content-length']) : null
       const pathname = new URL(request.url).pathname.replace('/capture', '')

       let body: string | null = null
       if(request.body){
        body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body, null, 2)
       }

       const headers = Object.fromEntries(Object.entries(request.headers).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(',') : value || ''
       ]))

       const [{id}] = await db.insert(webhooks).values({
        method,
        ip,
        contentType,
        contentLength,
        pathname,
        headers,
        body,
       }).returning()

       return reply.status(200).send({id})
    })
}
