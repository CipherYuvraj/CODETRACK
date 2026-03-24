# CodeTrack - Deployment Guide

## Current Status: 70% Production Ready

---

## QUICK START (Local Testing)

```bash
# 1. Install dependencies
npm install

# 2. Start server
npm start

# 3. Open dashboard
# Go to: file:///path/to/dashboard-modern.html
# Or serve via live server
```

---

## DEPLOYMENT CHECKLIST

### ✅ Completed
- [x] Backend API routes (User, Questions, Revisions)
- [x] JSON file storage (data.json)
- [x] 3-7-15 spaced repetition logic
- [x] Dark/Light theme toggle
- [x] Frontend UI (Modern dashboard)
- [x] Social links (GitHub, LinkedIn)
- [x] Add problem modal
- [x] CORS configuration
- [x] Environment variables setup

### ⚠️ Before Production (Recommended)
- [ ] Add input validation & sanitization
- [ ] Add request rate limiting
- [ ] Add proper logging (Winston/Morgan)
- [ ] Add unit tests
- [ ] Add database (MongoDB/PostgreSQL)
- [ ] Add API documentation (Swagger)
- [ ] Add error tracking (Sentry)
- [ ] Setup SSL/HTTPS

---

## DEPLOYMENT OPTIONS

### Option 1: Heroku (Easiest)

```bash
# 1. Create Procfile
echo "web: node backend/server.js" > Procfile

# 2. Push to Heroku
heroku create your-app-name
git push heroku main

# 3. Your app runs at: https://your-app-name.herokuapp.com
```

### Option 2: Vercel/Netlify (Frontend Only)

```bash
# Deploy dashboard-modern.html
# Update API_URL in dashboard.js to your backend URL
# Serve as static site
```

### Option 3: AWS/DigitalOcean (Self-hosted)

```bash
# 1. SSH into server
ssh root@your-server-ip

# 2. Clone repo & install
git clone your-repo
cd code-track
npm install

# 3. Use PM2 to keep app running
npm install -g pm2
pm2 start backend/server.js --name "code-track"
pm2 startup
pm2 save

# 4. Setup Nginx reverse proxy
# Configure SSL with Let's Encrypt
```

---

## ENVIRONMENT VARIABLES

Create `.env` file:
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

---

## MIGRATE TO DATABASE (When Ready)

Currently: In-memory JSON file
Next Step: Add MongoDB connection

```javascript
// Example MongoDB setup
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
```

---

## PRODUCTION PERFORMANCE TIPS

1. **Compress responses**: Add compression middleware
2. **Cache data**: Add Redis caching
3. **Optimize queries**: Index database fields
4. **Monitor logs**: Use ELK stack or Datadog
5. **Setup CI/CD**: GitHub Actions for auto-deploy

---

## SECURITY CHECKLIST

- [ ] Add HTTPS/SSL
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Add API authentication (JWT)
- [ ] Hide sensitive data (.env)
- [ ] Setup CORS properly
- [ ] Add security headers

---

## FILE STRUCTURE

```
code-track/
├── backend/
│   ├── data/
│   │   └── data.json          (Your data storage)
│   ├── helpers/
│   │   └── fileHelper.js      (JSON read/write)
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── questionRoutes.js
│   │   └── revisionRoutes.js
│   └── server.js              (Main app)
├── dashboard-modern.html       (Main UI)
├── dashboard.js                (Controller)
├── styles-modern.css           (Styles)
├── package.json                (Dependencies)
└── .env                        (Configuration)
```

---

## SUPPORT

For issues, check:
1. Browser console (F12)
2. Server logs (`npm start`)
3. Check API endpoints (`curl http://localhost:5000/api/questions/demo_user`)

---

**Ready to deploy? Follow the deployment options above! 🚀**
