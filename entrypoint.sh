#!/bin/bash
set -euo pipefail  # Stop if any command fails

echo "📦 Bootstrapping Bibliomane..."

# echo "🔧 Installing Dependencies..."
# apt update && apt install -y sqlite3 nodejs npm fonts-noto-color-emoji

# echo "📦 Installing Node Modules..."
# npm install

echo "🌐 Initializing  Database..."
node database/db.js

echo "📚 Running Scan Library Script..."
node backend/scanLibrary.js

# echo "🔍 Checking Database..."
# sqlite3 database/bibliomane.db "SELECT title FROM books;"

echo "🌐 Starting Server..."
node backend/server.js