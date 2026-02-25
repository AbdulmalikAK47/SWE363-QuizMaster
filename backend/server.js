require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quizzes");
const gradeRoutes = require("./routes/grades");
const questionRoutes = require("./routes/questions");

connectDB();

const app = express();

// ✅ Proper CORS for Vercel frontend
app.use(
    cors({
        origin: "https://swe-363-quiz-master-kappa.vercel.app/",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/questions", questionRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("API Running");
});

// Global error handler
app.use((error, req, res, next) => {
    console.error(error.message);
    res.status(500).json({ message: "An internal server error occurred" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
