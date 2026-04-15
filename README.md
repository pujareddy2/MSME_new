# MSME Hackathon Portal (Full Stack)

This repository now runs as an integrated full-stack system:

- Frontend: React application in `frontend/`
- Backend: Spring Boot REST API in `backend/`
- Database: MySQL (`msme_portal`)

## 🚀 Quick Start (For Immediate Setup)

### For Windows users
Double-click and run: [`START_LOCAL.bat`](START_LOCAL.bat)

Safe backend-only start (prevents port 8080 conflicts): [`START_BACKEND_SAFE.bat`](START_BACKEND_SAFE.bat)

### For Mac/Linux users
Run in terminal: `bash START_LOCAL.sh`

Safe backend-only start (prevents port 8080 conflicts): `bash START_BACKEND_SAFE.sh`

### For Detailed Step-by-Step Instructions
See: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) (11 parts, 40-minute setup)

---

## 📚 Choose Your Guide

| Scenario | Time | Link |
|----------|------|------|
| **Clone on new laptop & run** | 1-1.5 hrs | [CLONE_AND_RUN.md](CLONE_AND_RUN.md) ⭐ START HERE |
| **Just run it now on this laptop** | 5 min | [QUICKSTART.md](QUICKSTART.md) |
| **Detailed reference guide** | 40 min | [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) |
| **Production deployment** | 1 hour | [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#part-7-production-deployment) |
| **Check if prereqs installed** | 2 min | Run `CHECK_SETUP.bat` |

---

## Integration Status (Important Answer)

### Is frontend + backend + database integrated?

Yes, they are integrated for local and server-based execution.

The integration was validated end-to-end with a smoke test flow:
1. Team leader registration
2. Team creation
3. First application submission (created successfully)
4. Duplicate application submission (rejected with conflict)

Latest validated smoke output included:
- `FirstSubmissionStatus=201`
- `DuplicateSubmissionStatus=409`

### Can you deploy directly right now without any config changes?

Not fully, if you deploy frontend and backend to different hosts as-is.

Reason:
- The frontend was previously hardcoded to `http://localhost:8080/api`.
- This has now been improved to use `REACT_APP_API_BASE_URL` with localhost fallback.

So deployment works cleanly after setting environment variables correctly for:
- Frontend API URL
- Backend database credentials

## What Was Done (Summary of Integration and Fixes)

### Backend integration and fixes
- Added/extended auth endpoints for team leader registration/login.
- Wired real team creation and leader/team lookup APIs.
- Wired real problem statement and application submission APIs.
- Added notification and profile APIs.
- Added file upload validation and storage for PPT/PPTX/PDF (20MB max).
- Added duplicate submission guard (`409 Conflict`).
- Fixed runtime lazy-loading serialization failure that was causing `500` on first submission.
- Kept CORS enabled (`@CrossOrigin(origins = "*")`) across API controllers for cross-host frontend access.
- Added default problem seeding at startup via `DataInitializer`.

### Frontend integration and fixes
- Rewired pages to call backend APIs instead of static/local-only flows.
- Added role-aware dashboard routing and session helpers.
- Added profile and leaderboard pages connected to backend.
- Added notification bell backed by backend notifications API.
- Upgraded API client to support environment-based base URL:
  - `REACT_APP_API_BASE_URL` (new)
  - fallback: `http://localhost:8080/api`
- Preserved existing UI style/theme and improved typography readability.

### Validation completed
- Frontend build validation completed successfully.
- Backend tests completed successfully.
- End-to-end API smoke flow passed after final fixes.

---

## Project Structure

```
MSME/
  backend/
    src/main/java/com/sih/backend/
    src/main/resources/application.properties
    tmp/api_smoke_test.ps1
  frontend/
    src/
    package.json
  README.md
```

---

## Requirements

Install these first:

1. Java 17+ (Java 21 used during validation)
2. Node.js 18+ and npm
3. MySQL 8+
4. Git (optional but recommended)

---

## Database Setup

### 1. Create database

```sql
CREATE DATABASE msme_portal;
```

### 2. Backend DB config

The backend reads credentials from environment variables:

- `DB_USERNAME`
- `DB_PASSWORD`

Fallback defaults currently present in `application.properties`:
- username: `puja`
- password: `puja`

> Recommended: always set real environment variables in production.

---

## Local Run Guide (Step-by-Step)

**For detailed instructions with every step, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

### 1. Start backend

Recommended (safe, auto-handles port 8080 conflict):

Windows:

```powershell
.\START_BACKEND_SAFE.bat
```

Mac/Linux:

```bash
bash START_BACKEND_SAFE.sh
```

Windows (PowerShell):

```powershell
# Check if backend is already running
Invoke-WebRequest -Uri "http://localhost:8080/api/problems" -UseBasicParsing | Select-Object -ExpandProperty StatusCode

# If you get 200, backend is already running. Do not start a second instance.
# If port conflict occurs, free 8080 and start once:
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F

$env:DB_USERNAME="root"
$env:DB_PASSWORD="puja"  # use your MySQL password
& "C:\Desktop\MSME\backend\mvnw.cmd" -f "C:\Desktop\MSME\backend\pom.xml" spring-boot:run
```

Mac/Linux (bash/zsh):

```bash
# Check if backend is already running
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/api/problems

# If you get 200, backend is already running. Do not start a second instance.
# If port conflict occurs, free 8080 and start once:
lsof -i :8080
kill -9 <PID_NUMBER>

cd backend
export DB_USERNAME="root"
export DB_PASSWORD="puja"   # use your MySQL password
./mvnw spring-boot:run
```
to check  backedn s running or not "Invoke-WebRequest -Uri "http://localhost:8080/api/problems" -UseBasicParsing | Select-Object -ExpandProperty StatusCode"      


Backend runs at: `http://localhost:8080`

### 2. Start frontend (new terminal)

```powershell
Set-Location .\frontend
$env:REACT_APP_API_BASE_URL="http://localhost:8080/api"
npm install
npm start
```

Important:
- Do not run placeholder values like "your_mysql_password" literally.
- If your MySQL password is different, set that exact value in `DB_PASSWORD`.

Frontend runs at: `http://localhost:3000`

---

## Production Deployment Guide

Deploy backend and frontend separately, then connect with env vars.

## 1. Deploy backend

Set at least these environment variables in your backend host:

- `DB_USERNAME`
- `DB_PASSWORD`
- MySQL JDBC URL if your host differs from default (configure in backend properties as needed)

Build command:

```bash
./mvnw clean package
```

Run JAR:

```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

## 2. Deploy frontend

Set frontend environment variable before build:

- `REACT_APP_API_BASE_URL=https://your-backend-domain/api`

Build:

```bash
npm run build
```

Host `frontend/build` on your static host.

## 3. Verify cross-service connectivity

After deployment:
1. Open frontend URL.
2. Register team leader.
3. Create team.
4. Submit an application.
5. Confirm submission appears and duplicate submission returns conflict.

---

## Smoke Test (Backend API)

A smoke script exists at:
- `backend/tmp/api_smoke_test.ps1`

Run after backend is up:

```powershell
Set-Location .\backend
.\tmp\api_smoke_test.ps1
```

Expected key checks:
- `FirstSubmissionStatus=201`
- `DuplicateSubmissionStatus=409`

---

## Important Operational Notes

1. File uploads are saved under backend runtime folder:
   - `backend/uploads/applications`
2. For cloud deployment, use persistent storage or object storage for uploads.
3. `spring.jpa.hibernate.ddl-auto=update` is currently enabled.
   - Good for development
   - For production, move to controlled migrations (Flyway/Liquibase recommended)
4. CORS currently allows all origins for easy integration.
   - Restrict this in production to your frontend domain.

---

## Troubleshooting

### Backend does not start
- Check Java version (`java -version`)
- Check MySQL is running
- Check DB credentials env vars
- Check port 8080 is free
- If you see `Port 8080 was already in use`, stop old process and start only one backend instance:

```powershell
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F
```

### Frontend cannot call backend
- Confirm backend URL is reachable
- Confirm `REACT_APP_API_BASE_URL` is set correctly
- Confirm browser dev tools network tab for failing endpoint

### 500 errors on submission
- Ensure backend is running latest code
- Confirm database schema updated automatically on startup
- Check backend logs for stack trace

---

## Quick Final Answer

- Integrated: Yes (frontend + backend + database are connected and validated).
- Deploy directly with zero config: No.
- Deploy with proper env configuration (backend DB vars + frontend API base URL): Yes.
