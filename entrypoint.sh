#!/bin/bash
set -euo pipefail  # Stop if any command fails

echo "📦 Bootstrapping Bibliomane..."

echo "🌐 Initializing  Database..."
node database/db.js

echo "📚 Running Scan Library Script..."
node backend/scanLibrary.js

# echo "🔍 Checking Database..."
# sqlite3 database/bibliomane.db "SELECT title FROM books;"

echo "🌐 Starting Server..."
node backend/server.js