import fs from "fs";
import path from "path";
import { addBook } from "./addBook.js";
import { fetchBookMetadata } from "./googleBooksService.js";// Will be implemented later

const LIBRARY_PATH = "/app/hdd/Books"; // Change this to your actual books directory

/**
 * Scans the book directory and adds new books to the database.
 */
async function scanLibrary() {
    console.log("📚 Scanning book library...");

    const files = fs.readdirSync(LIBRARY_PATH).filter(file => file.endsWith(".epub") || file.endsWith(".pdf"));

    for (const file of files) {
        const filePath = path.join(LIBRARY_PATH, file);
        const filename = path.basename(file, path.extname(file));

        // Extract metadata from filename (Example: "Hatchet-Gary Paulsen(1986).epub")
        const match = filename.match(/^(.+)-(.+)\s?\((\d{4})\)\.epub$/);
        if (!match) {
            console.warn(`❗ Skipping file (bad format): ${filename} ❗`);
            continue;
        }

        const [_, author, title, year] = match.map(s => s.trim());

        // Fetch book metadata
        const metadata = await fetchBookMetadata(title, author);
        if (!metadata) {
            console.warn(`❌ No metadata found for: ${title} by ${author}`);
            continue;
        }

        // Add book to the database
        await addBook(
            metadata.title,
            metadata.author,
            metadata.publishedYear || year,
            metadata.description,
            metadata.categories.join(", "),
            metadata.isbn,
            filePath,
            metadata.coverImage // URL of the book cover
        );
    }

    console.log("✅ Library scan complete.");
}

scanLibrary();
