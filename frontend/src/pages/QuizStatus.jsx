import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styles from "../styles/QuizStatus.module.css";

const QuizStatus = () => {
    const navigate = useNavigate();
    const [quizStats, setQuizStats] = useState([]);
    const [error, setError] = useState(null);

    // Fetch quiz statistics
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/grades/quiz-stats",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Directly use the API response without deduplication
                setQuizStats(response.data);
            } catch (error) {
                console.error("Failed to fetch quiz statistics:", error);
                setError(
                    "Failed to load quiz statistics. Please try again later."
                );
            }
        };

        fetchStats();
    }, []);

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.title}>Quiz Statistics</h1>
                {error && <p className={styles.error}>{error}</p>}
                {quizStats.length === 0 && !error && (
                    <p className={styles.emptyState}>
                        No quiz statistics available.
                    </p>
                )}
                <div className={styles.statsTable}>
                    {quizStats.map((stat) => (
                        <div key={stat.quizId} className={styles.statCard}>
                            <h3>{stat.title}</h3>
                            <p>
                                <strong>Average Score:</strong>{" "}
                                {stat.average !== undefined
                                    ? `${stat.average.toFixed(2)}%`
                                    : "N/A"}
                            </p>
                            <p>
                                <strong>Median Score:</strong>{" "}
                                {stat.median !== undefined
                                    ? `${stat.median.toFixed(2)}%`
                                    : "N/A"}
                            </p>
                            <p>
                                <strong>Number of Takers:</strong>{" "}
                                {stat.takers || 0}
                            </p>
                        </div>
                    ))}
                </div>
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

export default QuizStatus;
