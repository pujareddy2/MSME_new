#!/bin/bash

# Hackathon Full Stack Startup Script for Mac/Linux
# This script starts both backend and frontend simultaneously

echo ""
echo "========================================"
echo "Hackathon Portal Full Stack Startup"
echo "========================================"
echo ""

# Check if running from correct directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "ERROR: Run this script from the Hackathon root directory (where backend/ and frontend/ folders are)"
    exit 1
fi

ROOT_DIR="$PWD"

# Check prerequisites
if ! command -v java &> /dev/null; then
    echo "ERROR: Java not found. Please install Java 21"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found. Please install Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "ERROR: npm not found. Please install npm"
    exit 1
fi

# Get database credentials
read -p "Enter MySQL username [root]: " DB_USERNAME
DB_USERNAME=${DB_USERNAME:-root}

read -sp "Enter MySQL password (press Enter if none): " DB_PASSWORD
echo ""

echo ""
echo "✓ Java found"
echo "✓ Node.js found"
echo "✓ npm found"
echo "✓ MySQL credentials set"
echo ""

# Set JAVA_HOME for Mac
if [[ "$OSTYPE" == "darwin"* ]]; then
    export JAVA_HOME=$(/usr/libexec/java_home -v 21)
fi

# Start backend
echo "Starting Backend on port 8080..."
cd "$ROOT_DIR/backend"
export DB_USERNAME="$DB_USERNAME"
export DB_PASSWORD="$DB_PASSWORD"

./mvnw spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "Starting Frontend on port 3000..."
cd "$ROOT_DIR/frontend"
export REACT_APP_API_BASE_URL="http://localhost:8080/api"

npm start &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Both services are starting..."
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:8080"
echo "API Base:  http://localhost:8080/api"
echo ""
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop services, run:"
echo "  kill $BACKEND_PID"
echo "  kill $FRONTEND_PID"
echo "========================================"
echo ""

# Keep script running
wait
