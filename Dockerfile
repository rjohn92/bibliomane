# Use official Node.js image as a base
FROM node:18

# Install PostgreSQL
RUN apt-get update && apt-get install -y postgresql postgresql-contrib

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Set up the PostgreSQL database (e.g., create tables, etc.)
# You can either add SQL scripts here or do this in the app startup (e.g., server.js)
RUN service postgresql start && \
    sudo -u postgres psql -c "CREATE DATABASE mydatabase;" && \
    sudo -u postgres psql -d mydatabase -c "CREATE TABLE IF NOT EXISTS library (id SERIAL PRIMARY KEY, title VARCHAR(255), author VARCHAR(255), isbn VARCHAR(13), year_released INT, format VARCHAR(5), file_size BIGINT);"

# Expose the port (3000 for Node.js)
EXPOSE 3000

# Command to start both PostgreSQL and the Node.js app
CMD service postgresql start && node server.js
