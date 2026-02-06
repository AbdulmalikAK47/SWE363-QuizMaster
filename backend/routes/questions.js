const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");
const validateObjectId = require("../middlewares/validateObjectId");
const {
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} = require("../controllers/questionController");

const router = express.Router();

// Get all questions for a quiz
router.get("/:quizId", authMiddleware, validateObjectId("quizId"), getQuestions);

// Create a new question for a quiz
router.post("/", authMiddleware, authorizeRoles("quizMaker"), createQuestion);

// Update a specific question
router.put(
    "/:questionId",
    authMiddleware,
    authorizeRoles("quizMaker"),
    validateObjectId("questionId"),
    updateQuestion
);

// Delete a specific question
router.delete(
    "/:questionId",
    authMiddleware,
    authorizeRoles("quizMaker"),
    validateObjectId("questionId"),
    deleteQuestion
);

module.exports = router;
