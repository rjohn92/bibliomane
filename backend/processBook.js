import { fetchBookMetadata } from "./googleBooksService.js";
import { saveCoverURL, ensureCoversFolder } from "./helpers.js";
import { addBook } from "./addBook.js";


import path from "path";
import fs from "fs";

/**
 * Processes a single book (metadata, cover, and database insert)
 */
async function processBook(metadata, bookFolderPath, bookFile, coverFilePath) {
    console.log(`⚙️  Processing book: ${metadata.title}`);

    if (coverFilePath) {
        console.log(`✅Cover at:  ${coverFilePath} still set in processBook.`)
    }

    // ✅ Add book to database
    await addBook(
        metadata.title,
        metadata.author,
        metadata.publishedYear,
        "No description available",
        "Unknown", // categories (can be fetched later)
        "N/A", // ISBN (can be fetched later)
        path.join(bookFolderPath, bookFile),
        coverFilePath
    );

    console.log(`✅ Book added: ${metadata.title} with cover at ${coverFilePath || "No cover found"}`);
}



export { processBook };
