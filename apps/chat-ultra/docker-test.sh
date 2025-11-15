#!/bin/bash

# Docker Test Script for Chat Ultra
# This script helps you test the application with Docker

set -e

echo "🚀 Chat Ultra Docker Test Setup"
echo "================================"
echo ""

# Check if .env.docker exists
if [ ! -f .env.docker ]; then
    echo "⚠️  .env.docker file not found!"
    echo "📝 Creating .env.docker from example..."
    cp .env.docker.example .env.docker
    echo ""
    echo "⚠️  Please edit .env.docker and add your configuration values"
    echo "   Required:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - DATABASE_URL"
    echo "   - OPENAI_API_KEY"
    echo ""
    read -p "Press Enter after you've configured .env.docker..."
fi

echo "🔨 Building Docker image..."
docker-compose build

echo ""
echo "🚀 Starting containers..."
docker-compose up -d

echo ""
echo "✅ Application is starting!"
echo ""
echo "📊 View logs with: docker-compose logs -f"
echo "🛑 Stop with: docker-compose down"
echo ""
echo "🌐 Application will be available at: http://localhost:3000"
echo ""
echo "Waiting for application to be ready..."
sleep 5

# Check if container is running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Container is running!"
    echo ""
    echo "📋 Container status:"
    docker-compose ps
else
    echo "❌ Container failed to start. Check logs:"
    docker-compose logs
    exit 1
fi

