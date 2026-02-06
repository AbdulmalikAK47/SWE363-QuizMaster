import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SignInModal from "../pages/SignInModal";
import styles from "../styles/Quizzes.module.css";
import axios from "axios";
import API_BASE_URL from "../config/api";

const Quizzes = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({ type: "All", level: "All" });
    const [showSignInModal, setShowSignInModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setShowSignInModal(true);
        } else {
            fetchQuizzes(token);
        }
    }, []);

    const fetchQuizzes = async (token) => {
        try {
            setLoading(true);
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

    const handleLoginSuccess = (token) => {
        setShowSignInModal(false);
        localStorage.setItem("token", token);
        fetchQuizzes(token);
    };

    const filteredQuizzes = quizzes.filter((quiz) => {
        const matchesType = filter.type === "All" || quiz.type === filter.type;
        const matchesLevel = filter.level === "All" || quiz.level === filter.level;
        return matchesType && matchesLevel;
    });

    const hasActiveFilters = filter.type !== "All" || filter.level !== "All";

    if (loading && !showSignInModal) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.spinner} />
                <p>Loading quizzes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorScreen}>
                <div className={styles.errorIcon}>!</div>
                <p>{error}</p>
                <button
                    className={styles.retryBtn}
                    onClick={() => fetchQuizzes(localStorage.getItem("token"))}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <>
            <Header />

            <div className={styles.page}>
                {/* Page header */}
                <div className={styles.pageHeader}>
                    <div className={styles.pageHeaderContent}>
                        <h1 className={styles.pageTitle}>Explore Quizzes</h1>
                        <p className={styles.pageSubtitle}>
                            {quizzes.length} quiz{quizzes.length !== 1 ? "es" : ""} available — pick one and test yourself
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className={styles.toolbar}>
                    <div className={styles.filters}>
                        <select
                            value={filter.type}
                            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                            className={styles.filterSelect}
                        >
                            <option value="All">All Types</option>
                            <option value="Multiple_Choice">Multiple Choice</option>
                            <option value="True/False">True / False</option>
                        </select>
                        <select
                            value={filter.level}
                            onChange={(e) => setFilter({ ...filter, level: e.target.value })}
                            className={styles.filterSelect}
                        >
                            <option value="All">All Levels</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    {hasActiveFilters && (
                        <button
                            className={styles.clearBtn}
                            onClick={() => setFilter({ type: "All", level: "All" })}
                        >
                            Clear filters
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Quiz grid */}
                {filteredQuizzes.length > 0 ? (
                    <div className={styles.grid}>
                        {filteredQuizzes.map((quiz) => (
                            <button
                                key={quiz._id}
                                className={styles.card}
                                onClick={() => navigate(`/quiz/${quiz._id}`)}
                            >
                                <div className={styles.cardTop}>
                                    <span className={`${styles.levelBadge} ${styles[`level${quiz.level}`] || ""}`}>
                                        {quiz.level}
                                    </span>
                                    <span className={styles.typeBadge}>
                                        {quiz.type === "Multiple_Choice" ? "MCQ" : quiz.type}
                                    </span>
                                </div>
                                <h3 className={styles.cardTitle}>{quiz.title}</h3>
                                <div className={styles.cardFooter}>
                                    <span className={styles.startLabel}>
                                        Start Quiz
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                        <p className={styles.emptyTitle}>No quizzes found</p>
                        <p className={styles.emptyDesc}>
                            {hasActiveFilters
                                ? "Try adjusting your filters to see more results."
                                : "There are no quizzes available right now."}
                        </p>
                        {hasActiveFilters && (
                            <button
                                className={styles.emptyClearBtn}
                                onClick={() => setFilter({ type: "All", level: "All" })}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {showSignInModal && (
                <SignInModal
                    onClose={() => setShowSignInModal(false)}
                    openModal={() => setShowSignInModal(true)}
                />
            )}
        </>
    );
};

export default Quizzes;
