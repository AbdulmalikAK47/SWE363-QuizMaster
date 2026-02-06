import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import styles from "../styles/WelcomeAdmin.module.css";
import alertStyles from "../styles/Alert.module.css";

const WelcomeAdmin = () => {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = React.useState(false);

    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setShowAlert(true);
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
    }, [navigate]);

    return (
        <div className={styles.pageContainer}>
            {showAlert && (
                <div className={alertStyles.alert}>
                    You are not logged in. Redirecting to the home page...
                </div>
            )}

            <Header />

            <section className={styles.hero}>
                <div className={styles.heroGlow} />
                <div className={styles.heroContent}>
                    <h1 className={styles.greeting}>
                        Admin <span className={styles.gradientName}>Dashboard</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Manage your quizzes and view performance metrics.
                    </p>
                </div>
            </section>

            <section className={styles.actions}>
                <div className={styles.actionsGrid}>
                    <button className={styles.actionCard} onClick={() => navigate("/create-quiz")}>
                        <div className={styles.actionIcon}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </div>
                        <div className={styles.actionText}>
                            <h3 className={styles.actionTitle}>Create a New Quiz</h3>
                            <p className={styles.actionDesc}>Build a quiz with custom questions and choices</p>
                        </div>
                        <svg className={styles.actionArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>

                    <button className={styles.actionCard} onClick={() => navigate("/modify-quiz")}>
                        <div className={`${styles.actionIcon} ${styles.actionIconYellow}`}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary-yellow-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                        </div>
                        <div className={styles.actionText}>
                            <h3 className={styles.actionTitle}>Modify an Existing Quiz</h3>
                            <p className={styles.actionDesc}>Edit quiz details, add or remove questions</p>
                        </div>
                        <svg className={styles.actionArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>

                    <button className={styles.actionCard} onClick={() => navigate("/delete-quiz")}>
                        <div className={`${styles.actionIcon} ${styles.actionIconRed}`}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </div>
                        <div className={styles.actionText}>
                            <h3 className={styles.actionTitle}>Delete a Quiz</h3>
                            <p className={styles.actionDesc}>Permanently remove a quiz and its questions</p>
                        </div>
                        <svg className={styles.actionArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>

                    <button className={styles.actionCard} onClick={() => navigate("/quiz-status")}>
                        <div className={styles.actionIcon}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </div>
                        <div className={styles.actionText}>
                            <h3 className={styles.actionTitle}>View Quiz Statistics</h3>
                            <p className={styles.actionDesc}>See averages, medians, and participation data</p>
                        </div>
                        <svg className={styles.actionArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </section>
        </div>
    );
};

export default WelcomeAdmin;
