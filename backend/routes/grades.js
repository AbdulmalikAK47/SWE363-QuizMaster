const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const validateObjectId = require("../middlewares/validateObjectId");
const {
    getQuizHistory,
    getQuizzesStatus,
    getQuizStats,
    getDashboardStats,
} = require("../controllers/gradeController");

// Fetch quiz history for the logged-in user
router.get("/history", authMiddleware, getQuizHistory);

// Dashboard stats for the logged-in user
router.get("/dashboard-stats", authMiddleware, getDashboardStats);

// Fetch quiz statistics (all quizzes)
router.get("/quiz-stats", authMiddleware, getQuizStats);

// Fetch global stats for a specific quiz
router.get(
    "/quiz-stats/:quizId",
    authMiddleware,
    validateObjectId("quizId"),
    getQuizzesStatus
);

module.exports = router;
