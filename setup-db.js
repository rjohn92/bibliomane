import pkg from 'pg';
const { Client } = pkg;

import fs from 'fs';
import path from 'path';

import { extractTitle, extractAuthor, extractISBN, extractYearReleased, extractFormat } from './backend/helpers.js';

// Database connection settings
const client = new Client({
  user: 'myuser',
  host: 'localhost',
  database: 'mydatabase',
  password: 'mypassword',
  port: 5432,
});

async function setupDatabase() {
await client.connect();

// SQL command to drop 'library'
const dropTable = `DROP TABLE IF EXISTS library`;

// SQL command to create the 'library' table if it doesn't exist
const createTableQuery = `
  CREATE TABLE library (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    isbn VARCHAR(13),
    year_released INT,
    format VARCHAR(5),
    file_size BIGINT
  );
`;

// Execute the query to create the table
try {
  // Drop the 'library' table if it exists
  await client.query(dropTable);

  // Create the 'library' table
  await client.query(createTableQuery);

  console.log('Table "library" is ready.');
  populateDatabase();
} catch (err) {
  console.error('Error creating table:', err);
  await client.end();
}
};

// Function to populate the database with file information
async function populateDatabase() {
  const directoryPath = 'hdd/Books'; // Change this to your folder path

  try {
    const files = await fs.promises.readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);


      // Extract metadata from file name or elsewhere
      const title = extractTitle(file);
      const author = extractAuthor(file);
      const isbn = extractISBN(file);
      const yearReleased = extractYearReleased(file);
      const format = extractFormat(file);
      const fileSize = (await fs.promises.stat(filePath)).size;

      const insertQuery = `
        INSERT INTO library (title, author, isbn, year_released, format, file_size)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      try {
        await client.query(insertQuery, [title, author, isbn, yearReleased, format, fileSize]);
        console.log(`Inserted file: ${file}`);
      } catch (err) {
        console.error('Error inserting file data:', err);
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  } finally {
    await client.end();
  }
}
