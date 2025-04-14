import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

// Open or create the SQLite database
const dbPromise = open({
    filename: "./database/bibliomane.db", // The SQLite database file
    driver: sqlite3.Database,
});

async function initializeDB() {
    const db = await dbPromise;

    // Create the books table if it doesn’t exist
    await db.exec(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            year TEXT NOT NULL,
            description TEXT,
            categories TEXT,
            isbn TEXT,
            coverPath TEXT, 
            filePath TEXT NOT NULL UNIQUE  -- Store the actual file path of the book
        );
    `);

    console.log("✅ SQLite database initialized");
}

initializeDB(); // Run the function when the script is executed


export {dbPromise, initializeDB};
