#!/bin/bash
set -e  # Stop if any command fails

#echo "Setting up Container..."
#docker run --rm -it --env-file .env -v "$(pwd)":/app -w /app debian:latest /bin/bash



echo "🔧 Installing Dependencies..."
apt update && apt install -y sqlite3 nodejs npm fonts-noto-color-emoji

echo "📦 Installing Node Modules..."
npm install

echo "📚 Running Scan Library Script..."
node backend/scanLibrary.js

echo "🔍 Checking Database..."
sqlite3 database/bibliomane.db ".tables"
