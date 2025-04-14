import { readdir } from 'fs/promises';
// import { extname } from 'path';
import axios from "axios";
import dotenv from "dotenv";
import path from 'path';
import fs from "fs";

import { fileURLToPath } from "url";

import fetch from "node-fetch";

/**
 * Processes the book's cover image before passing it to addBook.
 * - If it's a Buffer, pass it as-is.
 * - If it's a URL, fetch the image and convert it to a Buffer.
 * - If missing, store NULL.
 */


export async function saveCoverURL(coverURL, bookTitle, coverPath) {

    if (!coverURL) {
      console.log("🚨 No URL provided") 
      return null; // No URL provided, return NULL
    }

    if (!bookTitle) {
      console.log("🚨 No Title provided") 
      return null; // No Title provided, return NULL
    }



    if (typeof coverURL === "string" && coverURL.startsWith("http")) {
        try {
            const response = await fetch(coverURL);
            if (response.ok) {
                console.log(`✅ URL Found: ${coverURL}`)
                const imageBuffer = Buffer.from(await response.arrayBuffer());


                const safeTitle = bookTitle.replace(/[<>:"/\\|?*]+/g,"").trim();
                const filePath = path.join(coverPath, `${safeTitle}.jpg`);

            // Avoid re-downloading if cover already exists
            if (fs.existsSync(filePath)) {
              console.log(`🔄 Cover already exists: ${filePath}`);
              return filePath;


            } else {
                // Save the image to disk
                fs.writeFileSync(filePath, imageBuffer);
                console.log(`✅ Cover image saved: ${filePath}`);

                return filePath;
              }

            } else {
                console.warn(`🚨 Failed to fetch cover image from ${coverURL}`);
                
            }
        } catch (error) {
            console.warn(`🚨 Cover fetch error: ${error.message}`);
        }
        
    }

    return null; // If fetch fails, return NULL
}

export async function updateCover(title, author, publishedYear, db, coversDir, coverFilePath) {
  // After parsing title, author, year from folder
    const newCover = path.join(coversDir, coverFilePath)
      db.run(`
        UPDATE books SET coverPath = ? WHERE title = ? AND author = ? AND year = ?
      `, [newCover, title, author, publishedYear]);
      console.log(`🖼️ Cover path updated for "${title}"`);
    } 



/**
 * Checks if the book already has enough metadata to skip fetching.
 * @param {string} title 
 * @param {string} author 
 * @param {string} year 
 * @param {object} database - Database instance
 * @returns {boolean} - True if metadata exists, false if fetch is needed
 */
export async function hasEnoughMetadata(title, author, year, db) {
  try {
    const book = await db.get(
      "SELECT description, coverPath, isbn FROM books WHERE title = ? AND author = ? AND year = ?",
      [title, author, year]
    );

    if (!book) {
      return false;
    }

    const hasDescription = book.description && book.description.trim().length > 0;
    const hasCover = book.coverPath && book.coverPath.trim().length > 0;
    const hasISBN = book.isbn && book.isbn.trim().length > 0;    

    return hasDescription && hasCover && hasISBN;
  } catch (error) {
    console.log(`❌ Error checking metadata: ${error.message}`);
    return false;
  }
}


export function coverExists(coverFolderPath) {
    // ✅ Look for a cover file in the "covers/" folder
    const coverFiles = fs.readdirSync(coverFolderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    if (coverFiles.length==0) {
      return false;
    }
    return coverFiles[0];
}

export function extractMetadataFromFolder(folderName){

  const match = folderName.match(/^(.+)\s*\[(.+)\]\s*\((\d{4})\)$/);

  if (!match){
    console.warn(`❗ Skipping folder (bad format): ${folderName} ❗`);
    return null;
  }
  return {
    title: match[1].trim(),
    author: match[2].trim(),
    publishedYear: match[3].trim()
  }
}

export async function bookFileExists(bookFolderPath) {
    // ✅ Find the book file
    const contents = await readdir(bookFolderPath);
    const bookFile = contents.find(file => file.match(/\.(epub|pdf)$/i));
    //If there's no valid ebook found then skip processing 
    if (!bookFile) {
      return null;
    }

    return path.join(bookFolderPath, bookFile);
}

/**
 * Ensures the "covers/" folder exists inside a book's directory
 */
export function ensureCoversFolder(bookFolderPath) {
  const coversDir = path.join(bookFolderPath, "covers");
  if (!fs.existsSync(coversDir)) {
      fs.mkdirSync(coversDir, { recursive: true });
  }
  return coversDir;
}

/** *
@param {string} folderName We're going to make sure the name is valid "Title-Author(Year)" format"
**/
export function validFolderFormat(folderName) {
  const match = folderName.match(/^(.+)\s*\[(.+)\]\s*\((\d{4})\)$/);

  if (!match){
    // console.warn(`❗ Skipping folder (bad format): ${folderName} ❗`);
    return false;
  }
  return {
    title: match[1].trim(),
    author: match[2].trim(),
    publishedYear: match[3].trim()
  }
}

/**
@param {string} title
@param {string} author
@param {string} year
@param {string} database 
@returns {boolean} - Returns true if the book exists, false otherwise.
**/
export async function checkDuplicateTitles(title, author, year, database) {
  try {
    const existingBook = await database.get(
    "SELECT id FROM books WHERE title = ? AND author = ? AND year = ?", 
    [title, author, year]
    )
    if (existingBook) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(`❌ Error checking for duplicate book: ${error.message}`);
  }
}