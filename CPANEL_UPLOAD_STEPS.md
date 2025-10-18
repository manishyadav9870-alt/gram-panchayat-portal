# 📦 cPanel Upload & Deployment Steps

## ✅ Files Ready:
- `publish-cpanel-complete.zip` (with node_modules - ready to upload)

---

## 🚀 Step-by-Step cPanel Deployment

### **Step 1: Upload Zip File**

1. **cPanel Login** karein
2. **File Manager** open karein
3. **public_html** folder mein jaayein (ya jahan app deploy karna hai)
4. **Upload** button click karein
5. **`publish-cpanel-complete.zip`** select karein aur upload karein
6. Upload complete hone ka wait karein

---

### **Step 2: Extract Files**

1. Uploaded zip file pe **right-click** karein
2. **Extract** select karein
3. Extract location: `/public_html/` (ya current folder)
4. **Extract Files** button click karein
5. Extraction complete hone ka wait karein
6. Zip file delete kar sakte hain (optional)

---

### **Step 3: Setup Node.js Application**

1. cPanel dashboard mein **"Setup Node.js App"** search karein
2. **"Create Application"** button click karein

**Configuration:**

```
Node.js Version: 18.x (ya latest available)
Application Mode: Production
Application Root: /home/username/public_html/publish-cpanel
Application URL: your-domain.com (ya subdomain)
Application Startup File: dist/index.js
Passenger log file: (auto-generated)
```

3. **Environment Variables** section mein scroll karein
4. Ye variables add karein:

```
NODE_ENV = production
PORT = 5000
```

**Note:** `DATABASE_URL` aur `SESSION_SECRET` already `.env` file mein hain, to add karne ki zarurat nahi.

5. **"Create"** button click karein

---

### **Step 4: Verify Installation**

1. Node.js App dashboard mein application show hoga
2. Status check karein: **Running** hona chahiye
3. Agar **Stopped** hai to **"Restart"** button click karein

---

### **Step 5: Test Application**

1. Browser mein apna domain open karein:
   ```
   https://your-domain.com
   ```

2. Application load hona chahiye
3. Test karein:
   - Homepage load ho raha hai? ✅
   - Login page accessible hai? ✅
   - Database connection working hai? ✅

---

## 🔧 Troubleshooting

### **Problem: Application not starting**

**Check Logs:**
1. Node.js App dashboard mein **"Open Logs"** click karein
2. Error messages check karein

**Common Issues:**
- Port already in use → `.env` mein PORT change karein
- Database connection error → Railway URL check karein
- Missing dependencies → Ensure node_modules uploaded hai

---

### **Problem: 404 Not Found**

**Solution:**
- Application URL check karein
- Application Root path verify karein
- Startup file path correct hai: `dist/index.js`

---

### **Problem: Database Connection Error**

**Check:**
1. Railway database running hai?
2. `publish-cpanel/.env` mein correct DATABASE_URL hai?
3. Railway firewall/network settings check karein

**Test Database Connection:**
```bash
# SSH se (agar available hai):
cd ~/public_html/publish-cpanel
node test-db-connection.js
```

---

### **Problem: Permission Errors**

**Fix Permissions:**
```bash
# SSH se:
cd ~/public_html/publish-cpanel
chmod -R 755 .
chmod 644 .env
```

---

## 📊 Your Setup Summary

```
┌─────────────────────────┐
│   cPanel Hosting        │
│   (Node.js App)         │
│                         │
│   Files: publish-cpanel │
│   Server: dist/index.js │
└────────────┬────────────┘
             │
             │ Internet (TCP Proxy)
             │
             ▼
┌─────────────────────────┐
│   Railway Cloud         │
│   PostgreSQL Database   │
│                         │
│   switchyard.proxy...   │
│   Port: 51572           │
└─────────────────────────┘
```

**Database:** Railway PostgreSQL ✅
**Application:** cPanel Node.js ✅
**Connection:** Public TCP Proxy ✅

---

## ✅ Post-Deployment Checklist

- [ ] Files uploaded successfully
- [ ] Node.js app created in cPanel
- [ ] Application status: Running
- [ ] Domain accessible in browser
- [ ] Login/signup working
- [ ] Database operations working
- [ ] Railway database has data

---

## 🎉 Deployment Complete!

Aapka **Gram Panchayat Portal** ab live hai!

**Access:** https://your-domain.com

**Admin Panel:** Login karke admin features access karein

**Database:** Railway PostgreSQL mein data save ho raha hai

---

## 📞 Need Help?

**Common Commands (SSH):**

```bash
# Application restart
cd ~/public_html/publish-cpanel
touch tmp/restart.txt

# Check logs
tail -f logs/passenger.log

# Test database
node test-db-connection.js
```

**Railway Dashboard:** https://railway.app
**cPanel:** Your hosting control panel

Happy deploying! 🚀
