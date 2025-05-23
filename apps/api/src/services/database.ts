import Database from 'better-sqlite3';
import type { Event, PushToken } from '@recipe-scheduler/shared-types';

const db = new Database('recipe-scheduler.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    title TEXT NOT NULL,
    eventTime TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS push_tokens (
    userId TEXT PRIMARY KEY,
    token TEXT NOT NULL
  );
`);

export const eventsDb = {
  create: (event: Event) => {
    const stmt = db.prepare('INSERT INTO events (id, userId, title, eventTime, createdAt) VALUES (?, ?, ?, ?, ?)');
    stmt.run(event.id, event.userId, event.title, event.eventTime, event.createdAt);
    return event;
  },
  
  findByUserId: (userId: string): Event[] => {
    const stmt = db.prepare('SELECT * FROM events WHERE userId = ? ORDER BY eventTime ASC');
    return stmt.all(userId) as Event[];
  },
  
  findById: (id: string): Event | undefined => {
    const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
    return stmt.get(id) as Event | undefined;
  },
  
  update: (id: string, updates: Partial<Event>) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    const stmt = db.prepare(`UPDATE events SET ${fields} WHERE id = ?`);
    stmt.run(...values, id);
  },
  
  delete: (id: string) => {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    stmt.run(id);
  }
};

export const pushTokensDb = {
  upsert: (userId: string, token: string) => {
    const stmt = db.prepare('INSERT OR REPLACE INTO push_tokens (userId, token) VALUES (?, ?)');
    stmt.run(userId, token);
  },
  
  findByUserId: (userId: string): string | undefined => {
    const stmt = db.prepare('SELECT token FROM push_tokens WHERE userId = ?');
    const result = stmt.get(userId) as { token: string } | undefined;
    return result?.token;
  }
};