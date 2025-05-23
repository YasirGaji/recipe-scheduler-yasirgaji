#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Recipe Scheduler - Local Development${NC}"
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed. Installing pnpm...${NC}"
    npm install -g pnpm
fi

# Check if Redis is running
if ! command -v redis-cli &> /dev/null; then
    echo -e "${RED}❌ Redis is not installed.${NC}"
    echo -e "${YELLOW}Please install Redis:${NC}"
    echo -e "  macOS: brew install redis"
    echo -e "  Ubuntu: sudo apt-get install redis-server"
    echo -e "  Or use Docker: docker run -d -p 6379:6379 redis"
    exit 1
fi

# Check if Redis is running
if ! redis-cli ping &> /dev/null; then
    echo -e "${YELLOW}⚠️  Redis is not running. Starting Redis...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start redis
    else
        echo -e "${RED}Please start Redis manually${NC}"
        exit 1
    fi
    sleep 2
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    pnpm install
fi

# Create data directory if it doesn't exist
if [ ! -d "apps/api/data" ]; then
    mkdir -p apps/api/data
fi

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping services...${NC}"
    kill $API_PID $WORKER_PID $MOBILE_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

echo -e "${GREEN}🏃 Starting services...${NC}"
echo ""

# Start API in background
echo -e "${BLUE}[API]${NC} Starting on port 3000..."
cd apps/api && pnpm dev &
API_PID=$!
cd ../..

# Wait for API to start
sleep 3

# Start Worker in background
echo -e "${BLUE}[WORKER]${NC} Starting reminder worker..."
cd apps/worker && pnpm dev &
WORKER_PID=$!
cd ../..

# Wait for Worker to start
sleep 2

# Start Mobile app
echo -e "${BLUE}[MOBILE]${NC} Starting Expo..."
cd apps/mobile && pnpm start &
MOBILE_PID=$!
cd ../..

echo ""
echo -e "${GREEN}✅ All services are running!${NC}"
echo ""
echo -e "📱 API: http://localhost:3000"
echo -e "🔄 Worker: Processing reminders"
echo -e "📲 Mobile: Expo DevTools"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Keep script running
while true; do
    sleep 1
done