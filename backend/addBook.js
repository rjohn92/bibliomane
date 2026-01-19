import { dbPromise } from "../database/db.js";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { saveCoverURL } from "./helpers.js";
import { countReset } from "console";

// const COVER_STORAGE_PATH = "/app/hdd/covers"; // Your books directory

// // ✅ Ensure the covers directory exists
// if (!fs.existsSync(COVER_STORAGE_PATH)) {
//     fs.mkdirSync(COVER_STORAGE_PATH, { recursive: true }); // Create folder if it doesn't exist
// }

/**
 * Adds a book to the database, storing the cover as a BLOB.
 * @param {string} title
 * @param {string} author
 * @param {string} year
 * @param {string} description
 * @param {string} categories
 * @param {string} isbn
 * @param {string} filePath
 * @param {Buffer|string|null} coverURL - Either a Buffer, a URL, or null
 */
// backend/addBook.js
export async function addBook(db, {
  title, author, year,
  description, categories, isbn,
  filePath, coverPath
}) {
  await db.run(
    `INSERT INTO books (title, author, year, description, categories, isbn, coverPath, filePath)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, author, year, description, categories, isbn, coverPath, filePath]
  );
}
