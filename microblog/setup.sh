#!/bin/bash

# Microblogging Application - Quick Start Script
# Run this script to set up and run the entire application

set -e

echo "🚀 Microblogging Application - Quick Start"
echo "==========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version) found${NC}"

# Backend setup
echo -e "\n${BLUE}Setting up backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env created (update if needed)${NC}"
fi

# Initialize database
echo "Initializing database..."
npm run db:init
echo -e "${GREEN}✓ Database initialized${NC}"

cd ..

# Frontend setup
echo -e "\n${BLUE}Setting up frontend...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

cd ..

echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo ""
echo "🚀 Start the application:"
echo "  Terminal 1 (Backend):"
echo "    cd backend && npm run dev"
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "📖 Documentation:"
echo "  - Setup guide: SETUP.md"
echo "  - Requirements: REQUIREMENTS.md"
echo "  - Architecture: ARCHITECTURE.md"
echo "  - API docs: README.md"
echo ""
echo "🧪 Run tests:"
echo "  cd backend && npm test"
echo "  cd frontend && npm test"
echo ""
echo "Happy coding! 🎉"
