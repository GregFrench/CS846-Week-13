# Frontend - Microblog React App

Modern React frontend for the Microblog application with Redux state management.

## 🚀 Quick Start

```bash
npm install
npm run dev  # http://localhost:3000
```

## 📁 Component Structure

### Pages
- **Auth** (`Auth.jsx`)
  - Login form
  - Registration form
  - Email & password validation
  - Automatic redirect on auth

- **Feed** (`Feed.jsx`)
  - Timeline of posts
  - Post creation form
  - Like/reply interactions
  - Infinite scroll ready

### Components
- **PostForm** - Create new posts
- **Post** - Display individual post with interactions
- **Reply** & **ReplyForm** - Display and create replies

## 🎯 State Management (Redux)

### Auth Slice
```javascript
{
  user: { id, username, email, created_at },
  token: "jwt-token",
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null
}
```

### Feed Slice
```javascript
{
  posts: [],
  loading: boolean,
  error: string | null,
  hasMore: boolean,
  offset: number
}
```

## 🌐 API Integration

Axios client with automatic token injection:
```javascript
// Token automatically added to requests
const token = localStorage.getItem('token');
// Authorization: Bearer {token}
```

## 🎨 Styling

- CSS Modules for component styles
- Modern CSS Grid & Flexbox
- Responsive design (mobile-first)
- Smooth transitions & animations

### Color Scheme
- Primary: `#1d9bf0` (Twitter Blue)
- Text: `#0f1419`
- Border: `#e0e0e0`
- Hover: `#f7f7f7`

## 🔐 Security

- Tokens stored in `localStorage`
- Automatic token refresh on 401
- Protected routes (ProtectedRoute component)
- Input validation before submission

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

### Components Tested
- Auth forms (login/register)
- Post display
- Interactions (like, reply)

## 📦 Build & Deployment

### Development
```bash
npm run dev   # Start dev server with HMR
```

### Production
```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

Build output in `dist/` directory - ready to deploy to any static host.

## 🚀 Performance Features

- Code splitting by route
- Lazy component loading
- Redux selector memoization
- Virtual scrolling ready
- Image optimization

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Touch-friendly buttons (min 44px)
- Flexible layouts

## 🔗 Environment

Frontend automatically proxies `/api` requests to backend:
```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true
  }
}
```

## 🎯 Features

- ✅ User authentication (login/register)
- ✅ Create posts (280 char limit)
- ✅ Like/unlike posts
- ✅ Reply to posts (inline)
- ✅ View user profiles
- ✅ Real-time feed updates
- ✅ Pagination support

## 📞 Troubleshooting

### Cannot connect to backend
- Ensure backend running on port 3001
- Check vite.config.js proxy settings
- Verify CORS_ORIGIN in backend .env

### Tokens not persisting
- Check localStorage is enabled
- Verify token stored correctly
- Check JWT expiry settings

### Components not updating
- Check Redux DevTools
- Verify selectors in components
- Clear Redux cache if needed
