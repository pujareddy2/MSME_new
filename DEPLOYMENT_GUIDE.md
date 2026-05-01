# Complete Full Stack Setup Guide for Organization Innovation Platform
## Running on Another Laptop (Windows/Mac/Linux)

This guide covers how to set up and run the entire integrated system from scratch.

---

## PART 1: Prerequisites Installation

### Step 1.1: Install Java 17+

**Windows:**
1. Download JDK from: https://www.oracle.com/java/technologies/downloads/
2. Choose JDK 21 (or Java 17+)
3. Run installer and follow defaults
4. Verify in terminal:
   ```powershell
   java -version
   ```
   Should show Java 21.x.x

**Mac/Linux:**
```bash
java -version
# If not installed, use:
# Mac: brew install openjdk@21
# Linux: apt-get install openjdk-21-jdk
```

### Step 1.2: Install Node.js + npm

1. Download from: https://nodejs.org/
2. Choose LTS version (18+)
3. Install and verify:
   ```powershell
   node --version
   npm --version
   ```
   Should show v18+ and 9.x+

### Step 1.3: Install MySQL 8+

**Windows:**
1. Download MySQL Community Server: https://dev.mysql.com/downloads/mysql/
2. Run MSI installer
3. Choose "Standalone MySQL Server"
4. Verify in terminal:
   ```powershell
   mysql --version
   ```

**Mac:**
```bash
brew install mysql
mysql --version
```

**Linux:**
```bash
sudo apt-get install mysql-server
mysql --version
```

### Step 1.4: Verify All Installations

```powershell
java -version
javac -version
node --version
npm --version
mysql --version
```

All should return valid versions. If not, reinstall.

---

## PART 2: Clone and Setup Repository

### Step 2.1: Clone Repository

```powershell
# Navigate to where you want the project
cd C:\Users\YourUsername\Desktop

# Clone the project repository (example uses 'Platform')
git clone https://github.com/your-org/Platform
cd Platform
```

Or if no git, download as ZIP, extract, and navigate to folder.

### Step 2.2: Verify Folder Structure

```
Platform/  (or your project folder name)
  backend/           ← Spring Boot API
  frontend/          ← React web app
  README.md
  .env
```

---

## PART 3: Database Setup

### Step 3.1: Start MySQL Server

**Windows (via Services):**
- Press `Win + R`, type `services.msc`
- Find "MySQL80" service
- Right-click → Start

Or via terminal:
```powershell
net start MySQL80
```

**Mac/Linux:**
```bash
brew services start mysql
# or
sudo systemctl start mysql
```

### Step 3.2: Create Database

Open new terminal and login to MySQL:

```powershell
mysql -u root -p
# Press Enter if no password, or enter your MySQL root password
```

Inside MySQL CLI, run:

```sql
CREATE DATABASE Organization_portal;
EXIT;
```

### Step 3.3: Verify Database Created

```powershell
mysql -u root -p
SHOW DATABASES;
# Should list: Organization_portal
EXIT;
```

---

## PART 4: Backend Setup and Run

### Step 4.1: Navigate to Backend

```powershell
cd C:\Users\YourUsername\Desktop\Platform\backend
```

### Step 4.2: Set Environment Variables

**Windows PowerShell:**

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.10"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "yourMySQLPassword"
```

> Replace `yourMySQLPassword` with your actual MySQL root password (or leave blank if no password)

**Mac/Linux:**

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home
export DB_USERNAME=root
export DB_PASSWORD=yourMySQLPassword
```

### Step 4.3: Build Backend

```powershell
cd backend
.\mvnw.cmd clean package
```

**On Mac/Linux:**
```bash
./mvnw clean package
```

Wait for build to complete. Should see:
```
BUILD SUCCESS
```

### Step 4.4: Start Backend

**Windows PowerShell:**

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.10"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "yourMySQLPassword"
.\mvnw.cmd spring-boot:run
```

**Mac/Linux:**

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home
export DB_USERNAME=root
export DB_PASSWORD=yourMySQLPassword
./mvnw spring-boot:run
```

Wait for startup. Should see:
```
Tomcat started on port 8080 (http) with context path '/'
Started BackendApplication in X.XXX seconds
```

> ✅ Backend is now running at: `http://localhost:8080`

**Do NOT close this terminal.** Keep it running in background.

---

## PART 5: Frontend Setup and Run

### Step 5.1: Open Second Terminal

Open a **new terminal** (keep first one running for backend).

### Step 5.2: Navigate to Frontend

```powershell
cd C:\Users\YourUsername\Desktop\Platform\frontend
```

### Step 5.3: Set Frontend Environment Variable

**Windows PowerShell:**

```powershell
$env:REACT_APP_API_BASE_URL = "http://localhost:8080/api"
```

**Mac/Linux:**

```bash
export REACT_APP_API_BASE_URL="http://localhost:8080/api"
```

### Step 5.4: Install Dependencies

```powershell
npm install
```

Wait for all packages to download. Should see:
```
added XX packages
```

### Step 5.5: Start Frontend

```powershell
npm start
```

Browser should automatically open at:
```
http://localhost:3000
```

If not, manually open browser and go to `http://localhost:3000`

---

## PART 6: Integration Verification (Smoke Test)

### Step 6.1: Test Team Leader Registration

1. In browser, click **"Register as Team Leader"**
2. Fill form:
   - Name: `Test Leader`
   - Email: `testlead@example.com`
   - Phone: `9876543210`
  - College ID: `PLATFORM-001` (example)
   - Password: `TestPass123`
   - Confirm: `TestPass123`
3. Click **Register**
4. Should see success message

### Step 6.2: Test Login

1. Click **Login**
2. Enter registered email/phone
3. Enter password
4. Select role: **TEAM_LEAD**
5. Click **Login**
6. Should redirect to **Team Leader Dashboard**

### Step 6.3: Create Team

1. On Dashboard, click **"Create Team"**
2. Fill form:
   - Team Name: `Test Team`
   - Add member:
     - Name: `Dev One`
     - Email: `dev@example.com`
     - Phone: `9876543211`
3. Click **Create Team**
4. Should see team created message

### Step 6.4: Submit Application

1. On Dashboard, click **"Problem Statements"**
2. Click any problem
3. Click **"Apply"**
4. Fill form:
   - Select your team
   - Add abstract: `This is our solution...`
   - Upload PPT file (sample.ppt or PDF)
   - Add tech stack: `React, Java, MySQL`
5. Click **Submit**
6. Should see application submitted with **Status 201**

### Step 6.5: Test Duplicate Prevention

1. Try to submit application for **same problem** again
2. Should see error: **Application already submitted for this problem** (Status 409)

✅ If all steps work, integration is successful!

---

## PART 7: Production Deployment

### Step 7.1: Build for Production

**Frontend:**
```powershell
cd frontend
$env:REACT_APP_API_BASE_URL = "https://your-backend-domain.com/api"
npm run build
```

Builds optimized files in `frontend/build/`

**Backend:**
```powershell
cd backend
.\mvnw.cmd clean package
```

Creates `backend/target/backend-0.0.1-SNAPSHOT.jar`

### Step 7.2: Deploy Backend

1. Copy JAR to server
2. Set environment variables on server:
   ```
   DB_USERNAME=prod_user
   DB_PASSWORD=prod_password
   ```
3. Run:
   ```
   java -jar backend-0.0.1-SNAPSHOT.jar
   ```

### Step 7.3: Deploy Frontend

1. Copy `frontend/build` contents to web server (nginx, Apache, etc.)
2. Ensure backend API URL matches deployment domain
3. Access via frontend domain

---

## PART 8: Troubleshooting

### Backend won't start

**Problem:** `error: java not found`
- Solution: Verify JAVA_HOME is set correctly
  ```powershell
  $env:JAVA_HOME
  java -version
  ```

**Problem:** Port 8080 already in use
- Solution: Find and stop process using port 8080
  ```powershell
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  ```

**Problem:** MySQL connection error
- Solution: Verify MySQL is running and credentials are correct
  ```powershell
  mysql -u root -p
  ```

**Problem:** Database doesn't exist
- Solution: Create it again
  ```sql
  CREATE DATABASE Organization_portal;
  ```

### Frontend won't start

**Problem:** `npm: command not found`
- Solution: Reinstall Node.js from nodejs.org

**Problem:** Port 3000 already in use
- Solution: Kill process or use different port
  ```powershell
  npm start -- --port 3001
  ```

**Problem:** Cannot connect to backend API
- Solution: Check REACT_APP_API_BASE_URL environment variable
  ```powershell
  $env:REACT_APP_API_BASE_URL
  # Should show: http://localhost:8080/api
  ```

**Problem:** CORS errors in browser console
- Solution: Backend CORS is open by default. Ensure backend is running.

### Integration issues

**Problem:** Login fails with "Account not found"
- Solution: Register team leader first (Step 6.1)

**Problem:** Application submission fails (500 error)
- Solution: 
  - Check backend logs for errors
  - Verify backend database connection
  - Restart backend

**Problem:** File upload fails
- Solution: 
  - Ensure file is PPT/PPTX/PDF
  - Ensure file size < 20MB
  - Check backend `uploads/` folder has write permissions

---

## PART 9: Key Configuration Reference

### Backend (`application.properties`)

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/Organization_portal
spring.datasource.username=${DB_USERNAME:puja}
spring.datasource.password=${DB_PASSWORD:puja}

# File upload
spring.servlet.multipart.max-file-size=20MB
spring.servlet.multipart.max-request-size=20MB

# Auto-create tables
spring.jpa.hibernate.ddl-auto=update
```

### Frontend (`api.js`)

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";
```

---

## PART 10: Quick Reference Commands

### Start both services (locally)

**Terminal 1 - Backend:**
```powershell
cd Platform\backend
$env:DB_USERNAME="root"
$env:DB_PASSWORD="yourpass"
.\mvnw.cmd spring-boot:run
```

**Terminal 2 - Frontend:**
```powershell
cd Platform\frontend
$env:REACT_APP_API_BASE_URL="http://localhost:8080/api"
npm start
```

### Access points

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/api`
- Backend API Docs: `http://localhost:8080/swagger-ui.html` (if Swagger enabled)

### Database access

```powershell
mysql -u root -p
USE Organization_portal;
SELECT * FROM users;
SELECT * FROM teams;
SELECT * FROM applications;
```

---

## PART 11: Next Steps

1. ✅ All running locally
2. Deploy backend to cloud (AWS, Azure, Heroku, DigitalOcean, etc.)
3. Deploy frontend to CDN/static host (Vercel, Netlify, AWS S3)
4. Configure domain names
5. Enable HTTPS
6. Update `REACT_APP_API_BASE_URL` to production domain
7. Test end-to-end on production

---

## Summary

| Component | Local URL | Status |
|-----------|-----------|--------|
| Frontend | http://localhost:3000 | ✅ React |
| Backend | http://localhost:8080 | ✅ Spring Boot |
| Database | localhost:3306 | ✅ MySQL |
| API Base | http://localhost:8080/api | ✅ Connected |

**Total Setup Time:** ~30-40 minutes on first run

**Key Takeaway:** Both services must be running simultaneously for full functionality.
