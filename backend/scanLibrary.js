import fs from "fs";
import path from "path";
import { addBook } from "./addBook.js";
import { fetchBookMetadata } from "./googleBooksService.js";// Will be implemented later

const LIBRARY_PATH = "/app/hdd/Books"; // Change this to your actual books directory
const filenames = fs.readdirSync(LIBRARY_PATH);

/**
 * Scans the book directory and adds new books to the database.
 */
async function scanLibrary() {
    console.log("📚 Scanning book library...");
    console.log(filenames)
    for (const filename of filenames) {    
        console.log(`📖 Checking: ${filename}`); // Debugging output
        // Extract metadata from filename (Example: "Hatchet-Gary Paulsen(1986).epub")
        const regex = /^(.+?)\s*-\s*([\w\s.,'-]+?)(?:\s*\((\d{4})\))?\.(epub|pdf)$/i;
        const match = filename.match(regex);

        if (!match) {
            console.warn(`❗ Skipping file (bad format): ${filename} ❗`);
        }
        const [_, title, author, year, format] = match;
        console.log(`✅ Parsed: Title="${title}", Author="${author}", Year="${year || "N/A"}", Format="${format}"`);
        

        //const [_, title, author, year] = match;

        // Fetch book metadata
        const metadata = await fetchBookMetadata(title, author);
        console.log(metadata);
        if (!metadata) {
            console.warn(`❌ No metadata found for: ${title} by ${author}`);
        }
    };


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

scanLibrary();
