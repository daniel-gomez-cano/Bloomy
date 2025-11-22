#!/usr/bin/env bash
set -e
echo "[Bloomy] Monorepo build starting..."

# Frontend build
echo "[Bloomy] Building client (Vite)..."
cd client/bloomy-project
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
npm run build

# Backend install
echo "[Bloomy] Installing server deps..."
cd ../../server
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
echo "[Bloomy] Build complete."