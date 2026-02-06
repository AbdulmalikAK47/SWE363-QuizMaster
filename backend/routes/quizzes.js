const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");
const validateObjectId = require("../middlewares/validateObjectId");
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
router.get("/:quizId", authMiddleware, validateObjectId("quizId"), getQuizById);

// Create a new quiz
router.post("/", authMiddleware, authorizeRoles("quizMaker"), createQuiz);

// Update an existing quiz
router.put(
    "/:quizId",
    authMiddleware,
    authorizeRoles("quizMaker"),
    validateObjectId("quizId"),
    updateQuiz
);

// Delete a quiz
router.delete(
    "/:quizId",
    authMiddleware,
    authorizeRoles("quizMaker"),
    validateObjectId("quizId"),
    deleteQuiz
);

// Get questions for a specific quiz
router.get(
    "/:quizId/questions",
    authMiddleware,
    validateObjectId("quizId"),
    getQuizQuestions
);

// Submit grade for a quiz
router.post(
    "/:quizId/grade",
    authMiddleware,
    validateObjectId("quizId"),
    submitQuizGrade
);

module.exports = router;
