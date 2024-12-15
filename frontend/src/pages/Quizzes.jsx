import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SignInModal from "../pages/SignInModal"; // Existing SignInModal
import styles from "../styles/Quizzes.module.css";
import axios from "axios";

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
            setShowSignInModal(true); // Show SignInModal if no token
        } else {
            fetchQuizzes(token); // Fetch quizzes if token exists
        }
    }, []);

    const fetchQuizzes = async (token) => {
        try {
            setLoading(true);
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

    if (loading && !showSignInModal) {
        return <div className={styles.loading}>Loading quizzes...</div>;
    }

    if (error) {
        return (
            <div className={styles.error}>
                <p>{error}</p>
                <button
                    onClick={() => fetchQuizzes(localStorage.getItem("token"))}
                >
                    Retry
                </button>
            </div>
        );
    }

    const handleLoginSuccess = (token) => {
        setShowSignInModal(false); // Close modal after login
        localStorage.setItem("token", token); // Save token
        fetchQuizzes(token); // Fetch quizzes
    };

    console.log(filter);

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.gridWrapper}>
                    <div className={styles.header}>
                        <p className={styles.title}>Available Quizzes</p>
                        <button
                            className={styles.clearFiltersButton}
                            onClick={() =>
                                setFilter({ type: "All", level: "All" })
                            }
                        >
                            Clear Filters
                        </button>
                    </div>
                    <div className={styles.filterContainer}>
                        <select
                            value={filter.type}
                            onChange={(e) =>
                                setFilter({ ...filter, type: e.target.value })
                            }
                            className={styles.filterDropdown}
                        >
                            <option value="All">All Types</option>
                            <option value="Multiple_Choice">
                                Multiple Choice
                            </option>
                            <option value="True/False">True/False</option>
                        </select>
                        <select
                            value={filter.level}
                            onChange={(e) =>
                                setFilter({ ...filter, level: e.target.value })
                            }
                            className={styles.filterDropdown}
                        >
                            <option value="All">All Levels</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div className={styles.divider}></div>
                    <section className={styles.quizGrid}>
                        {quizzes.length > 0 ? (
                            // Filter quizzes based on selected filter options
                            quizzes.filter((quiz) => {
                                const matchesType =
                                    filter.type === "All" ||
                                    quiz.type === filter.type;
                                const matchesLevel =
                                    filter.level === "All" ||
                                    quiz.level === filter.level;

                                return matchesType && matchesLevel;
                            }).length > 0 ? (
                                // Render filtered quizzes if there are matches
                                quizzes
                                    .filter((quiz) => {
                                        const matchesType =
                                            filter.type === "All" ||
                                            quiz.type === filter.type;
                                        const matchesLevel =
                                            filter.level === "All" ||
                                            quiz.level === filter.level;

                                        return matchesType && matchesLevel;
                                    })
                                    .map((quiz) => (
                                        <div
                                            key={quiz._id}
                                            className={styles.quizCard}
                                        >
                                            <div className={styles.quizHeader}>
                                                <span
                                                    className={styles.quizType}
                                                >
                                                    {quiz.type}
                                                </span>
                                                <span
                                                    className={styles.quizLevel}
                                                >
                                                    {quiz.level}
                                                </span>
                                            </div>
                                            <div className={styles.quizContent}>
                                                <h3
                                                    className={styles.quizTitle}
                                                >
                                                    {quiz.title}
                                                </h3>
                                                <button
                                                    className={
                                                        styles.startQuizButton
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/quiz/${quiz._id}`
                                                        )
                                                    }
                                                >
                                                    Start
                                                </button>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                // Show message if no quizzes match the filters
                                <div className={styles.noQuizzes}>
                                    No quizzes match the selected filters.
                                </div>
                            )
                        ) : (
                            // If there are no quizzes at all
                            <div className={styles.noQuizzes}>
                                No quizzes available.
                            </div>
                        )}
                    </section>
                </div>
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
