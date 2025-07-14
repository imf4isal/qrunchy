#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest changes
echo "📡 Pulling latest code..."
git pull origin main

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if containers are running
echo "✅ Checking container status..."
docker-compose ps

echo "🎉 Deployment complete!"
echo "📱 Server should be available on port 3000"