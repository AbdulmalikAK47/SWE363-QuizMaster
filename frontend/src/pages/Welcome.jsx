import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import styles from "../styles/Welcome.module.css";
import alertStyles from "../styles/Alert.module.css";
import axios from "axios";
import API_BASE_URL from "../config/api";

const WelcomePage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [quizHistory, setQuizHistory] = useState([]);
    const [user, setUser] = useState({ firstName: "User" });
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setShowAlert(true);
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } else {
            fetchUser(token);
            fetchQuizzes(token);
            fetchHistory(token);
        }
    }, [navigate]);

    const fetchUser = async (token) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/auth/me`,
                { headers: { Authorization: `Bearer ${token}` } }
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
            const response = await axios.get(
                `${API_BASE_URL}/api/quizzes`,
                { headers: { Authorization: `Bearer ${token}` } }
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
            const response = await axios.get(
                `${API_BASE_URL}/api/grades/history`,
                { headers: { Authorization: `Bearer ${token}` } }
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

    const avgScore =
        quizHistory.length > 0
            ? Math.round(
                  quizHistory.reduce(
                      (sum, h) => sum + (h.score / h.totalQuestions) * 100,
                      0
                  ) / quizHistory.length
              )
            : 0;

    return (
        <div className={styles.pageContainer}>
            {showAlert && (
                <div className={alertStyles.alert}>
                    You are not logged in. Redirecting to the home page...
                </div>
            )}

            {!loading ? (
                <>
                    <Header />

                    {/* Hero greeting */}
                    <section className={styles.hero}>
                        <div className={styles.heroGlow} />
                        <div className={styles.heroContent}>
                            <h1 className={styles.greeting}>
                                Welcome back, <span className={styles.gradientName}>{user.firstName}</span>
                            </h1>
                            <p className={styles.subtitle}>
                                Ready to challenge yourself? Pick an action below to get started.
                            </p>
                        </div>
                    </section>

                    {/* Quick stats */}
                    <section className={styles.statsRow}>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>{quizzes.length}</span>
                            <span className={styles.statLabel}>Available Quizzes</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>{quizHistory.length}</span>
                            <span className={styles.statLabel}>Quizzes Taken</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={`${styles.statNumber} ${avgScore >= 70 ? styles.statGood : ""}`}>
                                {quizHistory.length > 0 ? `${avgScore}%` : "—"}
                            </span>
                            <span className={styles.statLabel}>Avg Score</span>
                        </div>
                    </section>

                    {/* Action cards */}
                    <section className={styles.actions}>
                        <div className={styles.actionsGrid}>
                            {/* Start a Quiz */}
                            <button className={styles.actionCard} onClick={() => navigate("/quizzes")}>
                                <div className={styles.actionIcon}>
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                    </svg>
                                </div>
                                <div className={styles.actionText}>
                                    <h3 className={styles.actionTitle}>Start a New Quiz</h3>
                                    <p className={styles.actionDesc}>Browse all available quizzes and test your knowledge</p>
                                </div>
                                <svg className={styles.actionArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>

                            {/* Random Quiz */}
                            <button className={styles.actionCard} onClick={takeRandomQuiz}>
                                <div className={`${styles.actionIcon} ${styles.actionIconYellow}`}>
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary-yellow-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="1" y="1" width="22" height="22" rx="4" />
                                        <circle cx="8" cy="8" r="1.5" fill="var(--primary-yellow-dark)" />
                                        <circle cx="16" cy="8" r="1.5" fill="var(--primary-yellow-dark)" />
                                        <circle cx="8" cy="16" r="1.5" fill="var(--primary-yellow-dark)" />
                                        <circle cx="16" cy="16" r="1.5" fill="var(--primary-yellow-dark)" />
                                        <circle cx="12" cy="12" r="1.5" fill="var(--primary-yellow-dark)" />
                                    </svg>
                                </div>
                                <div className={styles.actionText}>
                                    <h3 className={styles.actionTitle}>Take a Random Quiz</h3>
                                    <p className={styles.actionDesc}>Feeling adventurous? Jump into a surprise quiz</p>
                                </div>
                                <svg className={styles.actionArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>

                            {/* Quiz History */}
                            {quizHistory.length > 0 && (
                                <button className={styles.actionCard} onClick={() => navigate("/history")}>
                                    <div className={styles.actionIcon}>
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                        </svg>
                                    </div>
                                    <div className={styles.actionText}>
                                        <h3 className={styles.actionTitle}>View Quiz History</h3>
                                        <p className={styles.actionDesc}>
                                            You've completed {quizHistory.length} quiz{quizHistory.length !== 1 ? "es" : ""} — review your results
                                        </p>
                                    </div>
                                    <svg className={styles.actionArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </button>
                            )}

                            {/* Learn */}
                            <button className={styles.actionCard} onClick={() => navigate("/learn")}>
                                <div className={`${styles.actionIcon} ${styles.actionIconYellow}`}>
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary-yellow-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                    </svg>
                                </div>
                                <div className={styles.actionText}>
                                    <h3 className={styles.actionTitle}>Learn How to Use QuizMaster</h3>
                                    <p className={styles.actionDesc}>New here? See how everything works</p>
                                </div>
                                <svg className={styles.actionArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    </section>
                </>
            ) : (
                <div className={styles.loadingScreen}>
                    <div className={styles.spinner} />
                    <p>Loading your dashboard...</p>
                </div>
            )}
        </div>
    );
};

export default WelcomePage;
