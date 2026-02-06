import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";
import Header from "../components/Header";
import styles from "../styles/DeleteQuiz.module.css";

const DeleteQuiz = () => {
    const navigate = useNavigate();
    const [quizList, setQuizList] = useState([]); // List of all quizzes
    const [selectedQuizId, setSelectedQuizId] = useState(""); // Selected quiz ID
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

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
                // console.error("Failed to fetch quizzes:", error);
                setError("Failed to load quizzes. Please try again later.");
            }
        };

        fetchQuizzes();
    }, []);

    // Handle quiz selection
    const handleQuizSelection = (e) => {
        setSelectedQuizId(e.target.value);
        setSuccessMessage(null); // Clear any success message
        setError(null); // Clear any error message
    };

    // Handle quiz deletion
    const handleDeleteQuiz = async () => {
        if (!selectedQuizId) {
            setError("Please select a quiz to delete.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${API_BASE_URL}/api/quizzes/${selectedQuizId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setQuizList((prev) =>
                prev.filter((quiz) => quiz._id !== selectedQuizId)
            );
            setSelectedQuizId("");
            setSuccessMessage("Quiz deleted successfully!");
            setError(null);
        } catch (error) {
            // console.error("Failed to delete quiz:", error);
            setError("Failed to delete the quiz. Please try again later.");
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.title}>Delete Quiz</h1>
                {error && <p className={styles.error}>{error}</p>}
                {successMessage && (
                    <p className={styles.success}>{successMessage}</p>
                )}

                <div className={styles.formGroup}>
                    <label htmlFor="quizDropdown">Select Quiz:</label>
                    <select
                        id="quizDropdown"
                        value={selectedQuizId}
                        onChange={handleQuizSelection}
                        className={styles.dropdown}
                    >
                        <option value="">-- Select a Quiz --</option>
                        {quizList.map((quiz) => (
                            <option key={quiz._id} value={quiz._id}>
                                {quiz.title}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleDeleteQuiz}
                    className={styles.deleteButton}
                    disabled={!selectedQuizId} // Disable button if no quiz is selected
                >
                    Delete Quiz
                </button>

                <button
                    className={styles.backButton}
                    onClick={() => navigate("/welcome-admin")}
                >
                    Back to Admin Dashboard
                </button>
            </div>
        </>
    );
};

export default DeleteQuiz;
