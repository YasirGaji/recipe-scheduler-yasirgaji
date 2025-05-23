# Recipe-Scheduler-YasirGaji

A full-stack cooking event reminder system built with Node.js, React Native (Expo), Redis, and SQLite.

## 🎯 Features

- **Event Management**: Create, read, update, delete cooking events
- **Smart Reminders**: Automated push notifications 15 minutes before events
- **Mobile App**: Cross-platform React Native app with Expo
- **Queue System**: Redis + BullMQ for reliable reminder processing
- **Real-time**: Full-stack integration with persistent data

## 🏗️ Architecture

```
recipe-scheduler/
├── apps/
│   ├── api/           # Node.js + TypeScript backend
│   ├── worker/        # Queue worker service  
│   └── mobile/        # React Native (Expo)
├── packages/
│   ├── shared-types/  # Shared TypeScript types
│   └── config/        # Shared configs
└── docker/            # Docker configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Redis server
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Clone and install dependencies:**

```bash
git clone <repository-url>
cd recipe-scheduler
pnpm install
```

2. **Start Redis server:**

```bash
redis-server --port 6379
```

3. **Set up environment variables:**

```bash
# In apps/api/.env
REMINDER_LEAD_MINUTES=15
```

4. **Start the backend services:**

```bash
# Terminal 1: API Server
pnpm dev:api

# Terminal 2: Worker Service
pnpm dev:worker
```

5. **Start the mobile app:**

```bash
# Terminal 3: Mobile App
pnpm dev:mobile
```

## 📱 Mobile App Features

### ✅ Completed Features

- **Event List**: View all scheduled cooking events
- **Create Events**: Add new events with title and datetime
- **Delete Events**: Remove events from the list
- **API Integration**: Real-time sync with backend
- **Navigation**: Bottom tab navigation between screens
- **Notifications Screen**: Mock display for push notifications

### 🚧 In Progress

- **Date-Time Picker**: Native date/time selection
- **Detail View**: Edit existing events
- **Swipe to Delete**: Gesture-based deletion
- **Theme Toggle**: Light/Dark mode switching
- **Real Push Notifications**: Expo Push integration

## 🔧 Backend API

### Endpoints

**Events:**

- `GET /api/events` - List all events
- `POST /api/events` - Create new event
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

**Devices:**

- `POST /api/devices` - Register push token

### Request/Response Examples

**Create Event:**

```json
POST /api/events
{
  "title": "Bake sourdough bread",
  "eventTime": "2025-05-23T19:00:00.000Z"
}

Response:
{
  "id": "1747988369963-qr5r4qzbo",
  "userId": "default-user",
  "title": "Bake sourdough bread",
  "eventTime": "2025-05-23T19:00:00.000Z",
  "createdAt": "2025-05-23T08:19:29.963Z"
}
```

## ⚙️ Worker System

The worker service processes reminder jobs:

1. **Event Creation** → API schedules reminder job in Redis queue
2. **Job Processing** → Worker consumes job at scheduled time
3. **Push Notification** → Sends Expo push notification to user's device
4. **Fallback Logging** → Logs notification if push service unavailable

## 🗄️ Database Schema

**SQLite Tables:**

```sql
-- Events table
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  title TEXT NOT NULL,
  eventTime TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

-- Push tokens table
CREATE TABLE push_tokens (
  userId TEXT PRIMARY KEY,
  token TEXT NOT NULL
);
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Test specific service
pnpm test --filter @recipe-scheduler/api
```

## 📦 Production Deployment

### Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Environment Variables

```bash
# Production environment
NODE_ENV=production
REMINDER_LEAD_MINUTES=15
REDIS_URL=redis://localhost:6379
DATABASE_URL=file:./recipe-scheduler.db
```

## 🛠️ Tech Stack

**Backend:**

- Node.js + TypeScript
- Fastify (Web framework)
- SQLite + Better-SQLite3
- Redis + BullMQ (Queue system)
- Zod (Validation)

**Frontend:**

- React Native + Expo
- TypeScript
- React Navigation
- Expo Notifications

**DevOps:**

- Docker + Docker Compose
- pnpm Workspaces (Monorepo)
- Jest (Testing)

## 📝 Development Status

### ✅ Completed (2.1 Backend)

- REST API with CRUD operations
- SQLite database integration
- Input validation with Zod
- Push token registration
- Proper error handling

### ✅ Completed (2.2 Queue & Worker)

- Redis + BullMQ queue system
- Separate worker service
- Environment-based reminder timing
- Expo Push API integration
- Database integration for push tokens

### ✅ Completed (2.3 Frontend - Partial)

- Basic React Native app structure
- Event list view with delete
- Add event form (basic)
- Navigation system
- API integration
- Notifications screen (mock)

### 🚧 In Progress (2.3 Frontend - Remaining)

- Native date-time picker
- Event detail/edit view
- Swipe gesture support
- Theme toggle (light/dark)
- Real push notification handling

### ⏳ Pending

- **2.4 DevOps**: Docker configuration
- **2.5 Testing**: Jest test suites
- **2.6 Documentation**: Complete setup guide
