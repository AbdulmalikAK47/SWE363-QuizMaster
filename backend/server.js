// In backend/server.js

require("dotenv").config(); // Call this once at the very top
const express = require("express");
// const bodyParser = require("body-parser"); // Deprecated, use express.json()
const cors = require("cors");
// const dotenv = require("dotenv"); // Already called at the top
const connectDB = require("./config/db"); // Assuming db.js is in backend/config
const authRoutes = require("./routes/auth"); // Assuming routes are in backend/routes
const quizRoutes = require("./routes/quizzes");
const gradeRoutes = require("./routes/grades");
const questionRouters = require("./routes/questions");
const path = require("path"); // <<<<<<<<<<<<<<<<<<<<<<<< ADD THIS LINE

// connectDB(); // Call after dotenv if it relies on env vars from .env
// If connectDB doesn't rely on .env variables loaded by dotenv, its position is less critical
// but generally good practice to have config loaded before DB connection.
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // <<<<<<<<<<<<<<<<<<<<<<<< USE THIS INSTEAD OF bodyParser
app.use(express.urlencoded({ extended: true })); // Good to have for form data

// API Routes - These should come BEFORE the frontend serving
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/questions", questionRouters);

// --- SERVE FRONTEND STATIC FILES ---
// __dirname in this file (backend/server.js) is the absolute path to the 'backend' directory.
// We need to go up one level ('..') then into 'frontend' and then into 'build'.
const frontendBuildPath = path.join(__dirname, "..", "frontend", "build");
console.log(`[Server] Serving static files from: ${frontendBuildPath}`); // For debugging

// Serve static assets (JS, CSS, images, etc.) from the 'build' folder
app.use(express.static(frontendBuildPath));

// For any other GET request not handled by API routes or static files,
// serve the 'index.html' file from the 'build' folder.
// This is crucial for Single Page Applications (SPAs) like React.
app.get("*", (req, res) => {
    const indexPath = path.join(frontendBuildPath, "index.html");
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("[Server] Error sending index.html:", err);
            console.error("[Server] indexPath that failed:", indexPath);
            res.status(500).send(
                "Error serving frontend. Check server logs for `indexPath`."
            );
        }
    });
});
// --- END SERVE FRONTEND ---

// Your existing root route for API check (optional, as '*' will now serve frontend)
// If you keep this, it will be overridden by app.use(express.static) if index.html exists
// or by app.get('*') if you access '/' directly.
// It's generally better to let the frontend handle the root path.
// You can remove this if you want '/' to always show your React app.
/*
app.get("/", (req, res) => {
    res.send("Welcome to the API! It's running.");
});
*/

// Error handling middleware - should be the last app.use()
app.use((error, req, res, next) => {
    console.error("[Server] Global error handler:", error); // Log the full error object
    res.status(500).json({ message: "An internal server error occurred" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
});
