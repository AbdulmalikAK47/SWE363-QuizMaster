import style from "../styles/End-style.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const End = ({ allQuestionsAnswered, quizId, selectedAnswers }) => {
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!allQuestionsAnswered) return;
        console.log("PASS");
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You are not logged in.");
                navigate("/login");
                return;
            }
            const totalQuestions = selectedAnswers.length;
            const score = selectedAnswers.filter(
                (answer) => answer.isCorrect
            ).length;

            console.log("Selected Answers:", selectedAnswers);
            console.log("Selected Answers Length:", selectedAnswers.length);
            console.log(
                "Correct Answers Count:",
                selectedAnswers.filter((answer) => answer.isCorrect).length
            );

            await axios.post(
                `http://localhost:5000/api/quizzes/${quizId}/grade`,
                {
                    score,
                    totalQuestions,
                    answers: selectedAnswers,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            navigate("/history");
        } catch (error) {
            console.error("Failed to submit grades:", error);
            alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <footer className={style.end}>
            <div className={style.divider}>.</div>
            <button
                className={
                    allQuestionsAnswered ? style.enabled : style.disabled
                }
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
            >
                Submit Quiz
            </button>
        </footer>
    );
};

export default End;
