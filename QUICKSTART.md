# Quick Start (5 Minutes)

**Goal:** Get both frontend and backend running locally

## Prerequisites Check (2 min)

Run this first:
```powershell
CHECK_SETUP.bat
```

If all green, proceed. If any red, install missing software.

---

## Fast Setup (3 min)

### Option 1: Automatic (Easiest)

Double-click:
```
START_LOCAL.bat
```

That's it. Wait for browser to open at `http://localhost:3000`

### Option 2: Manual

**Terminal 1:**
```powershell
cd backend
$env:DB_USERNAME="root"
$env:DB_PASSWORD=""
.\mvnw.cmd spring-boot:run
```

**Terminal 2 (new window):**
```powershell
cd frontend
$env:REACT_APP_API_BASE_URL="http://localhost:8080/api"
npm install
npm start
```

---

## Verify It Works (2 min)

1. Browser opens at: `http://localhost:3000`
2. Click "Register as Team Leader"
3. Fill form with test data
4. Register successfully
5. Login with credentials
6. See dashboard
7. ✅ Done!

---

## Still Need Help?

Full setup guide with all details: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
