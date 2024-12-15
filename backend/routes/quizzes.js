const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
    getQuizzes,
    getQuizById,
    getQuizQuestions,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuizGrade,
} = require("../controllers/quizController");

// Get all quizzes
router.get("/", authMiddleware, getQuizzes);

// Get a quiz by ID
router.get("/:quizId", authMiddleware, getQuizById);

// Create a new quiz
router.post("/", authMiddleware, createQuiz);

// Update an existing quiz
router.put("/:quizId", authMiddleware, updateQuiz);

// Delete a quiz
router.delete("/:quizId", authMiddleware, deleteQuiz);

// Get questions for a specific quiz
router.get("/:quizId/questions", authMiddleware, getQuizQuestions);

// Submit grade for a quiz
router.post("/:quizId/grade", authMiddleware, submitQuizGrade);

module.exports = router;
