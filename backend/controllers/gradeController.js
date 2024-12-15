const Grade = require("../models/Grade");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// Submit a grade for a quiz
exports.submitGrade = async (req, res, next) => {
    try {
        const { score, totalQuestions, answers } = req.body;

        if (!score || !totalQuestions || !Array.isArray(answers)) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const quizId = req.params.quizId;

        // Check if the quiz exists
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Fetch all questions for the quiz
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

        // Save the grade
        const grade = new Grade({
            user: req.user.id, // User ID from auth middleware
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
        next(error);
    }
};

// Fetch quiz history for a user
exports.getQuizHistory = async (req, res, next) => {
    try {
        const history = await Grade.find({ user: req.user.id })
            .populate({
                path: "quiz",
                select: "title description level type", // Fetch specific quiz fields
            })
            .exec();

        res.status(200).json(history);
    } catch (error) {
        console.error("Error fetching quiz history:", error.message);
        next(error);
    }
};

// Fetch global stats for a specific quiz
exports.getQuizzesStatus = async (req, res, next) => {
    try {
        const quizId = req.params.quizId;

        // Fetch all grades for the specified quiz
        const grades = await Grade.find({ quiz: quizId });

        if (!grades.length) {
            return res.status(404).json({
                message: "No grades found for this quiz.",
            });
        }

        // Calculate scores as percentages
        const scores = grades.map(
            (grade) => (grade.score / grade.totalQuestions) * 100 || 0
        );

        // Calculate average
        const average =
            scores.reduce((sum, score) => sum + score, 0) / scores.length;

        // Calculate median
        const sortedScores = scores.sort((a, b) => a - b);
        const mid = Math.floor(sortedScores.length / 2);
        const median =
            sortedScores.length % 2 !== 0
                ? sortedScores[mid]
                : (sortedScores[mid - 1] + sortedScores[mid]) / 2;

        // Return stats
        res.status(200).json({
            average: parseFloat(average.toFixed(2)), // Already a percentage
            median: parseFloat(median.toFixed(2)), // Already a percentage
            takers: grades.length, // Number of quiz takers
        });
    } catch (error) {
        console.error("Error fetching quiz stats:", error.message);
        next(error);
    }
};

exports.getQuizStats = async (req, res, next) => {
    try {
        const stats = await Quiz.aggregate([
            {
                $lookup: {
                    from: "grades", // Join with grades collection
                    localField: "_id", // Match quiz ID
                    foreignField: "quiz", // Match grades by quiz field
                    as: "grades",
                },
            },
            {
                $addFields: {
                    // Calculate scores as percentages: (score / totalQuestions) * 100
                    scoresArray: {
                        $map: {
                            input: "$grades",
                            as: "grade",
                            in: {
                                $cond: [
                                    { $gt: ["$$grade.totalQuestions", 0] }, // Ensure totalQuestions > 0
                                    {
                                        $multiply: [
                                            {
                                                $divide: [
                                                    "$$grade.score",
                                                    "$$grade.totalQuestions",
                                                ],
                                            },
                                            100,
                                        ],
                                    },
                                    0, // Default to 0 if totalQuestions is 0
                                ],
                            },
                        },
                    },
                    takers: { $size: "$grades" }, // Number of takers
                },
            },
            {
                $addFields: {
                    // Calculate average score as percentage
                    average: {
                        $cond: [
                            { $gt: [{ $size: "$scoresArray" }, 0] },
                            { $avg: "$scoresArray" },
                            0, // Default to 0 if no scores exist
                        ],
                    },
                    // Calculate median score as percentage
                    median: {
                        $cond: [
                            { $gt: [{ $size: "$scoresArray" }, 0] }, // If scores exist
                            {
                                $arrayElemAt: [
                                    {
                                        $slice: [
                                            {
                                                $sortArray: {
                                                    input: "$scoresArray",
                                                    sortBy: 1,
                                                },
                                            },
                                            {
                                                $floor: {
                                                    $divide: [
                                                        {
                                                            $size: "$scoresArray",
                                                        },
                                                        2,
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                    0,
                                ],
                            },
                            0, // Default median to 0 if no scores exist
                        ],
                    },
                },
            },
            {
                $project: {
                    quizId: "$_id",
                    title: 1,
                    average: { $ifNull: ["$average", 0] },
                    median: { $ifNull: ["$median", 0] },
                    takers: 1,
                },
            },
        ]);

        res.status(200).json(stats);
    } catch (error) {
        console.error("Error fetching quiz statistics:", error.message);
        next(error);
    }
};
