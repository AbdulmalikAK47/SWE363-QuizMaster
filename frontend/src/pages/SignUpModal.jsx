import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
        setError(null); // Clear error on user input
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

        // Validation checks
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
            // Default role to 'quizTaker'
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    ...formData,
                    role: "quizTaker", // Automatically set role to 'quizTaker'
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
            <div className="modal-content">
                <button
                    className="close-button"
                    onClick={() => {
                        onClose();
                        navigate("/");
                    }}
                >
                    &times;
                </button>
                <h2 className="modal-title">Sign Up</h2>
                {error && <p className="error-text">{error}</p>}
                <form className="sign-up-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                className="signUpInput"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="signUpInput"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="email"
                                className="signUpInput"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                className="signUpInput"
                                name="confirmEmail"
                                placeholder="Confirm Email"
                                value={formData.confirmEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="password"
                                className="signUpInput"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="signUpInput"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="sign-up-button">
                        Sign up
                    </button>
                    <p className="sign-in-text">
                        Already have an account?{" "}
                        <button
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
