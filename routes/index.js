import express from 'express';
import db from '../services/db.js';

const router = express.Router();

// GET /books - Fetch all books
router.get('/books', async(req, res) => {
    db.all('SELECT * FROM books ORDER BY id', [], (err, rows) => {
      if (err) {
        console.error('Error fetching books:', err.message);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(rows); // Send the rows as JSON
      }
    });
  });
  

// POST /books - Add a new book
router.post('/books', (req, res) => {
  const { file_name, file_path, file_size, modified_at } = req.body;

  if (!file_name || !file_path || !file_size || !modified_at) {
    return res.status(400).send('Missing required fields');
  }

  db.run(
    `INSERT INTO books (file_name, file_path, file_size, modified_at)
     VALUES (?, ?, ?, ?)`,
    [file_name, file_path, file_size, modified_at],
    function (err) {
      if (err) {
        console.error('Error inserting book metadata:', err.message);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(201).send(`Book added with ID: ${this.lastID}`);
      }
    }
  );
});

export default router;
