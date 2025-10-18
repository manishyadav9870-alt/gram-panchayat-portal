# 🚀 cPanel + Railway PostgreSQL Deployment Guide

## ✅ Perfect Setup: Railway Database + cPanel Hosting

Railway ka PostgreSQL database use karenge (free, reliable) aur cPanel pe application deploy karenge.

---

## 📋 Step-by-Step Deployment

### **Step 1: Railway Database URL Copy Karein**

1. **Railway Dashboard** pe jaayein: https://railway.app
2. Apne **PostgreSQL service** pe click karein
3. **Variables** tab mein jaayein
4. **DATABASE_PUBLIC_URL** copy karein

Example URL:
```
postgresql://postgres:abc123xyz@containers-us-west-123.railway.app:7432/railway
```

⚠️ **Important:** `DATABASE_PUBLIC_URL` use karein, not `DATABASE_URL` (public URL internet se accessible hai)

---

### **Step 2: Local Build Karein**

Terminal mein ye commands run karein:

```bash
# Dependencies install karein
npm install

# Production build banayein
npm run build
```

Ye `dist/` folder create karega with compiled code.

---

### **Step 3: publish-cpanel Folder Configure Karein**

1. **File open karein:** `publish-cpanel/.env`

2. **DATABASE_URL update karein** Railway URL se:
```env
DATABASE_URL=postgresql://postgres:abc123xyz@containers-us-west-123.railway.app:7432/railway
```

3. **SESSION_SECRET change karein** (koi strong random password):
```env
SESSION_SECRET=your-super-secret-random-key-min-32-characters-long
```

---

### **Step 4: Database Schema Push Karein**

Railway database mein tables create karne ke liye:

```bash
# .env file temporarily update karein Railway URL se
# Phir run karein:
npm run db:push
```

Ye automatically tables create kar dega Railway PostgreSQL mein.

---

### **Step 5: cPanel Upload Karein**

#### **Files to Upload:**

Upload karne ke liye ye files/folders:

```
publish-cpanel/
├── dist/              (compiled server code)
├── public/            (frontend files)
├── server/            (server source files)
├── shared/            (shared schemas)
├── package.json
├── package-lock.json
├── .env               (Railway database URL ke saath)
├── drizzle.config.ts
└── tsconfig.json
```

#### **Upload Steps:**

1. **cPanel File Manager** open karein
2. **public_html** (ya app folder) mein jaayein
3. **Zip file upload** karein ya files drag-drop karein
4. Extract karein

---

### **Step 6: cPanel Node.js App Setup**

1. **cPanel Dashboard** → **Setup Node.js App**
2. **Create Application:**
   - **Node.js Version:** 18.x ya higher
   - **Application Mode:** Production
   - **Application Root:** `/home/username/public_html` (ya app folder)
   - **Application URL:** Your domain
   - **Application Startup File:** `dist/index.js`

3. **Environment Variables Add Karein:**
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://postgres:abc123xyz@containers-us-west-123.railway.app:7432/railway
   SESSION_SECRET=your-secret-key
   ```

4. **NPM Install Run Karein:**
   - cPanel terminal mein: `npm install --production`

5. **Start Application:**
   - Click **"Restart"** button

---

### **Step 7: Test Your Application**

1. Browser mein apna domain open karein
2. Application load hona chahiye
3. Login/signup test karein
4. Data Railway database mein save hoga

---

## 🔧 Troubleshooting

### **Problem: Database connection error**

**Solution:**
- Railway dashboard mein check karein **DATABASE_PUBLIC_URL** correct hai
- Ensure **TCP Proxy** enabled hai Railway mein
- `.env` file mein URL properly paste kiya hai

### **Problem: Application not starting**

**Solution:**
```bash
# cPanel terminal mein:
cd ~/public_html
npm install
node dist/index.js
# Check for errors
```

### **Problem: Port already in use**

**Solution:**
- cPanel mein different port use karein (e.g., 3000, 5000, 8080)
- `.env` mein `PORT` update karein

---

## 📊 Architecture

```
┌─────────────────┐
│   cPanel Server │
│   (Node.js App) │
│                 │
│   Your Domain   │
└────────┬────────┘
         │
         │ Internet
         │
         ▼
┌─────────────────┐
│  Railway Cloud  │
│   PostgreSQL    │
│   (Database)    │
└─────────────────┘
```

---

## ✅ Benefits of This Setup

- ✅ **Railway PostgreSQL:** Free, reliable, automatic backups
- ✅ **cPanel Hosting:** Affordable, easy to manage
- ✅ **Scalable:** Database alag hai, easily upgrade kar sakte hain
- ✅ **Secure:** Railway SSL/TLS encrypted connections

---

## 🎉 Deployment Complete!

Aapka application ab live hai:
- **Frontend:** cPanel domain pe
- **Backend:** cPanel Node.js app
- **Database:** Railway PostgreSQL

**Questions?** Check Railway logs aur cPanel error logs for debugging.

Happy deploying! 🚀
