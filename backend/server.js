// In backend/server.js

require("dotenv").config(); // Call this once at the very top
const express = require("express");
const cors = require("cors");
// const dotenv = require("dotenv"); // Already called at the top
const connectDB = require("./config/db"); // Assuming db.js is in backend/config
const authRoutes = require("./routes/auth"); // Assuming routes are in backend/routes
const quizRoutes = require("./routes/quizzes");
const gradeRoutes = require("./routes/grades");
const questionRouters = require("./routes/questions");
const path = require("path"); // <<<<<<<<<<<<<<<<<<<<<<<< MAKE SURE THIS IS HERE

connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // <<<<<<<<<<<<<<<<<<<<<<<< USE THIS
app.use(express.urlencoded({ extended: true })); // Good to have for form data

// API Routes - These should come BEFORE the frontend serving
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/questions", questionRouters);

// --- SERVE FRONTEND STATIC FILES ---
// __dirname in this file (backend/server.js) is the absolute path to the 'backend' directory.
// We need to go up one level ('..') then into 'frontend' and then into 'dist' (because you are using Vite).
const frontendBuildPath = path.join(__dirname, "..", "frontend", "dist"); // <<<<<<<<<<<<<<<<<<<<<<<< POINTS TO 'dist'
console.log(
    `[Server] Attempting to serve static files from: ${frontendBuildPath}`
);

// Serve static assets (JS, CSS, images, etc.) from the 'dist' folder
app.use(express.static(frontendBuildPath));

// For any other GET request not handled by API routes or static files,
// serve the 'index.html' file from the 'dist' folder.
// This is crucial for Single Page Applications (SPAs) like React.
app.get("*", (req, res) => {
    const indexPath = path.join(frontendBuildPath, "index.html");
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("[Server] Error sending index.html:", err);
            console.error("[Server] indexPath that failed:", indexPath); // Log the path it tried
            res.status(500).send(
                "Error serving frontend. Check server logs for `indexPath`."
            );
        }
    });
});
// --- END SERVE FRONTEND ---

// Error handling middleware - should be the last app.use()
app.use((error, req, res, next) => {
    console.error("[Server] Global error handler:", error.message); // Log the error message
    // For more detail, you might want to log the full error object: console.error(error);
    res.status(500).json({ message: "An internal server error occurred" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
});
