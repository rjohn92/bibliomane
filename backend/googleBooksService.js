import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

console.log("API KEY (from .env): ", process.env.API_KEY);

const GOOGLE_BOOKS_API_KEY = process.env.API_KEY;

/**
 * Extract metadata (title, author, year) from book filenames.
 * Example: "George Orwell-1984(1949).EPUB"
 */
function parseBookFilename(filename) {
    const pattern = /^(.+?)[-_](.+?)(?:\s\((\d{4})\))?$/;
    const match = filename.match(pattern);

    if (!match) {
        console.warn(`Filename format incorrect: ${filename}`);
        //return null;
    }
    const [title, author, year] = match.map(s => s.trim());

    console.log(`🔍 Extracted Metadata: Title="${title}", Author="${author}", Year="${year || 'Unknown'}"`);
    return {
        title: match[1].trim(),
        author: match[2].trim(),
        year: match[3].trim(),
        format: match[4].trim(),
    };
}

/**
 * Fetch book metadata from Google Books API.
 * @param {string} title
 * @param {string} author
 * @returns {Object} Book metadata
 */
async function fetchBookMetadata(title, author) {
    const queryWithAuthor = `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
    const queryTitleOnly = `intitle:${encodeURIComponent(title)}`;

    const url = `https://www.googleapis.com/books/v1/volumes?q=${queryWithAuthor}&key=${GOOGLE_BOOKS_API_KEY}`;

    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

        let data = await response.json();
        if (!data.items || data.items.length === 0) {
            console.warn(`❌ No results for "${title}" by "${author}", trying title-only search...`);
            response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${queryTitleOnly}&key=${GOOGLE_BOOKS_API_KEY}`);
            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
            data = await response.json();
        }

        if (!data.items || data.items.length === 0) {
            console.warn(`❌ Still no results for "${title}", skipping.`);
            return null;
        }

        const bookInfo = data.items[0].volumeInfo;
        return {
            title: bookInfo.title || title,
            author: bookInfo.authors?.join(", ") || author,
            publishedYear: bookInfo.publishedDate?.substring(0, 4) || "Unknown",
            description: bookInfo.description || "No description available",
            categories: bookInfo.categories || [],
            isbn: bookInfo.industryIdentifiers?.map(i => i.identifier).join(", ") || "N/A",
            coverImage: bookInfo.imageLinks?.thumbnail || null,
        };
    } catch (error) {
        console.error(`❌ Error fetching metadata: ${error.message}`);
        return null;
    }
}


export { parseBookFilename, fetchBookMetadata };
