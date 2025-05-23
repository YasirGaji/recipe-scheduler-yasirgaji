import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pushTokensDb } from '../services/database';

const DeviceTokenSchema = z.object({
  token: z.string().min(1)
});

export async function devicesRoutes(fastify: FastifyInstance) {
  // POST /devices - Register push token
  fastify.post('/devices', async (request, reply) => {
    const validation = DeviceTokenSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.code(400).send({ error: validation.error.issues });
    }

    const userId = request.headers['user-id'] as string || 'default-user';
    const { token } = validation.data;

    pushTokensDb.upsert(userId, token);
    return reply.code(201).send({ success: true });
  });
}