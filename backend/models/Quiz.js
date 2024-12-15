const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    level: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    type: {
        type: String,
        enum: ["Multiple_Choice", "True/False"],
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

QuizSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Quiz", QuizSchema);
