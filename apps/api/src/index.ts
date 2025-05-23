import Fastify from 'fastify';
import cors from '@fastify/cors';
import { eventsRoutes } from './routes/events';
import { devicesRoutes } from './routes/devices';

const server = Fastify({ logger: true });

server.register(cors, { origin: true });

// Health check
server.get('/', async () => {
  return { status: 'ok', message: 'Recipe Scheduler API' };
});

server.register(eventsRoutes, { prefix: '/api' });
server.register(devicesRoutes, { prefix: '/api' });

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('API server running on http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();