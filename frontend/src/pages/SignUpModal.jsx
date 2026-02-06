import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import "../styles/SignUpModal.css";

function SignUpModal({ onClose, openModal }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const {
            firstName,
            lastName,
            email,
            confirmEmail,
            password,
            confirmPassword,
        } = formData;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmEmail ||
            !confirmPassword
        ) {
            setError("All fields are required.");
            return;
        }

        if (email !== confirmEmail) {
            setError("Emails do not match.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/register`,
                {
                    ...formData,
                    role: "quizTaker",
                }
            );

            if (response.status === 201) {
                const { token } = response.data;
                localStorage.setItem("token", token);
                navigate("/welcome");
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 409) {
                    setError("Email is already registered.");
                } else if (status === 400) {
                    setError(data.message || "Invalid input.");
                } else {
                    setError("Something went wrong. Please try again later.");
                }
            } else {
                setError(
                    "Unable to connect to the server. Please check your connection."
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

                <div className="modal-icon modal-icon-blue">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                </div>

                <h2 className="modal-title">Create Account</h2>
                <p className="modal-subtitle">Join QuizMaster and start learning today</p>

                {error && <p className="error-text">{error}</p>}

                <form className="sign-up-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="signup-first">First Name</label>
                            <input
                                id="signup-first"
                                type="text"
                                className="signUpInput"
                                name="firstName"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signup-last">Last Name</label>
                            <input
                                id="signup-last"
                                type="text"
                                className="signUpInput"
                                name="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="signup-email">Email</label>
                            <input
                                id="signup-email"
                                type="email"
                                className="signUpInput"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signup-confirm-email">Confirm Email</label>
                            <input
                                id="signup-confirm-email"
                                type="email"
                                className="signUpInput"
                                name="confirmEmail"
                                placeholder="Confirm email"
                                value={formData.confirmEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="signup-password">Password</label>
                            <input
                                id="signup-password"
                                type="password"
                                className="signUpInput"
                                name="password"
                                placeholder="Create password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signup-confirm-password">Confirm Password</label>
                            <input
                                id="signup-confirm-password"
                                type="password"
                                className="signUpInput"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="sign-up-button">
                        Create Account
                    </button>
                    <div className="modal-divider">or</div>
                    <p className="sign-in-text">
                        Already have an account?{" "}
                        <button
                            type="button"
                            className="link_button"
                            onClick={openModal}
                            aria-label="Open Sign In Modal"
                        >
                            Sign in
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUpModal;
