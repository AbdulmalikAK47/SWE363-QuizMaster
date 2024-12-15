import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import styles from "../styles/Welcome.module.css";
import alertStyles from "../styles/Alert.module.css";

const WelcomeAdmin = () => {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = React.useState(false);

    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setShowAlert(true); // Show alert message
            setTimeout(() => {
                navigate("/"); // Redirect after 2 seconds
            }, 3000);
        }
    }, [navigate]);

    return (
        <div className={styles.pageContainer}>
            {/* Alert section: Always rendered */}
            {showAlert && (
                <div className={alertStyles.alert}>
                    You are not logged in. Redirecting to the home page...
                </div>
            )}

            <Header />
            <div className={styles.welcomeContainer}>
                <h1 className={styles.greeting}>Welcome, Admin!</h1>
                <p className={styles.message}>
                    Manage your quizzes and view their performance metrics.
                </p>

                <div className={styles.options}>
                    {/* Create a New Quiz */}
                    <button
                        className={styles.optionButton}
                        onClick={() => navigate("/create-quiz")}
                    >
                        ✏️ Create a New Quiz
                    </button>

                    {/* Modify an Existing Quiz */}
                    <button
                        className={styles.optionButton}
                        onClick={() => navigate("/modify-quiz")}
                    >
                        🛠 Modify an Existing Quiz
                    </button>

                    {/* Delete a Quiz */}
                    <button
                        className={styles.optionButton}
                        onClick={() => navigate("/delete-quiz")}
                    >
                        ❌ Delete a Quiz
                    </button>

                    {/* View Quiz Statistics */}
                    <button
                        className={styles.optionButton}
                        onClick={() => navigate("/quiz-status")}
                    >
                        📊 View Quiz Statistics
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeAdmin;
