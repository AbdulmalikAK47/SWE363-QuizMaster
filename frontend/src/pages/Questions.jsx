import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import End from "../components/End";
import style from "../styles/Questions.module.css";
import axios from "axios";
import API_BASE_URL from "../config/api";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

const Questions = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        } else {
            fetchQuestions(token);
        }
    }, [navigate, quizId]);

    const fetchQuestions = async (token) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/quizzes/${quizId}/questions`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuestions(response.data);
            setTitle(response.data[0]?.quizTitle || "Quiz");
        } catch (error) {
            if (error.response) {
                setError(
                    error.response.data.message || "Failed to load questions."
                );
            } else {
                setError(
                    "Could not connect to the server. Please check your connection."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOptionChange = (questionId, choiceId) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [questionId]: choiceId,
        }));
    };

    const answeredCount = Object.keys(selectedOptions).length;
    const totalCount = questions.length;
    const allQuestionsAnswered = answeredCount === totalCount;
    const progressPercent = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

    const selectedAnswers = Object.keys(selectedOptions).map((questionId) => ({
        questionId,
        answerId: selectedOptions[questionId],
        isCorrect:
            questions.find((q) => q._id === questionId)?.correctAnswer ===
            selectedOptions[questionId],
    }));

    if (loading) {
        return (
            <div className={style.loadingScreen}>
                <div className={style.spinner} />
                <p>Loading questions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={style.errorScreen}>
                <div className={style.errorIcon}>!</div>
                <p>{error}</p>
                <button onClick={() => navigate("/welcome")} className={style.errorBtn}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className={style.progressBar}>
                <div
                    className={style.progressFill}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <div className={style.quizContainer}>
                <div className={style.quizHeader}>
                    <h1 className={style.quizTitle}>{title}</h1>
                    <span className={style.quizMeta}>
                        {answeredCount} of {totalCount} answered
                    </span>
                </div>

                <div className={style.questionsList}>
                    {questions.map((question, index) => {
                        const isAnswered = selectedOptions[question._id] !== undefined;
                        return (
                            <section
                                key={question._id}
                                className={`${style.questionCard} ${isAnswered ? style.questionCardAnswered : ""}`}
                            >
                                <div className={style.questionTop}>
                                    <span className={style.questionBadge}>
                                        {index + 1} / {totalCount}
                                    </span>
                                    {isAnswered && (
                                        <span className={style.answeredCheck}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </span>
                                    )}
                                </div>

                                <p className={style.questionText}>
                                    {question.text}
                                </p>

                                <div className={style.choicesGrid}>
                                    {question.choices.map((choice, ci) => {
                                        const isSelected = selectedOptions[question._id] === choice.id;
                                        return (
                                            <button
                                                key={choice.id}
                                                type="button"
                                                className={`${style.choiceBtn} ${isSelected ? style.choiceSelected : ""}`}
                                                onClick={() =>
                                                    handleOptionChange(question._id, choice.id)
                                                }
                                            >
                                                <span className={`${style.choiceLetter} ${isSelected ? style.choiceLetterSelected : ""}`}>
                                                    {LETTERS[ci]}
                                                </span>
                                                <span className={style.choiceText}>
                                                    {choice.text}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>

            <End
                allQuestionsAnswered={allQuestionsAnswered}
                quizId={quizId}
                selectedAnswers={selectedAnswers}
            />
        </>
    );
};

export default Questions;
