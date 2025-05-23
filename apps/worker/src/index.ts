import 'dotenv/config';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Expo } from 'expo-server-sdk';
import type { NotificationPayload } from '@recipe-scheduler/shared-types';

const connection = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: 3
});

const expo = new Expo();

// Mock push tokens storage - in real app would query database
const mockPushTokens: Record<string, string> = {};

const worker = new Worker('reminder', async (job) => {
  const { eventId, title, eventTime, userId } = job.data;
  
  console.log(`Processing reminder for event ${eventId}: ${title}`);
  
  // Get user's push token (mock for now)
  const pushToken = mockPushTokens[userId] || 'ExponentPushToken[mock-token]';
  
  if (!Expo.isExpoPushToken(pushToken)) {
    console.log(`Invalid push token for user ${userId}, logging notification`);
    console.log(`📱 NOTIFICATION: "${title}" reminder - Event at ${eventTime}`);
    return;
  }
  
  try {
    const messages = [{
      to: pushToken,
      sound: 'default',
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
    // Log to console as fallback
    console.log(`📱 NOTIFICATION: "${title}" reminder - Event at ${eventTime}`);
  }
}, { connection });

worker.on('completed', (job) => {
  console.log(`✅ Reminder job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.log(`❌ Reminder job ${job?.id} failed:`, err);
});

console.log('🔄 Reminder worker started');