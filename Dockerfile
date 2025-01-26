# Stage 1: Build the application
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Stage 2: Create a lightweight production image
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy only the built app and dependencies from the builder stage
COPY --from=builder /app /app

# Environment variables for the app
ENV NODE_ENV=production
ENV PORT=3000

# Expose the app's port
EXPOSE 3000

# Start the application
CMD ["node", "backend/server.js"]

# Optional Health Check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/bibliomane || exit 1
