import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: 3
});

export const reminderQueue = new Queue('reminder', { connection });

export const scheduleReminder = async (eventId: string, eventTime: string, title: string, userId: string) => {
  const eventDate = new Date(eventTime);
  const leadMinutes = Number(process.env.REMINDER_LEAD_MINUTES || '15');
  const reminderTime = new Date(eventDate.getTime() - (leadMinutes * 60 * 1000));
  
  const delay = reminderTime.getTime() - Date.now();
  
  if (delay > 0) {
    await reminderQueue.add(
      'send-reminder',
      { eventId, title, eventTime, userId },
      { delay }
    );
    console.log(`Scheduled reminder for event ${eventId} in ${delay}ms`);
  } else {
    console.log(`Event ${eventId} is in the past, skipping reminder`);
  }
};