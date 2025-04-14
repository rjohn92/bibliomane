import express from 'express';
import {dbPromise} from '../database/db.js';

const router = express.Router();

// GET /books - Fetch all books
router.get('/books', async (req, res) => {
  try {

      const db = await dbPromise;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page -1) * limit;

      const books = await db.all("SELECT * FROM books ORDER BY id LIMIT ? OFFSET ?", [limit, offset]);

      const totalRow = await db.get(`SELECT COUNT(*) as count FROM books`);
      const total = totalRow?.count || 0;

      console.log("📚 Sending books:", books);

      if (books.length===0) {
        console.warn("❗ No books found ❗")
      }

      res.json({books, total})



  } catch (err) {
      console.error('Error fetching books:', err.message);
      res.status(500).send('Internal Server Error');
  }
});


// POST /books - Add a new book
router.post('/books', async (req, res) => {
  const { file_name, filePath, file_size, modified_at } = req.body;

  if (!file_name || !filePath || !file_size || !modified_at) {
    return res.status(400).send('Missing required fields');
  }

  try {
      const db = await dbPromise;
      await db.run(
        `INSERT INTO books (file_name, filePath, file_size, modified_at)
         VALUES (?, ?, ?, ?)`,
        [file_name, filePath, file_size, modified_at]
      );
      res.status(201).send("Book added successfully");
  } catch (err) {
      console.error('Error inserting book metadata:', err.message);
      res.status(500).send('Internal Server Error');
  }
});

export { router};
