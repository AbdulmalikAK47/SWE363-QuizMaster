const mongoose = require("mongoose");

const GradeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    answers: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
                required: true,
            },
            answerId: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

GradeSchema.index({ user: 1, quiz: 1 });

module.exports = mongoose.model("Grade", GradeSchema);
