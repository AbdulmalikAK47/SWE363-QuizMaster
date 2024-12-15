const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    text: { type: String, required: true },
    choices: [
        {
            id: { type: String, required: true },
            text: { type: String, required: true },
        },
    ],
    correctAnswer: { type: String, required: true },
});

module.exports = mongoose.model("Question", QuestionSchema);
