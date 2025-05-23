# Docker Setup Guide

## Overview

The Recipe Scheduler application can be run using Docker for easy deployment and consistent environments. This guide covers both Docker and local development setups.

## Prerequisites

### For Docker Setup

- Docker Desktop (includes Docker and Docker Compose)
- 4GB+ available RAM

### For Local Development

- Node.js 20+
- pnpm
- Redis server
- Android Studio / Xcode (for mobile development)

## Quick Start

### Using Docker (Recommended)

```bash
# 1. Make scripts executable (Unix/macOS)
chmod +x scripts/*.sh

# 2. Run with Docker
make docker-up
# or
./scripts/docker-run.sh
```

### Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Start Redis (if not running)
# macOS: brew services start redis
# Ubuntu: sudo systemctl start redis
# Windows: Use Docker or WSL

# 3. Run all services
make dev
# or
./scripts/local-run.sh    # Unix/macOS
./scripts/local-run.bat    # Windows
```

## Service Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Mobile App    │────▶│    API Server    │────▶│     Redis       │
│  (Expo/React    │     │   (Fastify)      │     │   (Queue)       │
│    Native)      │     │   Port: 3000     │     │   Port: 6379    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │                           │
                               ▼                           ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │     SQLite       │     │     Worker      │
                        │   (Database)     │     │   (BullMQ)      │
                        └──────────────────┘     └─────────────────┘
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Redis Configuration
REDIS_HOST=localhost      # Use 'redis' for Docker
REDIS_PORT=6379

# Database Configuration
DATABASE_PATH=./data/recipe-scheduler.db

# Reminder Configuration
REMINDER_LEAD_MINUTES=15
```

### Docker Compose Services

1. **redis**: Redis server for queue management
2. **api**: Fastify API server
3. **worker**: BullMQ worker for processing reminders

## File Updates Required

Before using Docker, update these files with the Docker-ready versions:

1. **apps/api/src/services/queue.ts** - Add Redis environment variables
2. **apps/api/src/services/database.ts** - Add database path configuration
3. **apps/worker/src/index.ts** - Add Redis and database path configuration

## Common Commands

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f worker

# Stop all services
docker-compose down

# Rebuild containers
docker-compose build

# Remove all data (careful!)
docker-compose down -v
```

### Make Commands

```bash
make help          # Show available commands
make install       # Install dependencies
make dev           # Run locally
make docker-up     # Start with Docker
make docker-down   # Stop Docker services
make docker-logs   # View Docker logs
make clean         # Clean build artifacts
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000      # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change the port in docker-compose.yml
```

### Redis Connection Failed

```bash
# Check if Redis is running
docker ps | grep redis

# Test Redis connection
redis-cli ping
```

### Database Access Issues

- Ensure the `data` directory exists and has proper permissions
- The SQLite database is shared between API and Worker via volume mount

### Mobile App Can't Connect to API

- Use `http://10.0.2.2:3000` for Android Emulator
- Use `http://localhost:3000` for iOS Simulator
- Use your machine's IP address for physical devices

## Production Considerations

1. **Database**: Consider migrating from SQLite to PostgreSQL for production
2. **Redis**: Use Redis persistence or a managed Redis service
3. **Secrets**: Use proper secret management (not .env files)
4. **Monitoring**: Add health checks and monitoring
5. **Scaling**: API and Worker can be scaled horizontally

## Development Workflow

1. **API Development**

   ```bash
   cd apps/api
   pnpm dev
   ```

2. **Worker Development**

   ```bash
   cd apps/worker
   pnpm dev
   ```

3. **Mobile Development**

   ```bash
   cd apps/mobile
   pnpm start
   ```

## Testing

Run tests for all services:

```bash
pnpm test
```

## Deployment

For production deployment:

1. Build production images:

   ```bash
   docker build -f docker/api.Dockerfile -t recipe-scheduler-api .
   docker build -f docker/worker.Dockerfile -t recipe-scheduler-worker .
   ```

2. Push to container registry
3. Deploy using your preferred orchestration tool (Kubernetes, ECS, etc.)

## Support

For issues or questions:

- Check the logs first: `docker-compose logs`
- Ensure all prerequisites are installed
- Verify environment variables are set correctly
