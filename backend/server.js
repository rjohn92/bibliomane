import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; // This will allow us to get the path of the current file


dotenv.config();
const port = process.env.PORT

const app = express();

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files (HTML, CSS, etc.) from the 'public' directory
app.use(express.static(path.join( 'frontend', 'public')));

// Route to serve the index.html page
app.get('/', (req, res) => {
  console.log('Serving index.html...');
  res.sendFile(path.join('frontend', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
