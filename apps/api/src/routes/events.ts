import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { CreateEventPayload, Event } from '@recipe-scheduler/shared-types';

const CreateEventSchema = z.object({
  title: z.string().min(1),
  eventTime: z.string().datetime()
});

// In-memory storage for now
const events: Event[] = [];
let eventIdCounter = 1;

export async function eventsRoutes(fastify: FastifyInstance) {
  // POST /events - Create event
  fastify.post<{ Body: CreateEventPayload }>('/events', async (request, reply) => {
    const validation = CreateEventSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.code(400).send({ error: validation.error.issues });
    }

    const { title, eventTime } = validation.data;
    const userId = request.headers['user-id'] as string || 'default-user';
    
    const event: Event = {
      id: eventIdCounter.toString(),
      userId,
      title,
      eventTime,
      createdAt: new Date().toISOString()
    };
    
    events.push(event);
    eventIdCounter++;
    
    // TODO: Queue reminder job here
    
    return reply.code(201).send(event);
  });

  // GET /events?userId= - List events
  fastify.get('/events', async (request, reply) => {
    const userId = (request.query as any).userId || 'default-user';
    const userEvents = events.filter(e => e.userId === userId);
    return reply.send(userEvents);
  });

  // PATCH /events/:id - Update event
  fastify.patch<{ Params: { id: string }, Body: Partial<CreateEventPayload> }>('/events/:id', async (request, reply) => {
    const eventIndex = events.findIndex(e => e.id === request.params.id);
    if (eventIndex === -1) {
      return reply.code(404).send({ error: 'Event not found' });
    }

    const updates = request.body;
    if (updates.title) events[eventIndex].title = updates.title;
    if (updates.eventTime) events[eventIndex].eventTime = updates.eventTime;

    return reply.send(events[eventIndex]);
  });

  // DELETE /events/:id - Delete event
  fastify.delete<{ Params: { id: string } }>('/events/:id', async (request, reply) => {
    const eventIndex = events.findIndex(e => e.id === request.params.id);
    if (eventIndex === -1) {
      return reply.code(404).send({ error: 'Event not found' });
    }

    events.splice(eventIndex, 1);
    return reply.code(204).send();
  });
}