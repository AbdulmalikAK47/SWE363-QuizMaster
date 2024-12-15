import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import End from "../components/End";
import style from "../styles/Questions.module.css";
import axios from "axios";

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
            navigate("/"); // Redirect if not logged in
        } else {
            fetchQuestions(token);
        }
    }, [navigate, quizId]);

    const fetchQuestions = async (token) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/quizzes/${quizId}/questions`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuestions(response.data);
            setTitle(response.data[0]?.quizTitle || "Quiz"); // If title isn't fetched elsewhere
        } catch (error) {
            console.error("Error fetching questions:", error.response || error);
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

    const allQuestionsAnswered =
        Object.keys(selectedOptions).length === questions.length;

    const selectedAnswers = Object.keys(selectedOptions).map((questionId) => ({
        questionId,
        answerId: selectedOptions[questionId],
        isCorrect:
            questions.find((q) => q._id === questionId)?.correctAnswer ===
            selectedOptions[questionId],
    }));

    if (loading) {
        return <div className={style.loading}>Loading questions...</div>;
    }

    if (error) {
        return <div className={style.error}>{error}</div>;
    }

    return (
        <>
            <div className={style.question_main}>
                <div className={style.question_title}>{title}</div>
                {questions.map((question, index) => (
                    <section key={question._id} className={style.question}>
                        <div className={style.question_number}>
                            <p className={style.question_number_text}>
                                {`Question ${index + 1}`}
                            </p>
                            <p className={style.question_number_text}>
                                {`${index + 1}/${questions.length}`}
                            </p>
                        </div>
                        <div className={style.question_text}>
                            {question.text}
                        </div>
                        <div className={style.field}>
                            {question.choices.map((choice) => (
                                <button
                                    key={choice.id}
                                    type="button"
                                    className={`${style.field_choise} ${
                                        selectedOptions[question._id] ===
                                        choice.id
                                            ? style.selected
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleOptionChange(
                                            question._id,
                                            choice.id
                                        )
                                    }
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question._id}`}
                                        value={choice.id}
                                        id={`${question._id}-${choice.id}`}
                                        checked={
                                            selectedOptions[question._id] ===
                                            choice.id
                                        }
                                        onChange={() =>
                                            handleOptionChange(
                                                question._id,
                                                choice.id
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor={`${question._id}-${choice.id}`}
                                        className={style.field_choise_text}
                                    >
                                        {choice.text}
                                    </label>
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
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
