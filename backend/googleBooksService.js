import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_BOOKS_API_KEY = process.env.API_KEY;

/**
 * Extract metadata (title, author, year) from book filenames.
 * Example: "George Orwell-1984(1949).EPUB"
 */
function parseBookFilename(filename) {
    const pattern = /^(.+?)-(.+?)\((\d{4})\)(.+)$/;
    const match = filename.match(pattern);

    if (!match) {
        console.warn(`Filename format incorrect: ${filename}`);
        return null;
    }

    return {
        author: match[1].trim(),
        title: match[2].trim(),
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
    try {
        const query = `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}`;

        const response = await axios.get(url);
        const books = response.data.items;

        if (!books || books.length === 0) {
            console.warn(`No results found for: ${title} by ${author}`);
            return null;
        }

        // Get the first book result
        const bookInfo = books[0].volumeInfo;

        return {
            title: bookInfo.title || title,
            author: bookInfo.authors ? bookInfo.authors.join(", ") : author,
            publishedYear: bookInfo.publishedDate ? bookInfo.publishedDate.substring(0, 4) : "Unknown",
            description: bookInfo.description || "No description available",
            categories: bookInfo.categories || [],
            isbn: bookInfo.industryIdentifiers ? bookInfo.industryIdentifiers.map(i => i.identifier).join(", ") : "N/A",
            coverImage: bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : null,
        };
    } catch (error) {
        console.error("Error fetching book metadata:", error.message);
        return null;
    }
}

export { parseBookFilename, fetchBookMetadata };
