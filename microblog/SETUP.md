# Setup & Development Guide

Complete guide for setting up and developing the Microblog application.

## ✅ Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm 9+ (comes with Node.js)
- Git (optional)

Verify installation:
```bash
node --version  # v18+
npm --version   # 9+
```

## 📦 Installation

### 1. Backend Setup

```bash
cd microblog/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Initialize database (creates tables and indexes)
npm run db:init

# Start development server
npm run dev
# Backend available at http://localhost:3001
```

### 2. Frontend Setup

In a new terminal:

```bash
cd microblog/frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend available at http://localhost:3000
```

### 3. Verify Setup

✅ Backend running: `curl http://localhost:3001/health`
✅ Frontend running: Open http://localhost:3000 in browser
✅ Database created: Check `microblog/backend/microblog.db`

## 🚀 First Steps

### Create an Account
1. Go to http://localhost:3000
2. Click "Sign up"
3. Enter username, email, password
4. Verify fields and submit

### Create a Post
1. Log in with your account
2. Type in the post form (max 280 characters)
3. Click "Post"
4. Your post appears at top of feed

### Interact with Posts
1. Like posts by clicking ❤️ button
2. Reply to posts by clicking 💬 button
3. Type reply and submit
4. View other users' posts in the feed

## 🧪 Running Tests

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 📊 Database Commands

```bash
cd backend

# Initialize database
npm run db:init

# Seed database with sample data
npm run db:seed

# View database file
# File located at: microblog/backend/microblog.db
```

## 🔧 Configuration

### Backend (.env)
```
NODE_ENV=development        # development or production
PORT=3001                   # Server port
DATABASE_URL=microblog.db   # Database file
JWT_SECRET=your-secret      # Change in production!
JWT_EXPIRY=7d              # Token expiry
LOG_LEVEL=debug            # Log verbosity
CORS_ORIGIN=http://localhost:3000
```

### Frontend (vite.config.js)
Already configured to proxy API calls to backend.

## 📈 Development Workflow

### File Structure
```
microblog/
├── backend/                 # Node.js + Express
│   ├── src/                # Source code
│   ├── tests/              # Test files
│   └── package.json
├── frontend/               # React + Vite
│   ├── src/               # Source code
│   ├── tests/             # Test files
│   └── package.json
└── README.md
```

### Hot Module Replacement (HMR)
- **Backend**: Changes reload automatically with `--watch` flag
- **Frontend**: Changes reflect instantly in browser

### Debugging

#### Backend
```bash
# Add logger calls in code
import logger from './logger.js';
logger.info('Message here');
logger.error('Error message');

# View logs
tail -f logs/all.log
```

#### Frontend
- Open DevTools (F12)
- Redux DevTools extension (recommended)
- Network tab for API calls
- Console for errors

## 🚀 Production Build

### Backend
```bash
cd backend
NODE_ENV=production npm run start
```

### Frontend
```bash
cd frontend
npm run build
# Output in dist/ directory
# Serve with: npx serve -s dist
```

## 📋 API Testing

### Using cURL

#### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "password":"password123"
  }'
```

#### Create Post (with token)
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content":"Hello, World!"
  }'
```

#### Get Feed
```bash
curl http://localhost:3001/api/posts?limit=10
```

## 🐛 Troubleshooting

### Issue: Port Already in Use
```bash
# Check what's using the port
# On macOS/Linux:
lsof -i :3001
# On Windows:
netstat -ano | findstr :3001

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Issue: Database Locked
```bash
# Delete and recreate database
cd backend
rm microblog.db
npm run db:init
```

### Issue: Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Token Errors
- Clear browser localStorage: DevTools → Application → Local Storage → Clear
- Re-login to get new token
- Check JWT_SECRET in .env (must be consistent)

## 📊 Performance Monitoring

### Backend Response Times
```bash
# Check logs for timing information
tail -f logs/all.log | grep "ms"

# Example output:
# INFO: GET /api/posts - 200 - 45ms
# INFO: POST /api/posts - 201 - 78ms
```

### Frontend Performance
- Open DevTools → Performance tab
- Record interactions
- Analyze component render times

## 🔐 Security Notes

1. **Change JWT_SECRET in production** - Generate strong secret
2. **Use HTTPS in production** - Not just HTTP
3. **Store passwords securely** - bcryptjs hashing enabled
4. **Validate all inputs** - Joi schema validation
5. **Enable CORS properly** - Whitelist specific origins

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

## 🎯 Next Steps

1. ✅ Complete setup
2. ✅ Run tests to verify everything works
3. ✅ Create test account and post
4. ✅ Explore the codebase
5. ✅ Make your first changes
6. ✅ Deploy to production (optional)

## 💡 Tips

- Use `npm run dev` for both backend and frontend
- Keep separate terminals for each service
- Check logs first when debugging
- Run tests after making changes
- Commit frequently with clear messages

---

**Happy coding! 🎉**
