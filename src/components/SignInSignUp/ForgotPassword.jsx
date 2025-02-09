import React, { useState } from "react";
import { doPasswordReset } from "../../config/auth";
import css from "./styles/Form.module.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handlePasswordReset = async () => {
        try {
            await doPasswordReset(email);
            setMessage("Password reset email sent. Please check your inbox.");
        } catch (err) {
            setMessage("Failed to send password reset email. Please try again.");
            console.error(err);
        }
    };


    return (
        <div className = {css.formHolder}>
            <h1> Reset Password</h1>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handlePasswordReset}> Send Reset Email</button>
            {message && <p>{message}</p>}
        </div>
    );
};


export default ForgotPassword