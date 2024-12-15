import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import SignInModal from "./SignInModal.jsx";
import SignUpModal from "./SignUpModal.jsx";
import img1 from "../../public/smiling-student.png";

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

    return (
        <div className={styles.homeContainer}>
            <Header />

            <div className={styles.heroSection}>
                <div className={styles.heroTextContainer}>
                    <h1 className={styles.heroTitle}>Test Your Knowledge</h1>
                    <h2 className={styles.heroSubtitle}>
                        - Anytime, Anywhere -
                    </h2>
                    <button
                        onClick={
                            isAuthenticated
                                ? () => navigate("/welcome") // Redirect to a dashboard or main page
                                : openSignUpModal // Open sign-up modal for unauthenticated users
                        }
                        className={styles.getStartedButton}
                    >
                        Get Started
                    </button>
                </div>
                <div className={styles.heroImageContainer}>
                    <img
                        src={img1}
                        alt="Smiling Student"
                        className={styles.heroImage}
                    />
                </div>
            </div>
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
