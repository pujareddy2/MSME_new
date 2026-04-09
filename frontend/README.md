# Frontend Guide

The primary project documentation is now in the root README:
- `../README.md`

This frontend uses React and connects to the backend API using:
- `REACT_APP_API_BASE_URL`

If this variable is not set, it falls back to:
- `http://localhost:8080/api`

## Local frontend run

```powershell
Set-Location .\frontend
$env:REACT_APP_API_BASE_URL="http://localhost:8080/api"
npm install
npm start
```

## Build frontend

```powershell
Set-Location .\frontend
npm run build
```

For complete backend + database + deployment instructions, use the root README.
