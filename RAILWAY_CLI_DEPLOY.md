# 🚀 Railway CLI Deployment Guide

## Install Railway CLI

### Windows:
```powershell
npm install -g @railway/cli
```

## Deploy Steps:

### 1. Login to Railway
```bash
railway login
```
Browser open hoga - Railway account se login karein

### 2. Link to Existing Project
```bash
railway link
```
Apna existing project (jahan PostgreSQL hai) select karein

### 3. Deploy
```bash
railway up
```

Railway automatically:
- ✅ Code upload karega
- ✅ Build karega
- ✅ Deploy karega

### 4. Add Environment Variables
```bash
railway variables set DATABASE_URL="postgresql://postgres:rLVHkXGTiolBKNHQtAmgVRApyUsusyJl@switchyard.proxy.rlwy.net:51572/railway"
railway variables set SESSION_SECRET="your-secret-key"
railway variables set NODE_ENV="production"
railway variables set PORT="5000"
```

### 5. Open Application
```bash
railway open
```

## Done! 🎉
