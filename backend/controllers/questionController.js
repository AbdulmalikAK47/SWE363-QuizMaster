const Question = require("../models/Question");

// Get all questions for a specific quiz
exports.getQuestions = async (req, res, next) => {
    try {
        const { quizId } = req.params;

        const questions = await Question.find({ quiz: quizId });

        if (!questions || questions.length === 0) {
            return res
                .status(404)
                .json({ message: "No questions found for this quiz." });
        }

        res.status(200).json(questions);
    } catch (error) {
        next(error);
    }
};

// Create a new question for a quiz
exports.createQuestion = async (req, res, next) => {
    try {
        const { quiz, text, choices, correctAnswer } = req.body;

        if (!quiz || !text || !choices || !correctAnswer) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newQuestion = new Question({
            quiz,
            text,
            choices,
            correctAnswer,
        });

        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        next(error);
    }
};

// Update a specific question
exports.updateQuestion = async (req, res, next) => {
    try {
        const { questionId } = req.params;
        const updates = req.body;

        const question = await Question.findByIdAndUpdate(questionId, updates, {
            new: true,
            runValidators: true,
        });

        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }

        res.status(200).json(question);
    } catch (error) {
        next(error);
    }
};

// Delete a specific question
exports.deleteQuestion = async (req, res, next) => {
    try {
        const { questionId } = req.params;

        const question = await Question.findByIdAndDelete(questionId);

        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }

        res.status(200).json({ message: "Question deleted successfully." });
    } catch (error) {
        next(error);
    }
};
