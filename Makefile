.PHONY: help install dev docker-up docker-down docker-logs clean test

# Default target
help:
	@echo "Recipe Scheduler - Available Commands"
	@echo "===================================="
	@echo "make install      - Install all dependencies"
	@echo "make dev          - Run all services locally"
	@echo "make docker-up    - Start services with Docker"
	@echo "make docker-down  - Stop Docker services"
	@echo "make docker-logs  - View Docker logs"
	@echo "make clean        - Clean build artifacts and dependencies"
	@echo "make test         - Run tests"

# Install dependencies
install:
	pnpm install

# Run services locally
dev:
	@chmod +x scripts/local-run.sh
	@./scripts/local-run.sh

# Docker commands
docker-up:
	@chmod +x scripts/docker-run.sh
	@./scripts/docker-run.sh

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-build:
	docker-compose build

# Clean
clean:
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules
	rm -rf apps/api/dist
	rm -rf apps/worker/dist
	rm -rf data/*.db

# Run tests
test:
	pnpm test