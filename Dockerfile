FROM node:20-slim

# Set working directory
WORKDIR /app

# Install OS-level dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        sqlite3 \
        calibre \
        fonts-noto-color-emoji && \
    rm -rf /var/lib/apt/lists/*

# Set environment before installing deps
ENV NODE_ENV=production
# ENV PORT=3001

# Install Node deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

COPY entrypoint.sh /app/entrypoint.sh

# Start the app
ENTRYPOINT ["/app/entrypoint.sh"]
