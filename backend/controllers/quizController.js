const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const Grade = require("../models/Grade");
const Question = require("../models/Question");

// Fetch all quizzes
exports.getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find(); // Fetch all quizzes
        res.status(200).json(quizzes);
    } catch (error) {
        next(error);
    }
};

// Get a quiz by ID with dynamically fetched questions
exports.getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Fetch all questions linked to this quiz
        const questions = await Question.find({ quiz: quiz._id });

        res.status(200).json({
            ...quiz._doc, // Quiz details
            questions, // Dynamically fetched questions
        });
    } catch (error) {
        console.error("Error fetching quiz:", error);
        next(error);
    }
};

// Fetch only questions for a specific quiz
exports.getQuizQuestions = async (req, res, next) => {
    try {
        const questions = await Question.find({ quiz: req.params.quizId });

        if (!questions || questions.length === 0) {
            return res
                .status(404)
                .json({ message: "No questions found for this quiz." });
        }

        res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetching quiz questions:", error);
        next(error);
    }
};

exports.submitQuizGrade = async (req, res, next) => {
    try {
        const { score, totalQuestions, answers } = req.body;
        const quizId = req.params.quizId;

        // Validate required input
        if (
            score === undefined ||
            totalQuestions === undefined ||
            !Array.isArray(answers)
        ) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        // Validate the quiz exists
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Fetch questions for the quiz
        const questions = await Question.find({ quiz: quizId });
        if (!questions || questions.length === 0) {
            return res
                .status(404)
                .json({ message: "No questions found for this quiz." });
        }

        // Validate answers
        const questionIds = questions.map((q) => q._id.toString());
        const invalidAnswers = answers.filter(
            (ans) => !questionIds.includes(ans.questionId)
        );

        if (invalidAnswers.length > 0) {
            return res.status(400).json({
                message: "Some answers do not belong to this quiz.",
                invalidAnswers,
            });
        }

        // Create and save the grade
        const grade = new Grade({
            user: req.user.id, // From authMiddleware
            quiz: quizId,
            score,
            totalQuestions,
            answers,
        });
        await grade.save();

        res.status(201).json({
            message: "Grade submitted successfully",
            grade,
        });
    } catch (error) {
        console.error("Error submitting quiz grade:", error.message);
        next(error);
    }
};

// Create a new quiz with questions
exports.createQuiz = async (req, res, next) => {
    try {
        const { title, description, level, type, questions } = req.body;

        // Create the quiz
        const quiz = new Quiz({
            title,
            description,
            level,
            type,
            createdBy: req.user.id,
        });
        await quiz.save();

        // Add the `quiz` field to each question
        const savedQuestions = await Promise.all(
            questions.map((q) => {
                const question = new Question({
                    ...q,
                    quiz: quiz._id, // Link the question to the quiz
                });
                return question.save();
            })
        );

        res.status(201).json({ message: "Quiz created successfully", quiz });
    } catch (error) {
        console.error("Quiz creation failed:", error.message);
        res.status(400).json({ message: "Invalid input data" });
    }
};

// Update an existing quiz
exports.updateQuiz = async (req, res, next) => {
    try {
        const quizId = req.params.quizId;
        const updates = req.body;

        const quiz = await Quiz.findByIdAndUpdate(quizId, updates, {
            new: true,
            runValidators: true,
        });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json(quiz);
    } catch (error) {
        console.error("Error updating quiz:", error.message);
        next(error);
    }
};
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Grade = require("../models/Grade");

// Delete a specific quiz and its related questions and grades
exports.deleteQuiz = async (req, res, next) => {
    try {
        const quizId = req.params.quizId;

        // Find and delete the quiz
        const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

        if (!deletedQuiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Delete associated questions
        await Question.deleteMany({ quiz: quizId });

        // Delete associated grades
        await Grade.deleteMany({ quiz: quizId });

        res.status(200).json({
            message: "Quiz and its related data deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting quiz:", error.message);
        next(error);
    }
};
