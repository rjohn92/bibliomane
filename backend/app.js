import express from "express";
import path from "path";
import jwt from "jsonwebtoken";

import { fileURLToPath } from "url";
import { router } from "../routes/index.js"; // ✅ Only importing `router`

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 📌 Middleware to parse JSON request bodies
app.use(express.json());

// ✅ Serve book covers dynamically from book folders
app.use("/books", express.static("/app/hdd/books"));

// 📌 Serve static frontend files
app.use(express.static(path.resolve(__dirname, "../frontend/public")));

// ✅ Serve static images (for default cover image)
app.use("/images", express.static(path.resolve(__dirname, "../frontend/public/images")));

// 📌 Use API routes
app.use("/api", router);

app.get('/whoami', (req, res) => {
  console.log("Request Headers:", req.headers);  // Log all headers to see what's coming through

  res.json({
    // kobo_email: req.headers['x-kobo-email'],
    user_id: req.headers['x-user'],
    email: req.headers['x-email'],
    preferred_username: req.headers['x-username'],
    kobo_email: req.headers['x-kobo-email'],
    kindle_email: req.headers['x-kindle-email'],

  });
});



// 📌 Fallback for SPA (Single Page App)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/public/index.html"));
});



// 📌 Catch-all error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
