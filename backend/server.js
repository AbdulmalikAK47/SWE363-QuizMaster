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

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/grades", gradeRoutes); // Add this to include the history route
app.use("/api/questions", questionRouters); // Add this to include the history route

app.use((error, req, res, next) => {
    console.error(error.message);
    res.status(500).json({ message: "An internal error occurred" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
