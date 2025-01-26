import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from '../routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json()); // Add this line

// Middleware to serve static files (SPA)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// API routes prefixed with /bibliomane
app.use('/bibliomane/api', routes);

// Catch-all route to serve the SPA for /bibliomane
app.get('/bibliomane*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

export default app;
