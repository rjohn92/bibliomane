import { dbPromise } from "../database/db.js";
import fetch from "node-fetch";

/**
 * Adds a book to the database, storing the cover as a BLOB.
 * @param {string} title
 * @param {string} author
 * @param {string} year
 * @param {string} description
 * @param {string} categories
 * @param {string} isbn
 * @param {string} filePath
 * @param {string} coverURL
 */
async function addBook(title, author, year, description, categories, isbn, filePath, coverURL) {
    try {
        const db = await dbPromise;

        // Check if book already exists
        const existingBook = await db.get("SELECT * FROM books WHERE file_path = ?", [filePath]);
        if (existingBook) {
            console.log(`⚠️ Book already exists: ${title} (${year})`);
            return;
        }

        // Fetch cover image as BLOB
        let coverBuffer = null;
        if (coverURL) {
            try {
                const response = await fetch(coverURL);
                if (response.ok) {
                    coverBuffer = Buffer.from(await response.arrayBuffer());
                } else {
                    console.warn(`⚠️ Failed to fetch cover for "${title}"`);
                }
            } catch (error) {
                console.warn(`⚠️ Cover fetch error: ${error.message}`);
            }
        }

        // Insert into database
        await db.run(
            "INSERT INTO books (title, author, year, description, categories, isbn, cover, file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [title, author, year, description, categories, isbn, coverBuffer, filePath]
        );

        console.log(`✅ Added book: ${title} (${year})`);
    } catch (error) {
        console.error(`❌ Error adding book: ${error.message}`);
    }
}

export { addBook };
