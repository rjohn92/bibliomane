import express from "express";
import path from "path";
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
