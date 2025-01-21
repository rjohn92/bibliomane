import express from 'express';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';  // Make sure this is imported

const { Client } = pg;

// Get the current directory using fileURLToPath and import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to PostgreSQL
const client = new Client({
    user: 'postgres',     // Username for PostgreSQL
    host: 'postgres',     // Use the service name defined in Docker Compose
    database: 'filedb',   // Database name in PostgreSQL
    password: 'password', // Password for the user
    port: 5432,           // Default PostgreSQL port
});

client.connect();

// Serve static files (CSS, etc.)
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM books;');
    const files = result.rows;
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
  } catch (err) {
    console.error('Error fetching data', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:5000');
});
