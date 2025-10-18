# Quick Start Guide - Gram Panchayat Portal

## 🚀 Get Started in 5 Steps

### Step 1: Install PostgreSQL
Download and install from: https://www.postgresql.org/download/windows/
- Remember your postgres password
- Default port: 5432

### Step 2: Create Database
Open Command Prompt or PowerShell:
```bash
psql -U postgres
```
Then in psql:
```sql
CREATE DATABASE gram_panchayat;
\q
```

### Step 3: Configure Database Connection
Edit `.env` file and update this line:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/gram_panchayat
```
Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

### Step 4: Setup Database Tables
```bash
npm run db:push
```

### Step 5: Run the Application
```bash
npm run dev
```

Open browser: **http://localhost:5000**

## 🔐 Admin Login
- **Username:** admin
- **Password:** admin123

## 📋 What You Can Do

### As Admin:
✅ View all complaints, birth certificates, death certificates
✅ Update status (pending → approved/rejected)
✅ Edit or delete any record
✅ Create announcements (bilingual)

### As Citizen:
✅ Submit complaints with auto-generated tracking number
✅ Apply for birth certificate
✅ Apply for death certificate
✅ Track application status using tracking number
✅ View announcements

## 🎯 Key Features

### Database Storage:
- All data saved to PostgreSQL
- Automatic tracking numbers
- Status management
- Timestamps for audit trail

### Forms Available:
1. **Complaints** (CMP tracking)
2. **Birth Certificates** (BRT tracking)
3. **Death Certificates** (DTH tracking)
4. **Announcements** (English + Marathi)

## 📞 Troubleshooting

**Can't connect to database?**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

**Port 5000 already in use?**
- Change PORT in .env file
- Or stop other process using port 5000

**Migration fails?**
- Make sure PostgreSQL service is running
- Check database credentials
- Verify database exists

## 📚 More Help
- See `DATABASE_SETUP.md` for detailed setup
- See `CHANGES_SUMMARY.md` for what was changed
- Run `.\setup-database.ps1` for automated setup

## ⚠️ Important for Production
1. Change admin password
2. Use strong SESSION_SECRET
3. Enable SSL for database
4. Set NODE_ENV=production
