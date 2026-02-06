const Grade = require("../models/Grade");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// Fetch quiz history for a user
exports.getQuizHistory = async (req, res, next) => {
    try {
        const history = await Grade.find({ user: req.user.id })
            .populate({
                path: "quiz",
                select: "title description level type",
            })
            .exec();

        res.status(200).json(history);
    } catch (error) {
        next(error);
    }
};

// Fetch global stats for a specific quiz
exports.getQuizzesStatus = async (req, res, next) => {
    try {
        const quizId = req.params.quizId;

        const grades = await Grade.find({ quiz: quizId });

        if (!grades.length) {
            return res.status(404).json({
                message: "No grades found for this quiz.",
            });
        }

        const scores = grades.map(
            (grade) => (grade.score / grade.totalQuestions) * 100 || 0
        );

        const average =
            scores.reduce((sum, score) => sum + score, 0) / scores.length;

        const sortedScores = scores.sort((a, b) => a - b);
        const mid = Math.floor(sortedScores.length / 2);
        const median =
            sortedScores.length % 2 !== 0
                ? sortedScores[mid]
                : (sortedScores[mid - 1] + sortedScores[mid]) / 2;

        res.status(200).json({
            average: parseFloat(average.toFixed(2)),
            median: parseFloat(median.toFixed(2)),
            takers: grades.length,
        });
    } catch (error) {
        next(error);
    }
};

exports.getQuizStats = async (req, res, next) => {
    try {
        const stats = await Quiz.aggregate([
            {
                $lookup: {
                    from: "grades",
                    localField: "_id",
                    foreignField: "quiz",
                    as: "grades",
                },
            },
            {
                $addFields: {
                    scoresArray: {
                        $map: {
                            input: "$grades",
                            as: "grade",
                            in: {
                                $cond: [
                                    { $gt: ["$$grade.totalQuestions", 0] },
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
                                    0,
                                ],
                            },
                        },
                    },
                    takers: { $size: "$grades" },
                },
            },
            {
                $addFields: {
                    average: {
                        $cond: [
                            { $gt: [{ $size: "$scoresArray" }, 0] },
                            { $avg: "$scoresArray" },
                            0,
                        ],
                    },
                    median: {
                        $cond: [
                            { $gt: [{ $size: "$scoresArray" }, 0] },
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
                            0,
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
        next(error);
    }
};

// Dashboard stats for the logged-in user
exports.getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const grades = await Grade.find({ user: userId }).populate({
            path: "quiz",
            select: "title level type",
        });

        const totalQuizzesTaken = grades.length;

        if (totalQuizzesTaken === 0) {
            return res.status(200).json({
                totalQuizzesTaken: 0,
                averageScore: 0,
                bestScore: 0,
                recentQuizzes: [],
            });
        }

        const scores = grades.map(
            (g) => (g.score / g.totalQuestions) * 100
        );
        const averageScore =
            scores.reduce((sum, s) => sum + s, 0) / scores.length;
        const bestScore = Math.max(...scores);

        const recentQuizzes = grades
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5)
            .map((g) => ({
                quiz: g.quiz,
                score: g.score,
                totalQuestions: g.totalQuestions,
                percentage: parseFloat(
                    ((g.score / g.totalQuestions) * 100).toFixed(2)
                ),
                date: g.createdAt,
            }));

        res.status(200).json({
            totalQuizzesTaken,
            averageScore: parseFloat(averageScore.toFixed(2)),
            bestScore: parseFloat(bestScore.toFixed(2)),
            recentQuizzes,
        });
    } catch (error) {
        next(error);
    }
};
