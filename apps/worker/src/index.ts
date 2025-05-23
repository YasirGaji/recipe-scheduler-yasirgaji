import 'dotenv/config';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Expo } from 'expo-server-sdk';
import Database from 'better-sqlite3';
import path from 'path';

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: 3
});

const expo = new Expo();

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '../../api/recipe-scheduler.db');
const db = new Database(dbPath);

const getPushToken = (userId: string): string | undefined => {
  const stmt = db.prepare('SELECT token FROM push_tokens WHERE userId = ?');
  const result = stmt.get(userId) as { token: string } | undefined;
  return result?.token;
};

const worker = new Worker('reminder', async (job) => {
  const { eventId, title, eventTime, userId } = job.data;
  
  console.log(`Processing reminder for event ${eventId}: ${title}`);
  
  const pushToken = getPushToken(userId);
  
  if (!pushToken) {
    console.log(`📱 NOTIFICATION (No push token): "${title}" reminder - Event at ${eventTime}`);
    return;
  }
  
  if (!Expo.isExpoPushToken(pushToken)) {
    console.log(`📱 NOTIFICATION (Invalid token): "${title}" reminder - Event at ${eventTime}`);
    return;
  }
  
  try {
    const messages = [{
      to: pushToken,
      sound: 'default' as const,
      title: 'Recipe Reminder',
      body: `Time to: ${title}`,
      data: { eventId, eventTime }
    }];
    
    const chunks = expo.chunkPushNotifications(messages);
    
    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log('Push notification sent:', ticketChunk);
    }
  } catch (error) {
    console.error('Failed to send push notification:', error);
    console.log(`📱 NOTIFICATION (Fallback): "${title}" reminder - Event at ${eventTime}`);
  }
}, { connection });

worker.on('completed', (job) => {
  console.log(`✅ Reminder job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.log(`❌ Reminder job ${job?.id} failed:`, err);
});

console.log('🔄 Reminder worker started');