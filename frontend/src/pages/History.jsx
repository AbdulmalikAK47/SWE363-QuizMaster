import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styles from "../styles/History.module.css";
import axios from "axios";

const History = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [expandedQuizId, setExpandedQuizId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizStats, setQuizStats] = useState({});
    const [questionsMap, setQuestionsMap] = useState({});

    // Effect for authentication and fetching initial history
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/"); // Redirect to home if not authenticated
        } else {
            fetchHistory(token);
        }
    }, [navigate]); // navigate is a dependency for this effect

    // Effect to handle browser back button navigation
    useEffect(() => {
        // Push a new state to the history stack when the component mounts.
        // This ensures that when the user clicks 'back', our popstate listener is triggered first.
        window.history.pushState(null, "", window.location.href);

        const handleBrowserBack = (event) => {
            // When the popstate event fires (due to back button from our pushed state),
            // navigate to /welcome.
            navigate("/welcome");
        };

        window.addEventListener("popstate", handleBrowserBack);

        // Cleanup: remove the event listener when the component unmounts.
        return () => {
            window.removeEventListener("popstate", handleBrowserBack);
            // Note: If the user navigates away by means other than the back button
            // (e.g., clicking a link), this cleanup runs, and the pushed state
            // might remain in the browser's history, which is generally harmless.
            // If they used the back button, they'd be redirected by handleBrowserBack
            // before this cleanup fully matters for the current navigation action.
        };
    }, [navigate]); // navigate is a dependency for this effect

    const fetchHistory = async (token) => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/grades/history",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const fetchedHistory = response.data.reverse();
            setHistory(fetchedHistory);
            calculateGlobalStats(fetchedHistory, token);
        } catch (err) {
            console.error("Failed to fetch history:", err);
            setError("Failed to load history. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const calculateGlobalStats = async (historyData, token) => {
        // Renamed history to historyData to avoid conflict
        const stats = {};
        for (const quizRecord of historyData) {
            // Renamed quiz to quizRecord
            const quizId = quizRecord.quiz?._id;

            if (!quizId) {
                console.warn(
                    `Quiz ID is missing for history item:`,
                    quizRecord
                );
                continue;
            }

            try {
                const response = await axios.get(
                    `http://localhost:5000/api/grades/quiz-stats/${quizId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                stats[quizId] = response.data;
            } catch (error) {
                console.error(
                    `Failed to fetch stats for quiz ${quizId}:`,
                    error
                );
            }
        }
        setQuizStats(stats);
    };

    const fetchQuestionsForQuiz = async (quizId, token) => {
        if (questionsMap[quizId]) return;

        try {
            const response = await axios.get(
                `http://localhost:5000/api/quizzes/${quizId}/questions`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuestionsMap((prev) => ({ ...prev, [quizId]: response.data }));
        } catch (error) {
            console.error(
                `Failed to fetch questions for quiz ${quizId}:`,
                error
            );
        }
    };

    const toggleDetails = async (quizId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            // Added token check for safety, though should be authed
            navigate("/");
            return;
        }

        if (!questionsMap[quizId]) {
            await fetchQuestionsForQuiz(quizId, token);
        }

        setExpandedQuizId((prevQuizId) =>
            prevQuizId === quizId ? null : quizId
        );
    };

    if (loading) {
        return <div className={styles.loading}>Loading history...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (history.length === 0) {
        return (
            <>
                <Header />
                <div className={styles.emptyState}>
                    <p>You have no quiz history yet.</p>
                    <button
                        onClick={() => navigate("/quizzes")}
                        className={styles.startQuizButton}
                    >
                        Take a Quiz
                    </button>
                </div>
            </>
        );
    }
    return (
        <>
            <Header />
            <div className={styles.historyMain}>
                <h1 className={styles.title}>Quiz History</h1>
                <div className={styles.historyList}>
                    {history.map((quizAttempt) => {
                        // Renamed quiz to quizAttempt for clarity
                        const quizId = quizAttempt.quiz?._id; // Use optional chaining
                        const quizTitle =
                            quizAttempt.quiz?.title || "Unknown Quiz"; // Default title
                        const stats = quizStats[quizId] || {
                            average: 0,
                            median: 0,
                        };
                        const questions = questionsMap[quizId] || [];
                        const quizScorePercentage =
                            quizAttempt.totalQuestions > 0
                                ? (quizAttempt.score /
                                      quizAttempt.totalQuestions) *
                                  100
                                : 0;

                        const scoreStyle =
                            quizScorePercentage > stats.average
                                ? styles.aboveAverage
                                : quizScorePercentage < stats.average
                                ? styles.belowAverage
                                : styles.onAverage;

                        const comparisonText =
                            quizScorePercentage > stats.average
                                ? "You are above average"
                                : quizScorePercentage < stats.average
                                ? "You are below average"
                                : "You are on average";

                        const comparisonTextStyle =
                            quizScorePercentage > stats.average
                                ? styles.textAboveAverage
                                : quizScorePercentage < stats.average
                                ? styles.textBelowAverage
                                : styles.textOnAverage;

                        // Guard against missing quizId before rendering card content that depends on it
                        if (!quizId) {
                            return (
                                <div
                                    key={quizAttempt._id || Math.random()}
                                    className={styles.quizCard}
                                >
                                    <p className={styles.error}>
                                        Quiz data is incomplete for this entry.
                                    </p>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={quizAttempt._id}
                                className={styles.quizCard}
                            >
                                <div className={styles.quizHeader}>
                                    <h3 className={styles.quizTitle}>
                                        {quizTitle}
                                    </h3>
                                    <p className={styles.quizDate}>
                                        Taken on:{" "}
                                        {new Date(
                                            quizAttempt.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                    <p
                                        className={`${styles.quizScore} ${scoreStyle}`}
                                    >
                                        Score: {quizAttempt.score}/
                                        {quizAttempt.totalQuestions} (
                                        {quizScorePercentage.toFixed(2)}%)
                                    </p>
                                    <p className={styles.stats}>
                                        Average:{" "}
                                        <span className={scoreStyle}>
                                            {stats.average?.toFixed(2) ?? "N/A"}
                                            %{" "}
                                        </span>{" "}
                                        | Median:{" "}
                                        {stats.median?.toFixed(2) ?? "N/A"}%{" "}
                                    </p>
                                    <p className={`${comparisonTextStyle}`}>
                                        {comparisonText}
                                    </p>
                                    <button
                                        onClick={() => toggleDetails(quizId)}
                                        className={styles.detailsButton}
                                    >
                                        {expandedQuizId === quizId
                                            ? "Hide Details"
                                            : "View Details"}
                                    </button>
                                </div>
                                {expandedQuizId === quizId && (
                                    <div className={styles.details}>
                                        <h4>Answers:</h4>
                                        <ul className={styles.answerList}>
                                            {quizAttempt.answers.map(
                                                (answer, index) => {
                                                    const question =
                                                        questions.find(
                                                            (q) =>
                                                                q._id ===
                                                                answer.questionId
                                                        );

                                                    return (
                                                        <li
                                                            key={index}
                                                            className={
                                                                answer.isCorrect
                                                                    ? styles.correctAnswer
                                                                    : styles.wrongAnswer
                                                            }
                                                        >
                                                            Question {index + 1}
                                                            :{" "}
                                                            {question?.text ||
                                                                "Unknown Question"}
                                                            <br />
                                                            Your Answer:{" "}
                                                            {question?.choices.find(
                                                                (c) =>
                                                                    c.id ===
                                                                    answer.answerId
                                                            )?.text ||
                                                                "Unknown"}
                                                            {answer.isCorrect ? (
                                                                <span
                                                                    className={
                                                                        styles.correctLabel
                                                                    }
                                                                >
                                                                    ✔ Correct
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    <span
                                                                        className={
                                                                            styles.incorrectLabel
                                                                        }
                                                                    >
                                                                        ✘
                                                                        Incorrect
                                                                    </span>
                                                                    <br />
                                                                    Correct
                                                                    Answer:{" "}
                                                                    {question?.choices.find(
                                                                        (c) =>
                                                                            c.id ===
                                                                            question.correctAnswer
                                                                    )?.text ||
                                                                        "Unknown"}
                                                                </>
                                                            )}
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <footer className={styles.end}>
                <div className={styles.divider}>.</div>
                <button
                    className={styles.enabled}
                    onClick={() => navigate("/welcome")}
                >
                    Close
                </button>
            </footer>
        </>
    );
};

export default History;
