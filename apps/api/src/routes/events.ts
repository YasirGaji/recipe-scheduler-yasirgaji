import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { CreateEventPayload, Event } from '@recipe-scheduler/shared-types';
import { eventsDb } from '../services/database';
import { scheduleReminder } from '../services/queue';

const CreateEventSchema = z.object({
  title: z.string().min(1),
  eventTime: z.string().datetime(),
});

const UpdateEventSchema = z.object({
  title: z.string().min(1).optional(),
  eventTime: z.string().datetime().optional(),
});

let eventIdCounter = 1;

export async function eventsRoutes(fastify: FastifyInstance) {
  // POST /events - Create event
  fastify.post<{ Body: CreateEventPayload }>(
    '/events',
    async (request, reply) => {
      const validation = CreateEventSchema.safeParse(request.body);
      if (!validation.success) {
        return reply.code(400).send({ error: validation.error.issues });
      }

      const { title, eventTime } = validation.data;
      const userId = (request.headers['user-id'] as string) || 'default-user';

      const eventId = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const event: Event = {
        id: eventId,
        userId,
        title,
        eventTime,
        createdAt: new Date().toISOString(),
      };

      eventsDb.create(event);
      await scheduleReminder(
        event.id,
        event.eventTime,
        event.title,
        event.userId
      );
      // eventIdCounter++;

      return reply.code(201).send(event);
    }
  );

  // GET /events?userId= - List events
  fastify.get('/events', async (request) => {
    const userId =
      (request.query as { userId?: string }).userId || 'default-user';
    const userEvents = eventsDb.findByUserId(userId);
    return userEvents;
  });

  // PATCH /events/:id - Update event
  fastify.patch<{
    Params: { id: string };
    Body: { title?: string; eventTime?: string };
  }>('/events/:id', async (request, reply) => {
    const event = eventsDb.findById(request.params.id);
    if (!event) {
      return reply.code(404).send({ error: 'Event not found' });
    }

    const validation = UpdateEventSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.code(400).send({ error: validation.error.issues });
    }

    eventsDb.update(request.params.id, validation.data);

    const updatedEvent = eventsDb.findById(request.params.id);

    if (validation.data.eventTime) {
      await scheduleReminder(
        request.params.id,
        validation.data.eventTime,
        updatedEvent!.title,
        updatedEvent!.userId
      );
    }

    return updatedEvent;
  });

  // DELETE /events/:id - Delete event
  fastify.delete<{ Params: { id: string } }>(
    '/events/:id',
    async (request, reply) => {
      const event = eventsDb.findById(request.params.id);
      if (!event) {
        return reply.code(404).send({ error: 'Event not found' });
      }

      eventsDb.delete(request.params.id);
      return reply.code(204).send();
    }
  );
}
