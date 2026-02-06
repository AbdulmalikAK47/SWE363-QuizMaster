require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quizzes");
const gradeRoutes = require("./routes/grades");
const questionRoutes = require("./routes/questions");
const path = require("path");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/questions", questionRoutes);

// Global error handler (must be after API routes, before static serving)
app.use((error, req, res, next) => {
    console.error(error.message);
    res.status(500).json({ message: "An internal server error occurred" });
});

// Serve frontend static files
const frontendBuildPath = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendBuildPath));

// SPA fallback - serve index.html for all non-API routes
app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"), (err) => {
        if (err) {
            res.status(500).send("Error serving frontend.");
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
