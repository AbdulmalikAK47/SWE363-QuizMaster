const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
    submitGrade,
    getQuizHistory,
    getQuizzesStatus,
    getQuizStats,
} = require("../controllers/gradeController");

// Submit grade for a quiz
router.post("/:quizId/grade", authMiddleware, submitGrade);

// Fetch quiz history for the logged-in user
router.get("/history", authMiddleware, getQuizHistory);

// Fetch global stats for a specific quiz
router.get("/quiz-stats/:quizId", authMiddleware, getQuizzesStatus);

// Fetch quiz statistics
router.get("/quiz-stats", getQuizStats);

module.exports = router;
