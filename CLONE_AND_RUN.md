# Complete Step-by-Step Clone & Run Guide
## For Fresh Laptop Setup (From Scratch)

---

## STEP 1: Install Prerequisites (15 minutes)

### 1.1 Install Java 21

**Windows:**
1. Go to: https://www.oracle.com/java/technologies/downloads/
2. Download **JDK 21 Windows Installer**
3. Double-click installer
4. Click **Next** → **Accept License** → **Next** → **Install**
5. Click **Close**

**Mac:**
```bash
brew install openjdk@21
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install openjdk-21-jdk
```

### 1.2 Verify Java Installation

Open **Command Prompt** or **Terminal** and type:
```powershell
java -version
```

You should see:
```
java version "21.0.x"
```

✅ If yes, continue. If no, Java not installed correctly.

---

### 1.3 Install Node.js + npm

**Windows:**
1. Go to: https://nodejs.org/
2. Download **LTS version** (click green button)
3. Double-click installer
4. Click **Next** multiple times
5. Click **Install** → **Finish**

**Mac:**
```bash
brew install node
```

**Linux:**
```bash
sudo apt-get install nodejs npm
```

### 1.4 Verify Node.js Installation

Open new **Command Prompt** or **Terminal**:
```powershell
node --version
npm --version
```

Should show version numbers like:
```
v18.16.0
9.6.7
```

✅ If yes, continue.

---

### 1.5 Install MySQL 8+

**Windows:**
1. Go to: https://dev.mysql.com/downloads/mysql/
2. Download **MySQL Community Server** (pick Windows installer)
3. Double-click installer
4. Click **Next**
5. Choose **Standalone MySQL Server**
6. Click **Next** multiple times
7. At "MySQL Server Instance Configuration":
   - Leave Port as **3306**
   - Click **Next**
8. At "MySQL Server Concept Configuration":
   - Select **Standard System Default**
   - Click **Next**
9. At "Service Configuration":
   - Check "Configure MySQL Server as Windows Service"
   - Click **Next**
10. At "Server File Permissions":
    - Click **Next**
11. At "Accounts and Roles":
    - **Root password:** Type `puja` (for simplicity, can be anything)
    - **Confirm password:** Type `puja`
    - Click **Next**
12. Click **Execute** → **Finish** → **Close**

**Mac:**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
# Press Enter for all prompts except password
# Set password as: puja
```

**Linux:**
```bash
sudo apt-get install mysql-server
sudo mysql_secure_installation
# Set root password as: puja
```

### 1.6 Verify MySQL Installation

Open **Command Prompt/Terminal**:
```powershell
mysql --version
```

Should show:
```
mysql  Ver 8.0.x for ...
```

✅ If yes, all prerequisites done!

---

## STEP 2: Clone Repository (5 minutes)

### 2.1 Choose Where to Clone

Open **File Explorer** (Windows) or **Finder** (Mac) and choose a location:
- **Windows:** `C:\Users\YourUsername\Desktop`
- **Mac:** `~/Desktop`
- **Linux:** `~/Desktop`

Open **Command Prompt/Terminal** in that location.

### 2.2 Clone Using Git (Easiest)

If you have Git installed:
```powershell
git clone https://github.com/your-organization/Platform.git
cd Platform
```

### 2.3 Clone Without Git (If Git Not Available)

1. Go to GitHub repository URL
2. Click **Code** → **Download ZIP**
3. Extract ZIP to your chosen location
4. Open extracted folder named **Platform** (or the repository name used by your organization)

### 2.4 Verify Folder Structure

You should now see:
```
Platform/  (or the repository folder name you downloaded)
   ├── backend/
   ├── frontend/
   ├── README.md
   ├── DEPLOYMENT_GUIDE.md
   ├── QUICKSTART.md
   ├── START_LOCAL.bat
   ├── START_LOCAL.sh
   └── CHECK_SETUP.bat
```

✅ If yes, repository cloned successfully!

---

## STEP 3: Check Prerequisites (2 minutes)

### 3.1 Windows Users Only

In the project folder, double-click:
```
CHECK_SETUP.bat
```

A window will open showing:
- ✓ Java installed
- ✓ Node.js installed
- ✓ npm installed
- ✓ MySQL installed

If all show ✓, continue to Step 4.

If any show ✗, go back and install that component.

### 3.2 Mac/Linux Users

Open **Terminal** in the project folder:
```bash
bash CHECK_SETUP.bat    # Will work on Mac/Linux too
```

---

## STEP 4: Create Database (3 minutes)

### 4.1 Open MySQL

**Windows:**
```powershell
mysql -u root -p
# When prompted for password, type: puja
# Press Enter
```

**Mac/Linux:**
```bash
mysql -u root -p
# When prompted for password, type: puja
# Press Enter
```

You should see prompt:
```
mysql>
```

### 4.2 Create Database

Type this command:
```sql
CREATE DATABASE Organization_portal;
```

Press **Enter**.

Then type:
```sql
EXIT;
```

✅ Database created!

---

## STEP 5: Start Backend (Easiest Way - 5 minutes)

### 5.1 Windows Users

In the project folder, double-click:
```
START_LOCAL.bat
```

A window will ask:
```
Enter MySQL password (press Enter if none):
```

Type: `puja` and press **Enter**.

Wait 8-10 seconds. You should see:
```
Started BackendApplication in X.XXX seconds
Tomcat started on port 8080
```

**Keep this window open!** Don't close it.

### 5.2 Mac/Linux Users

Open **Terminal** in the project folder:
```bash
bash START_LOCAL.sh
```

Enter username: `root`
Enter password: `puja`

Wait 8-10 seconds until you see:
```
Started BackendApplication in X.XXX seconds
Tomcat started on port 8080
```

**Keep this terminal open!** Don't close it.

### 5.3 Manual Windows (If START_LOCAL.bat doesn't work)

Open **Command Prompt** in the project backend folder (e.g., Platform\backend):
```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="puja"
.\mvnw.cmd spring-boot:run
```

Wait for same "Started" message.

---

## STEP 6: Start Frontend (In New Terminal - 5 minutes)

### 6.1 Open New Terminal/Command Prompt

**Do NOT use the terminal from Step 5!** Open a **new** one.

Navigate to the project folder (example uses `Platform`):
```powershell
cd Platform
```

### 6.2 Windows Users

```powershell
cd frontend
$env:REACT_APP_API_BASE_URL="http://localhost:8080/api"
npm install
npm start
```

Wait 30-40 seconds. Browser should automatically open at:
```
http://localhost:3000
```

If browser doesn't open, manually go to that URL.

### 6.3 Mac/Linux Users

```bash
cd frontend
export REACT_APP_API_BASE_URL="http://localhost:8080/api"
npm install
npm start
```

Same as Windows - wait 30-40 seconds for browser to open.

---

## STEP 7: Test It's Working (5 minutes)

### 7.1 Browser Opens at http://localhost:3000

You should see the platform homepage.

### 7.2 Register as Team Leader

1. Click **"Register as Team Leader"** button
2. Fill form:
   - **Name:** `Test User`
   - **Email:** `test@example.com`
   - **Phone:** `9876543210`
   - **College ID:** `PLATFORM-001` (example)
   - **Password:** `Test123456`
   - **Confirm Password:** `Test123456`
3. Click **Register**
4. See success message: **"Registration successful!"**

### 7.3 Login

1. Click **Login** button
2. Enter:
   - **Email/Phone:** `test@example.com`
   - **Password:** `Test123456`
   - **Role:** `TEAM_LEAD` (from dropdown)
3. Click **Login**
4. Should redirect to **Team Leader Dashboard**

### 7.4 Create Team

1. On Dashboard, click **"Create Team"**
2. Fill form:
   - **Team Name:** `My Test Team`
   - Click **Add Member**
   - **Member Name:** `Dev One`
   - **Member Email:** `dev@example.com`
   - **Member Phone:** `9876543211`
3. Click **Create Team**
4. See success: **"Team created successfully"**

### 7.5 Submit Application

1. Click **Problem Statements** from sidebar
2. Click any problem (e.g., "AI Based Crop Disease Detection")
3. Click **Apply**
4. Fill:
   - **Team:** Select your team
   - **Abstract:** `This is my solution to the problem`
   - **Tech Stack:** `React, Java, MySQL`
   - **Upload PPT:** Click and select any `.ppt` or `.pdf` file
5. Click **Submit**
6. See: **Application submitted successfully** (Status 201)

✅ **All working! Integration successful!**

---

## STEP 8: Understanding the Terminal Windows

You should now have 2 terminal windows open:

### Terminal Window 1 (Backend)
```
Tomcat started on port 8080
```

Shows backend logs. Must stay open.

### Terminal Window 2 (Frontend)
```
Webpack compiled successfully
Local:   http://localhost:3000
```

Shows frontend development server. Must stay open.

**If you close either, the app stops working.**

---

## STEP 9: Stopping the Services

### To Stop Everything

**Terminal 1 (Backend):**
- Press `Ctrl + C`
- Type `Y` if asked
- Window closes

**Terminal 2 (Frontend):**
- Press `Ctrl + C`
- Type `Y` if asked
- Window closes

### To Start Again Later

Just repeat **STEP 5** and **STEP 6**.

---

## STEP 10: Troubleshooting

### Problem: "Java not found"
- Solution: Java not installed or PATH not set
- Reinstall Java and restart terminal

### Problem: "npm not found"
- Solution: Node.js not installed
- Reinstall from nodejs.org

### Problem: "Cannot connect to database"
- Solution: MySQL not running
  - **Windows:** `net start MySQL80` in Command Prompt (Admin)
  - **Mac/Linux:** `brew services start mysql`

### Problem: "Port 8080 already in use"
- Solution: Kill existing process
  - **Windows:** `netstat -ano | findstr :8080` → find PID → `taskkill /PID <PID> /F`
  - **Mac/Linux:** `lsof -i :8080` → `kill -9 <PID>`

### Problem: "Port 3000 already in use"
- Solution: Kill existing process (same as above, replace 3000)

### Problem: Frontend shows "Cannot reach backend"
- Solution: Backend not running. Check Terminal 1 is still showing logs.

### Problem: "Application submission shows 500 error"
- Solution: 
  - Check backend is running
  - Restart both services
  - Check browser console for error details

---

## STEP 11: Quick Reference

### Access Points

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | Development |
| Backend API | http://localhost:8080 | Development |
| Backend API Docs | http://localhost:8080/swagger | If enabled |

### Database Access

```powershell
mysql -u root -p
# Password: puja

   USE Organization_portal;
SELECT * FROM users;
SELECT * FROM teams;
SELECT * FROM applications;
```

### Directory Structure

```
Platform/  (or your project folder name)
├── backend/
│   ├── src/main/java/       (Java code)
│   ├── src/main/resources/  (Configs)
│   ├── target/              (Compiled JAR)
│   └── mvnw.cmd             (Maven wrapper)
├── frontend/
│   ├── src/                 (React code)
│   ├── public/              (Static files)
│   ├── node_modules/        (Dependencies)
│   └── package.json         (npm config)
└── uploads/                 (File uploads)
   └── applications/
```

### Common Commands

```powershell
# Navigate to folder
cd Platform

# Start backend
cd backend
.\mvnw.cmd spring-boot:run

# Start frontend (in new terminal)
cd frontend
npm start

# Install dependencies
npm install

# Build for production
npm run build

# View logs
Type in terminal where service is running
```

---

## Summary

✅ **Prerequisites installed:** Java, Node.js, MySQL  
✅ **Repository cloned:** Project folder exists  
✅ **Database created:** Organization_portal  
✅ **Backend running:** Port 8080  
✅ **Frontend running:** Port 3000  
✅ **Full stack integrated:** Tested and working  

**Total time:** ~1-1.5 hours first time

**Next time:** ~10 minutes (just run START_LOCAL.bat + npm start)

---

## Need More Help?

- Full guide: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Production deployment: See [DEPLOYMENT_GUIDE.md#part-7-production-deployment](DEPLOYMENT_GUIDE.md)
- Quick reference: See [QUICKSTART.md](QUICKSTART.md)
