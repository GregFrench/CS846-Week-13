# Architecture Document

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (React)                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Components: Login, Feed, Profile, Post, Reply    │  │
│  │ State: Redux for global state, local for forms   │  │
│  │ Services: API client with auth middleware        │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST API
┌──────────────────┴──────────────────────────────────────┐
│              Backend (Node.js/Express)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ API Layer: Route handlers with validation        │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Service Layer: Business logic (User, Post, etc)  │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Data Layer: Database access objects (DAOs)       │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Middleware: Auth, logging, error handling        │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────┘
                   │ SQL Queries
┌──────────────────┴──────────────────────────────────────┐
│          SQLite/PostgreSQL Database                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Tables: users, posts, likes, replies             │  │
│  │ Indexes: PK, FK, created_at, user_id            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: better-sqlite3 / node-postgres
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Validation**: joi
- **Logging**: winston
- **Testing**: Jest, supertest
- **Build**: ESM with .mjs files

### Frontend
- **Framework**: React 18+
- **State Management**: Redux Toolkit
- **HTTP Client**: axios
- **Testing**: Vitest, React Testing Library
- **Build**: Vite
- **Styling**: CSS Modules

## Design Patterns

### Backend
1. **Service Layer Pattern**: Business logic separated from routes
2. **DAO Pattern**: Data access abstracted from services
3. **Middleware Chain**: Authentication, logging, error handling
4. **Repository Pattern**: Centralized data access
5. **Factory Pattern**: Object creation

### Frontend
1. **Container/Presentational Components**: Smart vs Dumb components
2. **Custom Hooks**: Reusable logic
3. **Controlled Components**: Form state management
4. **Context API**: Theme/auth context

## Performance Optimizations

### Database
- Indexed queries on frequently filtered columns (user_id, created_at)
- Connection pooling for concurrent requests
- Pagination using cursor-based approach
- Prepared statements to prevent SQL injection
- Caching like/reply counts denormalized in posts table

### API
- Request body size limits
- Response compression (gzip)
- Caching headers for static assets
- Efficient JSON serialization

### Frontend
- Code splitting by route
- Lazy loading components
- Memoization of expensive components
- Virtual scrolling for long lists (optional)

## Security Measures

1. **Authentication**: JWT with secure secret
2. **Authorization**: Role-based access control
3. **Data Protection**: bcrypt password hashing
4. **Input Validation**: Schema validation on all inputs
5. **SQL Injection**: Parameterized queries
6. **CORS**: Whitelist allowed origins
7. **Rate Limiting**: Token bucket algorithm
8. **HTTPS**: Enforced in production

## Deployment

### Development
```
npm install
npm run dev  # Backend: http://localhost:3001
npm run dev  # Frontend: http://localhost:3000
```

### Production
- Docker containerization
- Environment-based configuration
- Database migrations
- Reverse proxy (nginx)
- SSL/TLS certificates
- CI/CD pipeline (GitHub Actions)
