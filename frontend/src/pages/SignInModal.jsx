import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SignInModal.css";

function SignInModal({ onClose, openModal }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear error on submit

        // Basic validation before sending the request
        if (!email || !password) {
            setError("Please fill in both email and password.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );

            if (response.status === 200) {
                const { role, token } = response.data;

                // Save the token to localStorage
                localStorage.setItem("token", token);

                // Redirect based on user role
                if (role === "quizMaker") {
                    navigate("/welcome-admin"); // Redirect makers to admin welcome page
                } else if (role === "quizTaker") {
                    navigate("/welcome"); // Redirect takers to regular welcome page
                }
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;

                // Specific error handling for server responses
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
                >
                    &times;
                </button>
                <h2 className="modal-title">Sign in</h2>
                {error && <p className="error-text">{error}</p>}
                <form className="sign-up-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="email"
                                className="signUpInput"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError(null); // Clear error when typing
                                }}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="signUpInput"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(null); // Clear error when typing
                                }}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="sign-up-button">
                        Sign in
                    </button>
                    <p className="sign-in-text">
                        Don&apos;t have an account?{" "}
                        <button
                            onClick={openModal}
                            className="link-button"
                            aria-label="Open Sign In Modal"
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
