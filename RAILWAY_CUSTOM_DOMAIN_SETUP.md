# 🚀 Railway Deployment + Custom Domain Setup

## Complete Guide: Deploy to Railway + Connect kishorgrampanchayat.in

---

## ✅ What You Already Have:

- ✅ Railway PostgreSQL Database (created)
- ✅ Database URL: `postgresql://postgres:rLVHkXGTiolBKNHQtAmgVRApyUsusyJl@switchyard.proxy.rlwy.net:51572/railway`
- ✅ Application code ready
- ✅ Domain: `kishorgrampanchayat.in`

---

## 🚀 Step 1: Push Code to GitHub

### **A. Create GitHub Repository**

1. Go to https://github.com
2. Click **"New Repository"**
3. Repository name: `gram-panchayat-portal`
4. **Private** (recommended for production)
5. **Don't** initialize with README (we already have code)
6. Click **"Create Repository"**

### **B. Push Code to GitHub**

Open terminal in your project folder and run:

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - Gram Panchayat Portal"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gram-panchayat-portal.git

# Push to GitHub
git push -u origin main
```

**Note:** If `main` branch doesn't exist, use `master`:
```bash
git branch -M main
git push -u origin main
```

---

## 🚀 Step 2: Deploy to Railway

### **A. Create New Service**

1. Go to **Railway Dashboard**: https://railway.app
2. Open your existing project (where PostgreSQL is)
3. Click **"+ New Service"**
4. Select **"GitHub Repo"**
5. **Connect GitHub** (if not already connected)
6. Select **`gram-panchayat-portal`** repository
7. Click **"Deploy"**

### **B. Configure Environment Variables**

In the **Node.js service** (not PostgreSQL):

1. Click on the **service**
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add these variables:

```env
DATABASE_URL = postgresql://postgres:rLVHkXGTiolBKNHQtAmgVRApyUsusyJl@switchyard.proxy.rlwy.net:51572/railway

SESSION_SECRET = your-super-secret-random-key-change-this-min-32-chars

NODE_ENV = production

PORT = 5000
```

**Important:** `SESSION_SECRET` ko strong random string se replace karein!

### **C. Wait for Deployment**

Railway automatically:
- ✅ Detects Node.js project
- ✅ Runs `npm install`
- ✅ Runs `npm run build`
- ✅ Runs `npm start`
- ✅ Assigns a public URL

**Deployment time:** 2-5 minutes

---

## 🌐 Step 3: Connect Custom Domain

### **A. Get Railway Domain**

1. In Railway service dashboard
2. Go to **"Settings"** tab
3. Scroll to **"Domains"** section
4. You'll see Railway's auto-generated domain:
   ```
   gram-panchayat-portal-production.up.railway.app
   ```
5. Test this URL - application should be working

### **B. Add Custom Domain**

1. In **"Domains"** section
2. Click **"+ Custom Domain"**
3. Enter: `kishorgrampanchayat.in`
4. Click **"Add Domain"**

Railway will show DNS records to add.

### **C. Configure DNS (Your Domain Provider)**

Go to your domain registrar (where you bought `kishorgrampanchayat.in`):

**Add these DNS records:**

#### **For Root Domain (kishorgrampanchayat.in):**

**Option 1: CNAME (if supported):**
```
Type: CNAME
Name: @
Value: gram-panchayat-portal-production.up.railway.app
TTL: 3600
```

**Option 2: A Record (if CNAME not supported for root):**
Railway will provide IP address - use that:
```
Type: A
Name: @
Value: [Railway IP address]
TTL: 3600
```

#### **For www subdomain:**
```
Type: CNAME
Name: www
Value: gram-panchayat-portal-production.up.railway.app
TTL: 3600
```

### **D. Wait for DNS Propagation**

- **Time:** 5 minutes to 48 hours (usually 15-30 minutes)
- **Check status:** https://dnschecker.org

---

## 🔒 Step 4: Enable HTTPS (SSL)

Railway **automatically** provides SSL certificate!

1. Once DNS propagates
2. Railway detects your domain
3. SSL certificate auto-generated
4. Your site will be accessible via:
   - ✅ `https://kishorgrampanchayat.in`
   - ✅ `https://www.kishorgrampanchayat.in`

---

## ✅ Step 5: Verify Deployment

### **Test Your Application:**

1. **Visit:** https://kishorgrampanchayat.in
2. **Check:**
   - ✅ Homepage loads
   - ✅ Login/signup works
   - ✅ Database operations work
   - ✅ HTTPS (lock icon) shows

### **Check Railway Logs:**

1. Railway Dashboard → Your service
2. **"Deployments"** tab
3. Click latest deployment
4. View **logs** for any errors

---

## 📊 Your Final Architecture:

```
┌─────────────────────────────┐
│  kishorgrampanchayat.in     │
│  (Your Custom Domain)       │
│  HTTPS ✅                    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Railway Platform           │
│  ┌─────────────────────┐    │
│  │  Node.js App        │    │
│  │  (Auto-scaled)      │    │
│  └──────────┬──────────┘    │
│             │                │
│  ┌──────────▼──────────┐    │
│  │  PostgreSQL DB      │    │
│  │  (Managed)          │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

---

## 🎯 Benefits of Railway Deployment:

- ✅ **Free SSL/HTTPS** - Automatic
- ✅ **Auto-scaling** - Handles traffic spikes
- ✅ **Automatic deployments** - Push to GitHub → Auto-deploy
- ✅ **Built-in monitoring** - Logs, metrics, alerts
- ✅ **Zero-downtime deploys** - No interruption
- ✅ **PostgreSQL included** - Already setup
- ✅ **CDN** - Fast global delivery

---

## 🔄 Future Updates:

**To update your application:**

1. Make changes in code
2. Commit to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```
3. Railway **automatically redeploys**!

---

## 🔧 Troubleshooting:

### **Problem: Build Failed**

**Check:**
- Railway logs for error messages
- Ensure `package.json` has correct scripts:
  ```json
  "scripts": {
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  }
  ```

### **Problem: Database Connection Error**

**Check:**
- `DATABASE_URL` environment variable is correct
- Railway PostgreSQL service is running
- Use **internal URL** (switchyard.proxy.rlwy.net)

### **Problem: Domain Not Working**

**Check:**
- DNS records are correct
- Wait for DNS propagation (use dnschecker.org)
- Railway shows domain as "Active"

---

## 📞 Support:

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **DNS Checker:** https://dnschecker.org

---

## 🎉 Deployment Complete!

Your **Gram Panchayat Portal** will be live at:
- **https://kishorgrampanchayat.in**
- **https://www.kishorgrampanchayat.in**

**With:**
- ✅ Custom domain
- ✅ Free SSL/HTTPS
- ✅ Railway PostgreSQL
- ✅ Auto-scaling
- ✅ Automatic deployments

Happy deploying! 🚀
