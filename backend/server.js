require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quizzes");
const gradeRoutes = require("./routes/grades"); // Ensure grade route includes history
const questionRouters = require("./routes/questions");

dotenv.config(); // You only need to call this once, the one at the top is fine.
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json()); // bodyParser is deprecated, express.json() is preferred

// Add this:
app.get("/", (req, res) => {
    res.send("Welcome to the API! It's running.");
});

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/questions", questionRouters);

app.use((error, req, res, next) => {
    console.error(error.message); // It's good practice to log the full error: console.error(error);
    res.status(500).json({ message: "An internal error occurred" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
