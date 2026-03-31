# Microblogging Application - Requirements Document

## Project Overview
A lightweight, high-performance Twitter-like microblogging application with user profiles, post creation, social interactions, and a global chronological feed.

## Functional Requirements

### 1. User Management
- **FR1.1**: Users can create an account with username and password
- **FR1.2**: Users can log in with credentials
- **FR1.3**: Users can log out
- **FR1.4**: Users have a public profile displaying username, account creation date, and their posts
- **FR1.5**: Users can view other users' profiles
- **FR1.6**: System stores user authentication tokens securely (JWT)

### 2. Post Management
- **FR2.1**: Users can create posts with text content (max 280 characters)
- **FR2.2**: Posts display creation timestamp and author information
- **FR2.3**: Posts are displayed in reverse chronological order (newest first)
- **FR2.4**: Posts cannot be edited or deleted once created
- **FR2.5**: Users can view all their own posts on their profile

### 3. Feed
- **FR3.1**: Users can view a global chronological feed of all posts
- **FR3.2**: Feed is sorted by creation timestamp (newest first)
- **FR3.3**: Feed displays post author, content, timestamps, like count, and reply count
- **FR3.4**: Feed updates without requiring page refresh (real-time updates optional)

### 4. Interactions
- **FR4.1**: Users can like posts
- **FR4.2**: Users can unlike posts
- **FR4.3**: Like count is displayed with each post
- **FR4.4**: Users can reply to posts with up to 280 characters
- **FR4.5**: Replies are displayed under their parent post (one level deep)
- **FR4.6**: Each post displays the number of replies

### 5. Authentication & Authorization
- **FR5.1**: Users must be authenticated to create posts
- **FR5.2**: Users must be authenticated to like/reply to posts
- **FR5.3**: Users can only be logged in as one account at a time
- **FR5.4**: Authentication tokens expire after 7 days

## Non-Functional Requirements

### Performance
- **NFR1.1**: Feed loads in under 1 second with 10,000 posts
- **NFR1.2**: API responses return in under 200ms (p99)
- **NFR1.3**: Database queries use indexes for efficient retrieval
- **NFR1.4**: Images/avatars cached on client side

### Scalability
- **NFR2.1**: System supports pagination for feed (cursor-based preferred)
- **NFR2.2**: Database schema optimized for read-heavy workload
- **NFR2.3**: API endpoints handle concurrent requests efficiently

### Security
- **NFR3.1**: Passwords stored using bcrypt hashing (minimum 10 rounds)
- **NFR3.2**: Passwords must be 6+ characters long
- **NFR3.3**: JWT tokens signed with secure secret
- **NFR3.4**: CORS configured for security
- **NFR3.5**: Input validation on all endpoints
- **NFR3.6**: SQL injection protection via parameterized queries

### Reliability
- **NFR4.1**: Database transactions ensure data consistency
- **NFR4.2**: Error handling with descriptive HTTP status codes
- **NFR4.3**: Logging of all critical operations

### Maintainability
- **NFR5.1**: 80%+ code test coverage
- **NFR5.2**: All business logic unit tested
- **NFR5.3**: Comprehensive API documentation
- **NFR5.4**: Structured logging with severity levels

## Data Model

### Users
- id (UUID, Primary Key)
- username (String, Unique, Index)
- email (String, Unique)
- password_hash (String)
- created_at (Timestamp)
- updated_at (Timestamp)

### Posts
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key, Index)
- content (String, Max 280 chars)
- created_at (Timestamp, Index)
- updated_at (Timestamp)
- like_count (Integer, cached)
- reply_count (Integer, cached)

### Likes
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key, Index)
- post_id (UUID, Foreign Key, Index)
- created_at (Timestamp)
- Unique(user_id, post_id)

### Replies
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key, Index)
- post_id (UUID, Foreign Key, Index)
- content (String, Max 280 chars)
- created_at (Timestamp, Index)
- updated_at (Timestamp)

## Constraints

### Explicitly Out of Scope
- Private messaging
- Retweets/reposts/sharing
- Follower graph or following system
- Search functionality
- Hashtags or mentions
- Direct message system
- User blocking/muting

## API Endpoints Summary

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### Users
- GET /api/users/:username
- GET /api/users/:username/posts

### Posts
- GET /api/feed (with pagination)
- POST /api/posts
- GET /api/posts/:postId

### Likes
- POST /api/posts/:postId/like
- DELETE /api/posts/:postId/like

### Replies
- GET /api/posts/:postId/replies
- POST /api/posts/:postId/replies

## Success Criteria
1. ✅ All 26 functional requirements implemented
2. ✅ All 16 non-functional requirements met
3. ✅ 80%+ test coverage
4. ✅ API response times under 200ms (p99)
5. ✅ Clean, readable code following best practices
6. ✅ Comprehensive logging
7. ✅ Production-ready error handling
