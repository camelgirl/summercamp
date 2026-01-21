#!/bin/bash

# Graceful restart script for development server

echo "🛑 Stopping development server..."

# Find and kill processes on ports 3000 and 3001
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "   Stopping process on port 3000..."
    kill $(lsof -ti:3000) 2>/dev/null
    sleep 1
fi

if lsof -ti:3001 > /dev/null 2>&1; then
    echo "   Stopping process on port 3001..."
    kill $(lsof -ti:3001) 2>/dev/null
    sleep 1
fi

# Kill any remaining node/vite processes related to this project
pkill -f "vite.*summercamp" 2>/dev/null
pkill -f "node.*dev.*summercamp" 2>/dev/null

echo "✅ Server stopped"
echo ""
echo "🚀 Starting development server..."
echo ""

# Start the server
npm run dev
