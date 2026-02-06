import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import "../styles/SignUpModal.css";

function SignUpModalAdmin({ onClose }) {
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

        const adminData = {
            firstName,
            lastName,
            email,
            password,
            role: "quizMaker",
        };

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/register`,
                adminData
            );

            if (response.status === 201) {
                const { token } = response.data;
                localStorage.setItem("token", token);
                navigate("/welcome-admin");
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
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>

                <h2 className="modal-title">Admin Sign Up</h2>
                <p className="modal-subtitle">Create an administrator account</p>

                {error && <p className="error-text">{error}</p>}

                <form className="sign-up-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="admin-first">First Name</label>
                            <input
                                id="admin-first"
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
                            <label htmlFor="admin-last">Last Name</label>
                            <input
                                id="admin-last"
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
                            <label htmlFor="admin-email">Email</label>
                            <input
                                id="admin-email"
                                type="email"
                                className="signUpInput"
                                name="email"
                                placeholder="admin@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="admin-confirm-email">Confirm Email</label>
                            <input
                                id="admin-confirm-email"
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
                            <label htmlFor="admin-password">Password</label>
                            <input
                                id="admin-password"
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
                            <label htmlFor="admin-confirm-password">Confirm Password</label>
                            <input
                                id="admin-confirm-password"
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
                        Create Admin Account
                    </button>
                </form>
            </div>
        </div>
    );
}

function ProtectedSignUpModalAdmin() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState(null);
    const ADMIN_PASSWORD = "SecureAdmin123";

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordInput === ADMIN_PASSWORD) {
            setIsAuthorized(true);
        } else {
            setError("Incorrect password. Access denied.");
            setPasswordInput("");
        }
    };

    return (
        <div className="modal-overlay">
            {!isAuthorized ? (
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-icon modal-icon-yellow">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>

                    <h2 className="modal-title">Admin Access</h2>
                    <p className="protect-description">
                        This page is restricted. Enter the admin password to continue.
                    </p>

                    {error && <p className="error-text">{error}</p>}

                    <form className="protect-form" onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                            <label htmlFor="admin-access-pw">Password</label>
                            <input
                                id="admin-access-pw"
                                type="password"
                                className="signUpInput"
                                placeholder="Enter admin password"
                                value={passwordInput}
                                onChange={(e) => {
                                    setPasswordInput(e.target.value);
                                    setError(null);
                                }}
                                required
                            />
                        </div>
                        <button type="submit" className="sign-up-button">
                            Unlock
                        </button>
                    </form>
                </div>
            ) : (
                <SignUpModalAdmin onClose={() => setIsAuthorized(false)} />
            )}
        </div>
    );
}

export default ProtectedSignUpModalAdmin;
