# 🚀 Railway Deployment Guide - PostgreSQL

## ✅ Perfect Choice! Railway + PostgreSQL Setup

Railway provides **free PostgreSQL databases** and makes deployment super easy.

## 📋 Step-by-Step Railway Deployment

### Step 1: Sign Up & Create Project
1. Go to [railway.app](https://railway.app)
2. **Sign up** with GitHub/Google
3. Click **"New Project"**
4. Choose **"Deploy from GitHub"** (or upload manually)

### Step 2: Connect Your Repository
- **Connect your GitHub repo** (create one if needed)
- Or **upload files manually** via Railway dashboard

### Step 3: Add PostgreSQL Database
1. In your Railway project dashboard:
   - Click **"+ New Service"**
   - Select **"Database"**
   - Choose **"PostgreSQL"**
   - Click **"Add PostgreSQL"**

2. **Note the database URL** from Railway (starts with `postgresql://`)

### Step 4: Configure Environment Variables

In Railway dashboard, go to your **Node.js service** settings:

```
DATABASE_URL=postgresql://username:password@host:port/database  # From Railway PostgreSQL
SESSION_SECRET=your-super-secret-key-change-this-in-production
PORT=5000
NODE_ENV=production
```

### Step 5: Deploy Backend Service

Railway will automatically:
- ✅ Install dependencies (`npm install`)
- ✅ Build your app (if needed)
- ✅ Start your server (`npm start`)
- ✅ Connect to PostgreSQL

## 📁 Required Files for Railway

Make sure you have these files in your project:

```
dist/index.js          # Your compiled server
package.json           # Dependencies
package-lock.json      # Lock file
.env                   # Environment (not uploaded to git)
```

## 🗄️ Database Setup

Railway PostgreSQL is **automatically provisioned**. Just use the `DATABASE_URL` they provide.

## 🔧 Update Your Application

Your current app uses Drizzle ORM with PostgreSQL - **perfect for Railway!**

## 🌐 Deployment Commands (Optional)

If you prefer CLI deployment:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

## 📊 Railway Dashboard Features

- **Automatic deployments** on git push
- **Free PostgreSQL** database
- **Custom domains** available
- **Logs and monitoring** built-in
- **Environment variables** management
- **Service scaling** options

## 🚀 Quick Start Summary

1. **Railway.app** → New Project → Deploy from GitHub
2. **Add PostgreSQL** database service
3. **Set environment variables** in Node.js service
4. **Deploy automatically!**

## 💡 Pro Tips

- **Railway PostgreSQL** is free for small projects
- **Automatic backups** included
- **Zero-config** deployment
- **HTTPS** automatically configured

## 📞 Need Help?

Railway has excellent documentation at [docs.railway.app](https://docs.railway.app)

**Ready to deploy?** Follow the steps above and let me know if you get stuck!

Your PostgreSQL database and Node.js backend will be deployed together on Railway - perfect setup! 🎉
