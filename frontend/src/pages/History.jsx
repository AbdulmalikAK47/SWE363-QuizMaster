import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styles from "../styles/History.module.css";
import axios from "axios";
import API_BASE_URL from "../config/api";

const History = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [expandedQuizId, setExpandedQuizId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizStats, setQuizStats] = useState({});
    const [questionsMap, setQuestionsMap] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        } else {
            fetchHistory(token);
        }
    }, [navigate]);

    useEffect(() => {
        window.history.pushState(null, "", window.location.href);
        const handleBrowserBack = () => {
            navigate("/welcome");
        };
        window.addEventListener("popstate", handleBrowserBack);
        return () => {
            window.removeEventListener("popstate", handleBrowserBack);
        };
    }, [navigate]);

    const fetchHistory = async (token) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/grades/history`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const fetchedHistory = response.data.reverse();
            setHistory(fetchedHistory);
            calculateGlobalStats(fetchedHistory, token);
        } catch (err) {
            setError("Failed to load history. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const calculateGlobalStats = async (historyData, token) => {
        const stats = {};
        for (const quizRecord of historyData) {
            const quizId = quizRecord.quiz?._id;
            if (!quizId) continue;
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/grades/quiz-stats/${quizId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                stats[quizId] = response.data;
            } catch (error) {
                // Stats fetch failed silently
            }
        }
        setQuizStats(stats);
    };

    const fetchQuestionsForQuiz = async (quizId, token) => {
        if (questionsMap[quizId]) return;
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/quizzes/${quizId}/questions`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuestionsMap((prev) => ({ ...prev, [quizId]: response.data }));
        } catch (error) {
            // Questions fetch failed silently
        }
    };

    const toggleDetails = async (quizId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        if (!questionsMap[quizId]) {
            await fetchQuestionsForQuiz(quizId, token);
        }
        setExpandedQuizId((prev) => (prev === quizId ? null : quizId));
    };

    // Computed summary stats
    const totalAttempts = history.length;
    const avgScore =
        totalAttempts > 0
            ? Math.round(
                  history.reduce(
                      (sum, h) =>
                          sum +
                          (h.totalQuestions > 0
                              ? (h.score / h.totalQuestions) * 100
                              : 0),
                      0
                  ) / totalAttempts
              )
            : 0;
    const bestScore =
        totalAttempts > 0
            ? Math.round(
                  Math.max(
                      ...history.map((h) =>
                          h.totalQuestions > 0
                              ? (h.score / h.totalQuestions) * 100
                              : 0
                      )
                  )
              )
            : 0;

    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.spinner} />
                <p>Loading history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorScreen}>
                <div className={styles.errorIcon}>!</div>
                <p>{error}</p>
                <button className={styles.retryBtn} onClick={() => fetchHistory(localStorage.getItem("token"))}>
                    Try Again
                </button>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <>
                <Header />
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" />
                        </svg>
                    </div>
                    <p className={styles.emptyTitle}>No quiz history yet</p>
                    <p className={styles.emptyDesc}>Take your first quiz and your results will show up here.</p>
                    <button onClick={() => navigate("/quizzes")} className={styles.emptyBtn}>
                        Browse Quizzes
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />

            <div className={styles.page}>
                {/* Page header */}
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Quiz History</h1>
                    <p className={styles.pageSubtitle}>
                        {totalAttempts} quiz{totalAttempts !== 1 ? "zes" : ""} completed
                    </p>
                </div>

                {/* Summary stats */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>{totalAttempts}</span>
                        <span className={styles.statLabel}>Attempts</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={`${styles.statNumber} ${styles.statGreen}`}>{bestScore}%</span>
                        <span className={styles.statLabel}>Best Score</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>{avgScore}%</span>
                        <span className={styles.statLabel}>Average</span>
                    </div>
                </div>

                {/* History list */}
                <div className={styles.list}>
                    {history.map((quizAttempt) => {
                        const quizId = quizAttempt.quiz?._id;
                        const quizTitle = quizAttempt.quiz?.title || "Unknown Quiz";
                        const stats = quizStats[quizId] || { average: 0, median: 0 };
                        const questions = questionsMap[quizId] || [];
                        const pct =
                            quizAttempt.totalQuestions > 0
                                ? (quizAttempt.score / quizAttempt.totalQuestions) * 100
                                : 0;
                        const isExpanded = expandedQuizId === quizId;

                        const scoreClass =
                            pct >= 70
                                ? styles.scoreGood
                                : pct >= 40
                                ? styles.scoreOk
                                : styles.scoreBad;

                        const compText =
                            pct > stats.average
                                ? "Above average"
                                : pct < stats.average
                                ? "Below average"
                                : "On average";
                        const compClass =
                            pct > stats.average
                                ? styles.compAbove
                                : pct < stats.average
                                ? styles.compBelow
                                : styles.compOn;

                        if (!quizId) {
                            return (
                                <div key={quizAttempt._id || Math.random()} className={styles.card}>
                                    <p className={styles.cardError}>Quiz data is incomplete for this entry.</p>
                                </div>
                            );
                        }

                        return (
                            <div key={quizAttempt._id} className={`${styles.card} ${isExpanded ? styles.cardExpanded : ""}`}>
                                {/* Card main row */}
                                <button className={styles.cardRow} onClick={() => toggleDetails(quizId)}>
                                    {/* Score circle */}
                                    <div className={`${styles.scoreCircle} ${scoreClass}`}>
                                        <span className={styles.scoreValue}>{Math.round(pct)}%</span>
                                    </div>

                                    {/* Info */}
                                    <div className={styles.cardInfo}>
                                        <h3 className={styles.cardTitle}>{quizTitle}</h3>
                                        <div className={styles.cardMeta}>
                                            <span className={styles.cardDate}>
                                                {new Date(quizAttempt.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span className={styles.cardDot} />
                                            <span>
                                                {quizAttempt.score}/{quizAttempt.totalQuestions} correct
                                            </span>
                                            <span className={styles.cardDot} />
                                            <span className={compClass}>{compText}</span>
                                        </div>
                                    </div>

                                    {/* Chevron */}
                                    <svg
                                        className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>

                                {/* Expandable details */}
                                {isExpanded && (
                                    <div className={styles.details}>
                                        {/* Stats bar */}
                                        <div className={styles.detailsStats}>
                                            <div className={styles.detailsStat}>
                                                <span className={styles.detailsStatLabel}>Class Average</span>
                                                <span className={styles.detailsStatValue}>{stats.average?.toFixed(1) ?? "N/A"}%</span>
                                            </div>
                                            <div className={styles.detailsStat}>
                                                <span className={styles.detailsStatLabel}>Median</span>
                                                <span className={styles.detailsStatValue}>{stats.median?.toFixed(1) ?? "N/A"}%</span>
                                            </div>
                                            <div className={styles.detailsStat}>
                                                <span className={styles.detailsStatLabel}>Your Score</span>
                                                <span className={`${styles.detailsStatValue} ${scoreClass}`}>{pct.toFixed(1)}%</span>
                                            </div>
                                        </div>

                                        {/* Answers */}
                                        <div className={styles.answers}>
                                            {quizAttempt.answers.map((answer, index) => {
                                                const question = questions.find((q) => q._id === answer.questionId);
                                                const userAnswer = question?.choices.find((c) => c.id === answer.answerId)?.text || "Unknown";
                                                const correctAnswer = question?.choices.find((c) => c.id === question.correctAnswer)?.text || "Unknown";

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`${styles.answerCard} ${answer.isCorrect ? styles.answerCorrect : styles.answerWrong}`}
                                                    >
                                                        <div className={styles.answerTop}>
                                                            <span className={styles.answerNum}>Q{index + 1}</span>
                                                            {answer.isCorrect ? (
                                                                <span className={styles.answerBadgeCorrect}>
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    Correct
                                                                </span>
                                                            ) : (
                                                                <span className={styles.answerBadgeWrong}>
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                                    Incorrect
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className={styles.answerQuestion}>
                                                            {question?.text || "Unknown Question"}
                                                        </p>
                                                        <div className={styles.answerDetails}>
                                                            <span className={styles.answerYour}>
                                                                Your answer: <strong>{userAnswer}</strong>
                                                            </span>
                                                            {!answer.isCorrect && (
                                                                <span className={styles.answerCorrectText}>
                                                                    Correct answer: <strong>{correctAnswer}</strong>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Back button */}
                <div className={styles.footer}>
                    <button className={styles.backBtn} onClick={() => navigate("/welcome")}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </>
    );
};

export default History;
