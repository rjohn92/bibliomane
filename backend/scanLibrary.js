import fs from "fs";
import path from "path";
import { processBook } from "./processBook.js"; // New helper function
import { readdir, stat } from "fs/promises";
import { extractMetadataFromFolder, saveCoverURL, bookFileExists, ensureCoversFolder, validFolderFormat, checkDuplicateTitles, coverExists, updateCover, hasEnoughMetadata } from "./helpers.js";
import { dbPromise } from "../database/db.js";
import { addBook } from "./addBook.js";
import { fetchBookMetadata } from "./googleBooksService.js";

const db = await dbPromise; // Ensure database is ready

const LIBRARY_PATH = "/app/hdd/books"; // Books directory

console.log("📚 Scanning book library...");

async function scanLibrary(library_source, db) {
    try {
        const bookFolders = await readdir(library_source);

        for (const folder of bookFolders) {
            const currPath = path.join(library_source, folder);
            const stats = await stat(currPath);

            // Check if each item being looped over is a folder
            if (!stats.isDirectory()) {
                console.log(`❗ Skipping: ${folder} (Not a directory) ❗`);
                continue;
            }

            console.log(`📂 Processing: ${folder}`);

            // make sure name is valid first
            const isValidName = validFolderFormat(folder);
            if (!isValidName) {
                console.log(`🚨 Folder ${folder} is in invalid format. Skipping...`);
                continue;
            } else {
                console.log(`✅ Folder ${folder} is valid format.`);
            }



            // ✅ Extract title, author, and year from the object validatedName
            const { title, author, publishedYear } = isValidName;
            console.log(isValidName)

            // ✅ Find the book file
            const bookFile = await bookFileExists(currPath);
            if (!bookFile) {
                console.log(`🚨 Book file doesn't exist! Skipping ...`);
                continue;
            }
            console.log(`✅ ${title} eBook found at: ${bookFile}`)

            /**  ✅ Since the folder format is valid , and we have an eBook let's see if we have 
               the covers folder and if not we'll create one
            **/   
            const coversDir = await ensureCoversFolder(currPath);
            console.log(`✅ Covers path for ${title} at: ${coversDir}`);

            let coverFilePath = null;
            let actualCoversFilePath;
            // ✅ Check if title exists in database before we do further processing
            const existsInDB =  await checkDuplicateTitles(title, author, publishedYear, db);
            if (existsInDB) {
                console.log(`✅ Book already exists: ${title} (${publishedYear}) by ${author}. Checking if cover exists...`);
                // Check if coversFile exists
                coverFilePath = await coverExists(coversDir);
                if (coverFilePath) {
                    actualCoversFilePath = path.join(coversDir, coverFilePath);
                    console.log(`✅ Cover exists at: ${actualCoversFilePath}. Updating cover path to: ${actualCoversFilePath}...`);
                    await updateCover(title, author, publishedYear, db, coversDir, coverFilePath)
                } else {
                    console.log(`🚨 Cover File doesn't exist for: ${title} (${publishedYear}) by ${author}`);
                }
            } else {
                console.log(`🚨 ${title} (${publishedYear}) by ${author} not found in Database. Trying to add...`);
            }
            
            console.log(`🚨 About to check metadata for ${title}...`);
            // check if we have enough metadata and still need to run fetch function
            const enoughMetadata = await hasEnoughMetadata(title, author, publishedYear, db)

            console.log(`🔍 Checking if enough metadata: ${enoughMetadata}`)
            if (!enoughMetadata) {

            // Get the rest of the metadata of the book
            const fetchedMetadata = await fetchBookMetadata(title, author, publishedYear);


            const downloadedCover = await saveCoverURL(fetchedMetadata?.coverURL,  title, coversDir);
            if (!downloadedCover) {
                console.log(`🚨 Issue downloading cover for: ${title}` )
            }

            // Combine the missing metadata with what we got before
            const completeMetadata = {
                title: title,  // Title from folder
                author: author, // Author from folder
                publishedYear: publishedYear, // Year from folder
                description: fetchedMetadata?.description || "No description available",
                categories: fetchedMetadata?.categories?.join(", ") || "Unknown",
                isbn: fetchedMetadata?.isbn || "N/A",
                coverPath: actualCoversFilePath || downloadedCover,
                filePath: bookFile
            };

            console.log(completeMetadata);

        await addBook(db, {
        title: completeMetadata.title,
        author: completeMetadata.author,
        year: completeMetadata.publishedYear,
        description: completeMetadata.description,
        categories: completeMetadata.categories,
        isbn: completeMetadata.isbn,
        filePath: completeMetadata.filePath,
        coverPath: completeMetadata.coverPath,
        });
            console.log(`✅ Book added with coverPath: ${completeMetadata.coverPath || "No cover found"}`);
            } 
        }
    } catch (error) {
        console.error("❌ Error scanning library:", error.message);
    }
}

await scanLibrary(LIBRARY_PATH, db);
console.log("✅ Library scan complete.");
