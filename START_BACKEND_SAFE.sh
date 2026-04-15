#!/usr/bin/env bash

set -e

echo
echo "========================================"
echo "MSME Backend Safe Start (Mac/Linux)"
echo "========================================"
echo

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

if [[ ! -f "$BACKEND_DIR/pom.xml" ]]; then
  echo "ERROR: Could not find backend/pom.xml"
  echo "Run this script from the MSME root folder."
  exit 1
fi

if ! command -v java >/dev/null 2>&1; then
  echo "ERROR: Java is not available in PATH"
  exit 1
fi

read -r -p "Enter DB username [root]: " DB_USERNAME
DB_USERNAME=${DB_USERNAME:-root}

read -r -s -p "Enter DB password: " DB_PASSWORD
echo

PID_8080=$(lsof -ti tcp:8080 || true)
if [[ -n "$PID_8080" ]]; then
  echo
  echo "Port 8080 is in use by PID $PID_8080."
  read -r -p "Kill that process and continue? [Y/N]: " KILL_EXISTING
  if [[ "$KILL_EXISTING" =~ ^[Yy]$ ]]; then
    kill -9 "$PID_8080" || true
    echo "Killed PID $PID_8080."
  else
    echo "Aborted. Backend not started."
    exit 1
  fi
fi

echo
echo "Starting backend..."
echo "DB_USERNAME=$DB_USERNAME"

cd "$BACKEND_DIR"
DB_USERNAME="$DB_USERNAME" DB_PASSWORD="$DB_PASSWORD" ./mvnw spring-boot:run
