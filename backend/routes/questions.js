const express = require("express");
const {
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} = require("../controllers/questionController");

const router = express.Router();

// Get all questions for a quiz
router.get("/:quizId", getQuestions);

// Create a new question for a quiz
router.post("/", createQuestion);

// Update a specific question
router.put("/:questionId", updateQuestion);

// Delete a specific question
router.delete("/:questionId", deleteQuestion);

module.exports = router;
