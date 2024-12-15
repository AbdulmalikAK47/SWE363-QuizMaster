import React, { useEffect, useRef } from "react";
import "../styles/ContactUsModal.css";

function ContactUsModal({ onClose }) {
    const modalRef = useRef(null);

    useEffect(() => {
        modalRef.current.focus(); // Focus the modal on render

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose(); // Close modal on "Escape" key
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    return (
        <div
            className="modal-overlay"
            role="dialog"
            aria-labelledby="contact-us-title"
            aria-modal="true"
        >
            <div className="contact-us-modal" ref={modalRef} tabIndex={-1}>
                <h2 id="contact-us-title">Contact Us</h2>
                <p>Have questions or need support?</p>
                <p>Reach out to us:</p>
                <div className="contact-info">
                    <p>
                        <strong>Email:</strong>{" "}
                        <a href="mailto:support@quizmaster.com">
                            support@quizmaster.com
                        </a>
                    </p>
                    <p>
                        <strong>Phone:</strong> +966520123890
                    </p>
                </div>

                <button onClick={onClose} className="close-button-contact">
                    Close
                </button>
            </div>
        </div>
    );
}

export default ContactUsModal;
