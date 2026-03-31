# Microblogging Application - Complete Guide

A high-performance, feature-rich Twitter-like microblogging platform built with Node.js, Express, React, and SQLite.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Performance](#performance)
- [Security](#security)
- [Deployment](#deployment)

## ✨ Features

### User Management
- ✅ Create user accounts with email verification concepts
- ✅ Secure login/logout with JWT authentication
- ✅ View public user profiles
- ✅ Display user's post history

### Post Management
- ✅ Create short posts (max 280 characters)
- ✅ Global chronological feed
- ✅ Post timestamps and author information
- ✅ Like posts (with like counts)
- ✅ Reply to posts (one level deep)
- ✅ View replies under posts
- ✅ Reply counts on posts

### Feed & Timeline
- ✅ Real-time feed updates
- ✅ Pagination support
- ✅ Reverse chronological ordering
- ✅ Efficient database queries with indexes

### Security
- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication (7-day expiry)
- ✅ Input validation and sanitization
- ✅ SQL injection protection
- ✅ CORS configuration
- ✅ Rate limiting ready

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT + bcryptjs
- **Validation**: Joi
- **Logging**: Winston
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18+
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Routing**: React Router v6

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Backend Setup

```bash
cd microblog/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Initialize database
npm run db:init

# Seed database (optional)
npm run db:seed

# Start server
npm run dev
# Server runs on http://localhost:3001
```

### Frontend Setup

```bash
cd microblog/frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:3000
```

### Running Tests

```bash
# Backend tests
cd backend
npm test                 # Run all tests
npm run test:coverage   # Run with coverage report

# Frontend tests
cd frontend
npm test                # Run all tests
npm run test:coverage  # Run with coverage report
```

## 📡 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword"
}

Response: 201 Created
{
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepassword"
}

Response: 200 OK
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Logout successful"
}
```

### Posts

#### Get Feed
```http
GET /api/posts?limit=50&offset=0
Authorization: Bearer <token>

Response: 200 OK
{
  "posts": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "content": "Hello, World!",
      "like_count": 5,
      "reply_count": 2,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "limit": 50,
  "offset": 0
}
```

#### Create Post
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is my first post!"
}

Response: 201 Created
{
  "post": { ... }
}
```

#### Get Single Post
```http
GET /api/posts/:postId
Authorization: Bearer <token>

Response: 200 OK
{
  "post": { ... }
}
```

#### Get User Posts
```http
GET /api/posts/user/:userId?limit=50&offset=0
Authorization: Bearer <token>

Response: 200 OK
{
  "posts": [...],
  "limit": 50,
  "offset": 0
}
```

### Likes

#### Like Post
```http
POST /api/posts/:postId/likes
Authorization: Bearer <token>

Response: 201 Created
{
  "like": {
    "id": "uuid",
    "user_id": "uuid",
    "post_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Unlike Post
```http
DELETE /api/posts/:postId/likes
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true
}
```

### Replies

#### Get Post Replies
```http
GET /api/posts/:postId/replies?limit=50&offset=0
Authorization: Bearer <token>

Response: 200 OK
{
  "replies": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "post_id": "uuid",
      "content": "Great post!",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "limit": 50,
  "offset": 0
}
```

#### Create Reply
```http
POST /api/posts/:postId/replies
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great post!"
}

Response: 201 Created
{
  "reply": { ... }
}
```

### Users

#### Get User Profile
```http
GET /api/users/:username
Authorization: Bearer <token>

Response: 200 OK
{
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Get User Posts
```http
GET /api/users/:username/posts?limit=50&offset=0
Authorization: Bearer <token>

Response: 200 OK
{
  "posts": [...],
  "limit": 50,
  "offset": 0
}
```

## 📁 Project Structure

```
microblog/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express app setup
│   │   ├── server.js             # Server entry point
│   │   ├── config.js             # Configuration
│   │   ├── logger.js             # Winston logger setup
│   │   ├── database.js           # SQLite initialization
│   │   ├── dao/                  # Data Access Objects
│   │   │   ├── UserDAO.js
│   │   │   ├── PostDAO.js
│   │   │   ├── LikeDAO.js
│   │   │   └── ReplyDAO.js
│   │   ├── services/             # Business logic
│   │   │   ├── AuthService.js
│   │   │   ├── PostService.js
│   │   │   ├── LikeService.js
│   │   │   └── ReplyService.js
│   │   ├── routes/               # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── postRoutes.js
│   │   │   ├── likeRoutes.js
│   │   │   ├── replyRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── middleware/           # Express middleware
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── logging.js
│   │   └── utils/                # Utilities
│   │       ├── validators.js
│   │       └── errors.js
│   ├── tests/                    # Test files
│   │   ├── auth.test.js
│   │   ├── posts.test.js
│   │   ├── likes.test.js
│   │   └── replies.test.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx              # React entry point
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── store.js              # Redux store
│   │   ├── slices/               # Redux slices
│   │   │   ├── authSlice.js
│   │   │   └── feedSlice.js
│   │   ├── services/
│   │   │   └── api.js            # API client
│   │   └── components/
│   │       ├── Auth.jsx          # Login/Register
│   │       ├── Auth.css
│   │       ├── Feed.jsx          # Feed display
│   │       ├── Feed.css
│   │       ├── PostForm.jsx      # Post creation
│   │       ├── PostForm.css
│   │       ├── Post.jsx          # Post display
│   │       ├── Post.css
│   │       ├── Reply.jsx         # Reply display
│   │       └── Reply.css
│   ├── tests/                    # Test files
│   │   ├── auth.test.jsx
│   │   └── post.test.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── REQUIREMENTS.md               # Feature requirements
├── ARCHITECTURE.md              # Architecture docs
└── README.md                    # This file
```

## 🧪 Testing

### Backend Test Coverage

- **Auth Tests**: Registration, login, validation
- **Post Tests**: Creation, retrieval, pagination
- **Like Tests**: Like/unlike, counts
- **Reply Tests**: Creation, retrieval, counts

Run coverage:
```bash
cd backend
npm run test:coverage
```

### Frontend Test Coverage

- **Auth Components**: Login/Register forms
- **Post Component**: Display and interactions
- **Redux Slices**: State management

Run coverage:
```bash
cd frontend
npm run test:coverage
```

## ⚡ Performance

### Database Optimization
- **Indexes**: Created on frequently queried columns
  - `users.username` (fast username lookups)
  - `posts.user_id` (user post retrieval)
  - `posts.created_at` (chronological feed)
  - `likes.user_id`, `likes.post_id` (like lookups)
  - `replies.post_id` (reply retrieval)

- **Denormalization**: Like and reply counts cached in posts table
- **Connection Pooling**: SQLite pragma optimization

### API Performance
- Response time target: < 200ms (p99)
- Pagination: Cursor-based with limits
- Efficient JSON serialization
- Gzip compression ready

### Frontend Performance
- Code splitting by route
- Component memoization
- Redux state optimization
- Lazy loading support

## 🔒 Security

### Authentication & Authorization
- JWT tokens with 7-day expiry
- Secure password hashing (bcryptjs, 10 rounds)
- Token validation on protected routes
- Automatic token refresh flow

### Input Validation
- Schema validation using Joi
- Username: 3-30 alphanumeric characters
- Email: Valid email format
- Password: Minimum 6 characters
- Post/Reply content: 1-280 characters

### Database Security
- Parameterized queries (prevents SQL injection)
- Foreign key constraints enabled
- Transaction support

### API Security
- CORS configuration
- Request size limits (10KB)
- Error messages don't leak sensitive info

## 📦 Deployment

### Production Build

#### Backend
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

#### Frontend
```bash
cd frontend
npm install --production
npm run build
# Serve dist/ directory
```

### Environment Variables

Create `.env` in backend root:
```
NODE_ENV=production
PORT=3001
DATABASE_URL=/data/microblog.db
JWT_SECRET=your-secure-random-secret-key-here
JWT_EXPIRY=7d
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
```

### Docker Deployment

Create `Dockerfile` for backend:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/src ./src
EXPOSE 3001
CMD ["node", "src/server.js"]
```

### Database Migration

```bash
npm run db:init  # Create tables and indexes
npm run db:seed  # Optional: add seed data
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Ensure tests pass: `npm test`
5. Submit a pull request

## 📄 License

MIT License

## 🆘 Troubleshooting

### Backend won't start
- Check Node.js version: `node --version` (should be 18+)
- Verify database file permissions
- Check port 3001 is not in use

### Frontend won't connect to backend
- Ensure backend is running on port 3001
- Check CORS_ORIGIN in backend .env
- Verify proxy in vite.config.js

### Tests failing
- Clear node_modules and reinstall
- Check database file is writable
- Ensure ports 3001 and 3000 are available

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ for high-performance microblogging**
