import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";
import Header from "../components/Header";
import styles from "../styles/QuizStatus.module.css";

const QuizStatus = () => {
    const navigate = useNavigate();
    const [quizStats, setQuizStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${API_BASE_URL}/api/grades/quiz-stats`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setQuizStats(response.data);
            } catch (error) {
                setError("Failed to load quiz statistics. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const totalTakers = quizStats.reduce((sum, s) => sum + (s.takers || 0), 0);
    const overallAvg =
        quizStats.length > 0
            ? Math.round(
                  quizStats.reduce((sum, s) => sum + (s.average || 0), 0) / quizStats.length
              )
            : 0;

    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.spinner} />
                <p>Loading statistics...</p>
            </div>
        );
    }

    return (
        <>
            <Header />

            <div className={styles.page}>
                {/* Page header */}
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Quiz Statistics</h1>
                    <p className={styles.pageSubtitle}>
                        Performance overview across all quizzes
                    </p>
                </div>

                {error && (
                    <div className={styles.errorBanner}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Summary stats */}
                {quizStats.length > 0 && (
                    <div className={styles.statsRow}>
                        <div className={styles.statSummary}>
                            <span className={styles.statSummaryNumber}>{quizStats.length}</span>
                            <span className={styles.statSummaryLabel}>Quizzes</span>
                        </div>
                        <div className={styles.statSummary}>
                            <span className={styles.statSummaryNumber}>{totalTakers}</span>
                            <span className={styles.statSummaryLabel}>Total Attempts</span>
                        </div>
                        <div className={styles.statSummary}>
                            <span className={`${styles.statSummaryNumber} ${overallAvg >= 70 ? styles.statGreen : ""}`}>
                                {overallAvg}%
                            </span>
                            <span className={styles.statSummaryLabel}>Overall Average</span>
                        </div>
                    </div>
                )}

                {/* Quiz stat cards */}
                {quizStats.length > 0 ? (
                    <div className={styles.grid}>
                        {quizStats.map((stat) => {
                            const avg = stat.average ?? 0;
                            const avgClass =
                                avg >= 70
                                    ? styles.scoreGood
                                    : avg >= 40
                                    ? styles.scoreOk
                                    : styles.scoreBad;

                            return (
                                <div key={stat.quizId} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardTitle}>{stat.title}</h3>
                                        <div className={`${styles.avgCircle} ${avgClass}`}>
                                            <span className={styles.avgValue}>
                                                {avg !== undefined ? Math.round(avg) : "—"}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Score bar */}
                                    <div className={styles.barTrack}>
                                        <div
                                            className={`${styles.barFill} ${avgClass}`}
                                            style={{ width: `${Math.min(avg, 100)}%` }}
                                        />
                                    </div>

                                    <div className={styles.cardStats}>
                                        <div className={styles.cardStat}>
                                            <span className={styles.cardStatLabel}>Average</span>
                                            <span className={styles.cardStatValue}>
                                                {avg !== undefined ? `${avg.toFixed(1)}%` : "N/A"}
                                            </span>
                                        </div>
                                        <div className={styles.cardStat}>
                                            <span className={styles.cardStatLabel}>Median</span>
                                            <span className={styles.cardStatValue}>
                                                {stat.median !== undefined ? `${stat.median.toFixed(1)}%` : "N/A"}
                                            </span>
                                        </div>
                                        <div className={styles.cardStat}>
                                            <span className={styles.cardStatLabel}>Takers</span>
                                            <span className={styles.cardStatValue}>
                                                {stat.takers || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    !error && (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>
                                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </div>
                            <p className={styles.emptyTitle}>No statistics yet</p>
                            <p className={styles.emptyDesc}>
                                Statistics will appear here once students start taking quizzes.
                            </p>
                        </div>
                    )
                )}

                {/* Back button */}
                <div className={styles.footer}>
                    <button className={styles.backBtn} onClick={() => navigate("/welcome-admin")}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Admin Dashboard
                    </button>
                </div>
            </div>
        </>
    );
};

export default QuizStatus;
