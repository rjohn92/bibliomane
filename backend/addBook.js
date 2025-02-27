import fs from "fs";
import axios from "axios";
import { dbPromise } from "../database/db.js";

/**
 * Adds a book to the database, storing the cover as a BLOB.
 * @param {string} title
 * @param {string} author
 * @param {string} year
 * @param {string} description
 * @param {string} categories
 * @param {string} isbn
 * @param {string} filePath
 * @param {string} coverURL - The URL of the book cover
 */
async function addBook(title, author, year, description, categories, isbn, filePath, coverURL) {
    const db = await dbPromise;

    // Check if the book already exists
    const existingBook = await db.get("SELECT * FROM books WHERE file_path = ?", [filePath]);
    if (existingBook) {
        console.log(`⚠️ Book already exists: ${title} (${year})`);
        return;
    }

    let coverBuffer = null;
    if (coverURL) {
        try {
            // Fetch book cover as binary data
            const coverResponse = await axios.get(coverURL, { responseType: "arraybuffer" });
            coverBuffer = Buffer.from(coverResponse.data, "binary");
        } catch (error) {
            console.warn(`❌ Failed to fetch cover for "${title}"`);
        }
    }

    // Insert the book into the database
    await db.run(
        "INSERT INTO books (title, author, year, description, categories, isbn, cover, file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [title, author, year, description, categories, isbn, coverBuffer, filePath]
    );

    console.log(`✅ Added book: ${title} (${year})`);
}

export { addBook };
