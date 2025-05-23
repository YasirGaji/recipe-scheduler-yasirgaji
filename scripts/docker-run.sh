#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Recipe Scheduler - Docker Setup${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    echo -e "${YELLOW}📁 Creating data directory...${NC}"
    mkdir -p data
fi

# Check if .env file exists, if not copy from example
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    echo -e "${YELLOW}📋 Creating .env file from .env.example...${NC}"
    cp .env.example .env
fi

# Stop any running containers
echo -e "${YELLOW}🛑 Stopping any existing containers...${NC}"
docker-compose down

# Build and start containers
echo -e "${GREEN}🏗️  Building containers...${NC}"
docker-compose build

echo -e "${GREEN}🚀 Starting services...${NC}"
docker-compose up -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 5

# Check service status
echo -e "${GREEN}✅ Service Status:${NC}"
docker-compose ps

echo ""
echo -e "${GREEN}🎉 Recipe Scheduler is running!${NC}"
echo ""
echo -e "📱 API: http://localhost:3000"
echo -e "🔄 Worker: Running in background"
echo -e "📦 Redis: localhost:6379"
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo -e "  View logs: docker-compose logs -f"
echo -e "  Stop services: docker-compose down"
echo -e "  Restart services: docker-compose restart"
echo -e "  View API logs: docker-compose logs -f api"
echo -e "  View Worker logs: docker-compose logs -f worker"