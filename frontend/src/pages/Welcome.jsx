import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import styles from "../styles/Welcome.module.css";
import alertStyles from "../styles/Alert.module.css";
import axios from "axios";

const WelcomePage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [quizHistory, setQuizHistory] = useState([]);
    const [user, setUser] = useState({ firstName: "User" }); // Default placeholder
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setShowAlert(true); // Show alert message
            setTimeout(() => {
                navigate("/"); // Redirect after 2 seconds
            }, 3000);
        } else {
            fetchUser(token); // Fetch user data
            fetchQuizzes(token); // Fetch quizzes
            fetchHistory(token); // Fetch history
        }
    }, [navigate]);

    const fetchUser = async (token) => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/auth/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUser(response.data);
        } catch (error) {
            setError("Failed to fetch user. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchQuizzes = async (token) => {
        try {
            // Fetch all quizzes without questions
            const response = await axios.get(
                "http://localhost:5000/api/quizzes",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setQuizzes(response.data);
        } catch (error) {
            setError("Failed to fetch quizzes. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (token) => {
        try {
            // Fetch user quiz history
            const response = await axios.get(
                "http://localhost:5000/api/grades/history",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setQuizHistory(response.data);
        } catch (error) {
            setError("Failed to fetch quiz history. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const takeRandomQuiz = () => {
        if (quizzes.length > 0) {
            const randomQuiz =
                quizzes[Math.floor(Math.random() * quizzes.length)];
            navigate(`/quiz/${randomQuiz._id}`);
        } else {
            alert("No quizzes available!");
        }
    };

    return (
        <div className={styles.pageContainer}>
            {/* Alert section: Always rendered */}
            {showAlert && (
                <div className={alertStyles.alert}>
                    You are not logged in. Redirecting to the home page...
                </div>
            )}

            {!loading ? (
                <>
                    <Header />
                    <div className={styles.welcomeContainer}>
                        <h1 className={styles.greeting}>
                            Welcome, {user.firstName}!
                        </h1>
                        <p className={styles.message}>
                            Ready to test your knowledge? Choose an option below
                            to get started.
                        </p>

                        <div className={styles.options}>
                            {/* Start a New Quiz */}
                            <button
                                className={styles.optionButton}
                                onClick={() => navigate("/quizzes")}
                            >
                                📝 Start a New Quiz
                            </button>

                            {/* View Quiz History */}
                            {quizHistory.length > 0 && (
                                <button
                                    className={styles.optionButton}
                                    onClick={() => navigate("/history")}
                                >
                                    📊 View Quiz History ({quizHistory.length}{" "}
                                    Completed)
                                </button>
                            )}

                            {/* Take a Random Quiz */}
                            <button
                                className={styles.optionButton}
                                onClick={takeRandomQuiz}
                            >
                                🎲 Take a Random Quiz
                            </button>

                            {/* Learn How to Use QuizMaster */}
                            <button
                                className={styles.optionButton}
                                onClick={() => navigate("/learn")}
                            >
                                📚 Learn How to Use Quiz Master
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles.loading}>Loading quizzes...</div>
            )}
        </div>
    );
};

export default WelcomePage;
