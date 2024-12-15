import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Learn.module.css";

const Learn = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>How to Use QuizMaster</h1>
            <div className={styles.content}>
                <section className={styles.section}>
                    <h2>1. Start a New Quiz</h2>
                    <p>
                        To begin, click on the{" "}
                        <strong>"Start a New Quiz"</strong> button on the
                        welcome page. You'll see a list of available quizzes.
                        Select a quiz to start answering questions!
                    </p>
                </section>
                <section className={styles.section}>
                    <h2>2. View Your Quiz History</h2>
                    <p>
                        Want to see how you've performed in the past? Click on
                        the <strong>"View Quiz History"</strong> button to view
                        detailed scores, question-wise feedback, and how you
                        compare to others.
                    </p>
                </section>
                <section className={styles.section}>
                    <h2>3. Take a Random Quiz</h2>
                    <p>
                        Feeling adventurous? Try the{" "}
                        <strong>"Take a Random Quiz"</strong> option to be
                        assigned a random quiz from our database. Test your
                        skills in various topics!
                    </p>
                </section>
                <section className={styles.section}>
                    <h2>4. Understand Your Stats</h2>
                    <p>
                        For every quiz, you'll be able to compare your
                        performance against the average and median scores of all
                        participants. Your results will be color-coded:
                    </p>
                    <ul>
                        <li className={styles.aboveAverage}>
                            Green: Above average
                        </li>
                        <li className={styles.onAverage}>Yellow: On average</li>
                        <li className={styles.belowAverage}>
                            Red: Below average
                        </li>
                    </ul>
                </section>
            </div>
            <button
                className={styles.backButton}
                onClick={() => navigate("/welcome")}
            >
                Back
            </button>
        </div>
    );
};

export default Learn;
