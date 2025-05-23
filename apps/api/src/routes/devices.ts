import { FastifyInstance } from 'fastify';
import { z } from 'zod';

const DeviceTokenSchema = z.object({
  token: z.string().min(1)
});

// In-memory storage
const pushTokens: { userId: string; token: string }[] = [];

export async function devicesRoutes(fastify: FastifyInstance) {
  // POST /devices - Register push token
  fastify.post('/devices', async (request, reply) => {
    const validation = DeviceTokenSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.code(400).send({ error: validation.error.issues });
    }

    const userId = request.headers['user-id'] as string || 'default-user';
    const { token } = validation.data;

    // Remove existing token for this user
    const existingIndex = pushTokens.findIndex(pt => pt.userId === userId);
    if (existingIndex !== -1) {
      pushTokens.splice(existingIndex, 1);
    }

    pushTokens.push({ userId, token });
    return reply.code(201).send({ success: true });
  });
}