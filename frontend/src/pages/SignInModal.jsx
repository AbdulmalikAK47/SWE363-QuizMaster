import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import "../styles/SignInModal.css";

function SignInModal({ onClose, openModal }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Please fill in both email and password.");
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/login`,
                { email, password }
            );

            if (response.status === 200) {
                const { role, token } = response.data;
                localStorage.setItem("token", token);

                if (role === "quizMaker") {
                    navigate("/welcome-admin");
                } else if (role === "quizTaker") {
                    navigate("/welcome");
                }
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 401) {
                    setError("Invalid email or password.");
                } else if (status === 400) {
                    setError(data.message || "Invalid input.");
                } else {
                    setError("Something went wrong. Please try again later.");
                }
            } else {
                setError(
                    "Unable to connect to the server. Please check your internet connection."
                );
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                    className="close-button"
                    onClick={() => {
                        onClose();
                        navigate("/");
                    }}
                    aria-label="Close"
                />

                <div className="modal-icon modal-icon-yellow">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                </div>

                <h2 className="modal-title">Welcome Back</h2>
                <p className="modal-subtitle">Sign in to continue your learning journey</p>

                {error && <p className="error-text">{error}</p>}

                <form className="sign-up-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="signin-email">Email</label>
                        <input
                            id="signin-email"
                            type="email"
                            className="signUpInput"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError(null);
                            }}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="signin-password">Password</label>
                        <input
                            id="signin-password"
                            type="password"
                            className="signUpInput"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(null);
                            }}
                            required
                        />
                    </div>
                    <button type="submit" className="sign-up-button">
                        Sign In
                    </button>
                    <div className="modal-divider">or</div>
                    <p className="sign-in-text">
                        Don&apos;t have an account?{" "}
                        <button
                            type="button"
                            onClick={openModal}
                            className="link-button"
                            aria-label="Open Sign Up Modal"
                        >
                            Sign up
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignInModal;
