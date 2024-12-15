import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styles from "../styles/CreateQuiz.module.css";

const CreateQuiz = () => {
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState({
        title: "",
        description: "",
        level: "Easy",
        type: "Multiple_Choice",
    });
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({
        text: "",
        choices: [
            { id: "a", text: "" },
            { id: "b", text: "" },
        ],
        correctAnswer: "a",
    });
    const [error, setError] = useState(null);
    const [warning, setWarning] = useState(null);

    // Handle quiz metadata changes
    const handleQuizChange = (e) => {
        const { name, value } = e.target;
        setQuizData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    // Handle question input changes
    const handleQuestionChange = (e) => {
        const { name, value } = e.target;
        setCurrentQuestion((prev) => ({ ...prev, [name]: value }));
        setWarning(null);
    };

    // Handle choice text changes
    const handleChoiceChange = (index, value) => {
        const updatedChoices = [...currentQuestion.choices];
        updatedChoices[index].text = value;
        setCurrentQuestion((prev) => ({
            ...prev,
            choices: updatedChoices,
        }));
        setWarning(null);
    };

    const addChoice = () => {
        if (currentQuestion.choices.length < 6) {
            const newChoiceId = String.fromCharCode(
                97 + currentQuestion.choices.length
            );
            setCurrentQuestion((prev) => ({
                ...prev,
                choices: [...prev.choices, { id: newChoiceId, text: "" }],
            }));
        }
    };

    const removeChoice = () => {
        if (currentQuestion.choices.length > 2) {
            const updatedChoices = currentQuestion.choices.slice(0, -1);
            setCurrentQuestion((prev) => ({
                ...prev,
                choices: updatedChoices,
                correctAnswer: updatedChoices[0].id, // Default correctAnswer to first option
            }));
        }
    };

    const validateCurrentQuestion = () => {
        const filledChoices = currentQuestion.choices.filter(
            (choice) => choice.text.trim() !== ""
        );

        if (currentQuestion.text.trim() !== "" && filledChoices.length < 2) {
            setWarning("At least 2 choices are required for a question.");
            return false;
        }

        return true;
    };

    const addQuestion = () => {
        if (!validateCurrentQuestion()) return;

        const newQuestion = {
            text: currentQuestion.text,
            correctAnswer: currentQuestion.correctAnswer,
            choices: currentQuestion.choices.filter(
                (choice) => choice.text.trim() !== ""
            ),
        };

        setQuestions((prev) => [...prev, newQuestion]);
        setCurrentQuestion({
            text: "",
            choices: [
                { id: "a", text: "" },
                { id: "b", text: "" },
            ],
            correctAnswer: "a",
        });
        setWarning(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!quizData.title.trim()) {
            setError("Quiz title is required.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const payload = { ...quizData, questions };

            const response = await axios.post(
                "http://localhost:5000/api/quizzes",
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                navigate("/welcome-admin");
            }
        } catch (error) {
            setError("Failed to create quiz. Please try again later.");
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.title}>Create a New Quiz</h1>
                {error && <p className={styles.error}>{error}</p>}
                {warning && <p className={styles.warning}>{warning}</p>}
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Quiz Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={quizData.title}
                            onChange={handleQuizChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Quiz Description:</label>
                        <textarea
                            name="description"
                            value={quizData.description}
                            onChange={handleQuizChange}
                        ></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Level:</label>
                        <select
                            name="level"
                            value={quizData.level}
                            onChange={handleQuizChange}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Type:</label>
                        <select
                            name="type"
                            value={quizData.type}
                            onChange={handleQuizChange}
                        >
                            <option value="Multiple_Choice">
                                Multiple Choice
                            </option>
                            <option value="True/False">True/False</option>
                        </select>
                    </div>

                    {/* Add Questions */}
                    <div className={styles.questionSection}>
                        <h3>Add Questions</h3>
                        <div className={styles.formGroup}>
                            <label>Question Text:</label>
                            <input
                                type="text"
                                name="text"
                                value={currentQuestion.text}
                                onChange={handleQuestionChange}
                            />
                        </div>
                        {currentQuestion.choices.map((choice, index) => (
                            <div key={index} className={styles.formGroup}>
                                <label>Choice {choice.id.toUpperCase()}:</label>
                                <input
                                    type="text"
                                    value={choice.text}
                                    onChange={(e) =>
                                        handleChoiceChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        ))}
                        <div className={styles.formGroup}>
                            <label>Correct Answer:</label>
                            <select
                                name="correctAnswer"
                                value={currentQuestion.correctAnswer}
                                onChange={handleQuestionChange}
                            >
                                {currentQuestion.choices.map((choice) => (
                                    <option key={choice.id} value={choice.id}>
                                        {choice.id.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.choiceButtons}>
                            <button
                                type="button"
                                onClick={addChoice}
                                disabled={currentQuestion.choices.length >= 6}
                            >
                                Add Choice
                            </button>
                            <button
                                type="button"
                                onClick={removeChoice}
                                disabled={currentQuestion.choices.length <= 2}
                            >
                                Remove Choice
                            </button>
                        </div>
                        <button
                            type="button"
                            className={styles.addQuestionButton}
                            onClick={addQuestion}
                        >
                            Add Question
                        </button>
                    </div>

                    {/* Display Questions */}
                    <div className={styles.questionList}>
                        <h3>Added Questions</h3>
                        {questions.map((q, index) => (
                            <div key={index} className={styles.questionItem}>
                                <p>
                                    {index + 1}. {q.text} <br />
                                    <strong>Correct Answer:</strong>{" "}
                                    {q.correctAnswer.toUpperCase()}
                                </p>
                            </div>
                        ))}
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Create Quiz
                    </button>
                </form>
            </div>
        </>
    );
};

export default CreateQuiz;
