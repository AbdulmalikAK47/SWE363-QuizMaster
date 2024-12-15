import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Header.module.css";
import ContactUsModal from "../pages/ContactUsModal";
import SignInModal from "../pages/SignInModal";
import SignUpModal from "../pages/SignUpModal";

const Header = () => {
    const [showContactUsModal, setContactUsModal] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // Track active modal
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const openModal = (modalName) => {
        setActiveModal(modalName);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/");
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.logoContainer}>
                    <p
                        className={styles.logo}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/");
                        }}
                    >
                        QuizMaster
                    </p>
                </div>
                <nav className={styles.navMenu}>
                    <button
                        className={styles.navItem}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/");
                        }}
                    >
                        Home
                    </button>
                    <button
                        className={styles.navItem}
                        onClick={() => setContactUsModal(true)}
                    >
                        Contact Us
                    </button>
                    {isAuthenticated ? (
                        <button className={styles.authButton} onClick={logout}>
                            Logout
                        </button>
                    ) : (
                        <button
                            className={styles.authButton}
                            onClick={() => openModal("SignIn")}
                        >
                            Login
                        </button>
                    )}
                </nav>
            </header>

            {/* Modals */}
            {showContactUsModal && (
                <ContactUsModal onClose={() => setContactUsModal(false)} />
            )}
            {activeModal === "SignIn" && (
                <SignInModal
                    onClose={closeModal}
                    openModal={() => openModal("SignUp")} // Open SignUpModal
                />
            )}
            {activeModal === "SignUp" && (
                <SignUpModal
                    onClose={closeModal}
                    openModal={() => openModal("SignIn")} // Open SignInModal
                />
            )}
        </>
    );
};

export default Header;
