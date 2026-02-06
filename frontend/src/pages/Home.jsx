import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import SignInModal from "./SignInModal.jsx";
import SignUpModal from "./SignUpModal.jsx";

function Home() {
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const openSignUpModal = () => {
        setShowSignUpModal(true);
        setShowSignInModal(false);
    };

    const closeSignUpModal = () => {
        setShowSignUpModal(false);
    };

    const openSignInModal = () => {
        setShowSignInModal(true);
        setShowSignUpModal(false);
    };

    const closeSignInModal = () => {
        setShowSignInModal(false);
    };

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate("/welcome");
        } else {
            openSignUpModal();
        }
    };

    return (
        <div className={styles.homeContainer}>
            <Header />

            <section className={styles.hero}>
                <div className={styles.heroGlow} />
                <div className={styles.heroContent}>
                    <span className={styles.badge}>Free & Open Platform</span>
                    <h1 className={styles.heroTitle}>
                        Master Any Subject,
                        <br />
                        <span className={styles.gradientText}>
                            One Quiz at a Time
                        </span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Create, share, and take quizzes on any topic. Track your
                        progress, challenge friends, and learn smarter — not
                        harder.
                    </p>
                    <div className={styles.heroCta}>
                        <button
                            onClick={handleGetStarted}
                            className={styles.primaryBtn}
                        >
                            Get Started Free
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => navigate("/quizzes")}
                            className={styles.secondaryBtn}
                        >
                            Explore Quizzes
                        </button>
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>10+</span>
                            <span className={styles.statLabel}>Quizzes</span>
                        </div>
                        <div className={styles.statDivider} />
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>50+</span>
                            <span className={styles.statLabel}>Questions</span>
                        </div>
                        <div className={styles.statDivider} />
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>5</span>
                            <span className={styles.statLabel}>Categories</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--primary-blue)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                        </div>
                        <h3 className={styles.featureTitle}>Create Quizzes</h3>
                        <p className={styles.featureDesc}>
                            Build custom quizzes with multiple question types.
                            Share them instantly with anyone.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div
                            className={`${styles.featureIcon} ${styles.featureIconYellow}`}
                        >
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--primary-yellow-dark)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </div>
                        <h3 className={styles.featureTitle}>Track Progress</h3>
                        <p className={styles.featureDesc}>
                            View your quiz history, scores, and performance
                            trends over time.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--primary-blue)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <h3 className={styles.featureTitle}>Compete & Learn</h3>
                        <p className={styles.featureDesc}>
                            Challenge yourself against others. Learning is
                            better when it's fun.
                        </p>
                    </div>
                </div>
            </section>

            {showSignUpModal && (
                <SignUpModal
                    onClose={closeSignUpModal}
                    openModal={openSignInModal}
                />
            )}
            {showSignInModal && (
                <SignInModal
                    onClose={closeSignInModal}
                    openModal={openSignUpModal}
                />
            )}
        </div>
    );
}

export default Home;
