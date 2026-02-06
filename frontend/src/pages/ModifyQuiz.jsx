import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";
import Header from "../components/Header";
import styles from "../styles/CreateQuiz.module.css";

const ModifyQuiz = () => {
    const navigate = useNavigate();
    const [quizList, setQuizList] = useState([]); // List of all quizzes
    const [selectedQuizId, setSelectedQuizId] = useState(""); // Selected quiz ID
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
    const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
    const [error, setError] = useState(null);

    // Fetch the list of quizzes
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${API_BASE_URL}/api/quizzes`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setQuizList(response.data);
            } catch (error) {
                setError("Failed to fetch quizzes.");
            }
        };

        fetchQuizzes();
    }, []);

    // Fetch the selected quiz and its questions
    const fetchQuiz = async (quizId) => {
        try {
            const token = localStorage.getItem("token");

            const quizResponse = await axios.get(
                `${API_BASE_URL}/api/quizzes/${quizId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setQuizData({
                title: quizResponse.data.title,
                description: quizResponse.data.description,
                level: quizResponse.data.level,
                type: quizResponse.data.type,
            });
            setQuestions(quizResponse.data.questions || []);
        } catch (error) {
            setError("Failed to fetch quiz data.");
        }
    };

    // Handle quiz selection from dropdown
    const handleQuizSelection = (e) => {
        const quizId = e.target.value;
        setSelectedQuizId(quizId);
        if (quizId) {
            fetchQuiz(quizId);
        } else {
            setQuizData({
                title: "",
                description: "",
                level: "Easy",
                type: "Multiple_Choice",
            });
            setQuestions([]);
        }
    };

    // Handle quiz metadata changes
    const handleQuizChange = (e) => {
        const { name, value } = e.target;
        setQuizData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle choice changes for current question
    const handleChoiceChange = (index, value) => {
        const updatedChoices = [...currentQuestion.choices];
        updatedChoices[index].text = value;
        setCurrentQuestion((prev) => ({ ...prev, choices: updatedChoices }));
    };

    // Handle correct answer selection
    const handleCorrectAnswerChange = (e) => {
        const { value } = e.target;
        setCurrentQuestion((prev) => ({ ...prev, correctAnswer: value }));
    };

    // Add a new question or save edited question
    const saveQuestion = () => {
        if (!currentQuestion.text.trim()) return;

        if (editingQuestionIndex !== null) {
            const updatedQuestions = [...questions];
            updatedQuestions[editingQuestionIndex] = currentQuestion;
            setQuestions(updatedQuestions);
            setEditingQuestionIndex(null);
        } else {
            setQuestions([...questions, currentQuestion]);
        }

        setCurrentQuestion({
            text: "",
            choices: [
                { id: "a", text: "" },
                { id: "b", text: "" },
            ],
            correctAnswer: "a",
        });
    };

    // Edit an existing question
    const editQuestion = (index) => {
        setCurrentQuestion(questions[index]);
        setEditingQuestionIndex(index);
    };

    // Delete a question
    const deleteQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    // Submit the updated quiz and questions
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            // Update the quiz
            const quizPayload = {
                ...quizData,
                questions: questions.map((q) => q._id), // Send only question IDs
            };

            await axios.put(
                `${API_BASE_URL}/api/quizzes/${selectedQuizId}`,
                quizPayload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update or create questions
            await Promise.all(
                questions.map((question) =>
                    question._id
                        ? axios.put(
                              `${API_BASE_URL}/api/questions/${question._id}`,
                              question,
                              { headers: { Authorization: `Bearer ${token}` } }
                          )
                        : axios.post(
                              `${API_BASE_URL}/api/questions`,
                              { ...question, quiz: selectedQuizId },
                              { headers: { Authorization: `Bearer ${token}` } }
                          )
                )
            );

            navigate("/welcome-admin");
        } catch (error) {
            setError("Failed to update quiz. Please try again later.");
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.title}>Modify Quiz</h1>
                {error && <p className={styles.error}>{error}</p>}

                {/* Quiz Selection Dropdown */}
                <div className={styles.formGroup}>
                    <label>Select Quiz:</label>
                    <select
                        value={selectedQuizId}
                        onChange={handleQuizSelection}
                    >
                        <option value="">-- Select a Quiz --</option>
                        {quizList.map((quiz) => (
                            <option key={quiz._id} value={quiz._id}>
                                {quiz.title}
                            </option>
                        ))}
                    </select>
                </div>

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

                    {/* Add/Edit Questions */}
                    <div className={styles.questionSection}>
                        <h3>
                            {editingQuestionIndex !== null ? "Edit" : "Add"}{" "}
                            Question
                        </h3>
                        <div className={styles.formGroup}>
                            <label>Question Text:</label>
                            <input
                                type="text"
                                name="text"
                                value={currentQuestion.text}
                                onChange={(e) =>
                                    setCurrentQuestion((prev) => ({
                                        ...prev,
                                        text: e.target.value,
                                    }))
                                }
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
                                value={currentQuestion.correctAnswer}
                                onChange={handleCorrectAnswerChange}
                            >
                                {currentQuestion.choices.map((choice) => (
                                    <option key={choice.id} value={choice.id}>
                                        {choice.id.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            className={styles.addQuestionButton}
                            onClick={saveQuestion}
                        >
                            {editingQuestionIndex !== null
                                ? "Save Question"
                                : "Add Question"}
                        </button>
                    </div>

                    {/* Existing Questions */}
                    <div className={styles.questionList}>
                        <h3>Existing Questions</h3>
                        {questions.map((q, index) => (
                            <div key={index} className={styles.questionItem}>
                                <p>
                                    {index + 1}. {q.text}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => editQuestion(index)}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => deleteQuestion(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Update Quiz
                    </button>
                </form>
            </div>
        </>
    );
};

export default ModifyQuiz;
