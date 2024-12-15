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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/"); // Redirect to home if not authenticated
        } else {
            fetchHistory(token);
        }
    }, [navigate]);

    const fetchHistory = async (token) => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/grades/history",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const fetchedHistory = response.data.reverse(); // Reverse the order of history
            setHistory(fetchedHistory);
            calculateGlobalStats(fetchedHistory, token);
        } catch (err) {
            console.error("Failed to fetch history:", err);
            setError("Failed to load history. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const calculateGlobalStats = async (history, token) => {
        const stats = {};
        for (const quiz of history) {
            const quizId = quiz.quiz?._id; // Use optional chaining to safely access _id

            if (!quizId) {
                console.warn(`Quiz ID is missing for history item:`, quiz);
                continue; // Skip this iteration if quizId is missing
            }

            try {
                const response = await axios.get(
                    `http://localhost:5000/api/grades/quiz-stats/${quizId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                stats[quizId] = response.data;
                console.log(stats[quizId]);
            } catch (error) {
                console.error(
                    `Failed to fetch stats for quiz ${quizId}:`,
                    error
                );
            }
        }
        setQuizStats(stats); // Ensure stats are updated after the loop
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

        // Fetch questions only if not already fetched
        if (!questionsMap[quizId]) {
            await fetchQuestionsForQuiz(quizId, token);
        }

        // Toggle expandedQuizId for the clicked quiz
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
                    {history.map((quiz) => {
                        const quizId = quiz.quiz._id;
                        const quizTitle = quiz.quiz.title;
                        const stats = quizStats[quizId] || {
                            average: 0,
                            median: 0,
                        };
                        const questions = questionsMap[quizId] || [];
                        const quizScore = quiz.score / quiz.totalQuestions;
                        const quizScorePercentage =
                            (quiz.score / quiz.totalQuestions) * 100;

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

                        return (
                            <div key={quiz._id} className={styles.quizCard}>
                                <div className={styles.quizHeader}>
                                    <h3 className={styles.quizTitle}>
                                        {quizTitle}
                                    </h3>
                                    <p className={styles.quizDate}>
                                        Taken on:{" "}
                                        {new Date(
                                            quiz.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                    <p
                                        className={`${styles.quizScore} ${scoreStyle}`}
                                    >
                                        Score: {quiz.score}/
                                        {quiz.totalQuestions} (
                                        {(quizScore * 100).toFixed(2)}%)
                                    </p>
                                    <p className={styles.stats}>
                                        Average:{" "}
                                        <span className={scoreStyle}>
                                            {stats.average?.toFixed(2)}%{" "}
                                            {/* Directly use average */}
                                        </span>{" "}
                                        | Median: {stats.median?.toFixed(2)}%{" "}
                                        {/* Directly use median */}
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
                                            {quiz.answers.map(
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
