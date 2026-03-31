# Deployment Guide

Complete guide for deploying the Microblogging application to production.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing: `npm test`
- [ ] Environment variables configured
- [ ] Database backups configured
- [ ] SSL/TLS certificates obtained
- [ ] CORS origins updated
- [ ] Frontend build optimized
- [ ] Database indexes created
- [ ] Logging configured

## 🐳 Docker Deployment

### Backend Dockerfile

Create `Dockerfile` in `backend/`:

```dockerfile
FROM node:18-alpine

# Install dumb-init
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src
COPY scripts ./scripts

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Run application
ENTRYPOINT ["/sbin/dumb-init", "--"]
CMD ["node", "src/server.js"]
```

### Frontend Dockerfile

Create `Dockerfile` in `frontend/`:

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - '3001:3001'
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: /data/microblog.db
      JWT_SECRET: ${JWT_SECRET}
      LOG_LEVEL: info
      CORS_ORIGIN: ${CORS_ORIGIN}
    volumes:
      - ./data:/data
      - ./backend/logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'wget', '--quiet', '--tries=1', '--spider', 'http://localhost:3001/health']
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    ports:
      - '3000:80'
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'wget', '--quiet', '--tries=1', '--spider', 'http://localhost/']
      interval: 30s
      timeout: 10s
      retries: 3
```

### Deploy with Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ☁️ Cloud Deployment

### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create apps
heroku create microblog-api
heroku create microblog-web

# Set environment variables
heroku config:set NODE_ENV=production JWT_SECRET=your-secret -a microblog-api

# Deploy
git push heroku main

# View logs
heroku logs -f -a microblog-api
```

### AWS

1. **Create EC2 Instance**
   - Ubuntu 20.04 LTS
   - t3.medium or larger
   - Security group: Allow 80, 443, 3001

2. **Setup Instance**
   ```bash
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs postgresql nginx certbot python3-certbot-nginx
   ```

3. **Install Application**
   ```bash
   git clone <repo> /var/www/microblog
   cd /var/www/microblog
   npm install --production
   ```

4. **Setup Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE microblog;
   CREATE USER microblog WITH PASSWORD 'secure-password';
   GRANT ALL PRIVILEGES ON DATABASE microblog TO microblog;
   ```

5. **Configure Nginx**
   ```nginx
   upstream microblog_backend {
       server localhost:3001;
   }

   server {
       listen 80;
       server_name yourdomain.com;

       location /api {
           proxy_pass http://microblog_backend;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location / {
           root /var/www/microblog/frontend/dist;
           try_files $uri /index.html;
       }
   }
   ```

6. **SSL Certificate**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### DigitalOcean

1. Create App Platform (PaaS) - Easiest option
2. Connect GitHub repository
3. Configure environment variables
4. Set build commands:
   - Backend: `npm install && npm run db:init`
   - Frontend: `npm install && npm run build`
5. Deploy

## 🔄 Continuous Deployment (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Backend Tests
        run: cd backend && npm install && npm test

      - name: Frontend Tests
        run: cd frontend && npm install && npm test

      - name: Build Frontend
        run: cd frontend && npm run build

      - name: Deploy
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh -i ~/.ssh/deploy_key user@server "cd /var/www/microblog && git pull && npm install && npm run db:init"
```

## 📊 Monitoring & Logging

### Server Monitoring
```bash
# CPU & Memory
top
htop

# Disk usage
df -h

# Process monitoring
pm2 status
pm2 logs
```

### Application Logging
```bash
# View backend logs
tail -f /var/www/microblog/backend/logs/all.log

# View error logs
tail -f /var/www/microblog/backend/logs/error.log
```

### Uptime Monitoring
- Use service like UptimeRobot
- Configure alerts for downtime
- Monitor response times

## 🔐 Production Security

### Environment Setup
```bash
# Generate strong JWT secret
openssl rand -base64 32

# Set environment variables
export JWT_SECRET="your-generated-secret"
export NODE_ENV="production"
export DATABASE_URL="postgresql://user:pass@host/db"
```

### Database Backups
```bash
# Daily backup script
0 2 * * * /usr/local/bin/backup-db.sh

# backup-db.sh
#!/bin/bash
pg_dump microblog > /backups/microblog_$(date +%Y%m%d).sql
```

### SSL/TLS Configuration
- Use Let's Encrypt (free)
- Auto-renewal with certbot
- Enforce HTTPS only

## 📈 Performance Tuning

### Backend
- Enable gzip compression
- Implement Redis caching
- Use connection pooling
- Optimize queries

### Database
- Use PostgreSQL for production (not SQLite)
- Enable query logging
- Create indexes
- Regular VACUUM

### Frontend
- Enable CDN
- Minify assets
- Gzip compression
- Browser caching

## 🚨 Troubleshooting

### Application won't start
```bash
# Check logs
tail -f logs/all.log

# Verify database
sqlite3 microblog.db ".tables"

# Check port
lsof -i :3001
```

### High memory usage
```bash
# Check process memory
ps aux | grep node

# Restart service
systemctl restart microblog
```

### Database connection issues
```bash
# Test connection
psql -U user -d microblog -h localhost

# Check logs for errors
grep "database" logs/error.log
```

## 📋 Maintenance Checklist

### Weekly
- [ ] Check logs for errors
- [ ] Monitor disk usage
- [ ] Verify backups

### Monthly
- [ ] Update dependencies
- [ ] Review security logs
- [ ] Check database size

### Quarterly
- [ ] Performance analysis
- [ ] Security audit
- [ ] Disaster recovery test

---

**For detailed troubleshooting, check logs first and then refer to specific service documentation.**
