import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext/index"
import { doPasswordChange, doSendEmailVerifiction } from "../config/auth";
import SignOut from "./SignInSignUp/SignOut";
import css from "../styles/Profile/myProfile.module.css"




const MyProfile = () => {

    const { currentUser } = useAuth();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleChangePassword = async () => {
        try {
            await doPasswordChange(newPassword);
            setMessage("Password changed successfully.");
        } catch (err) {
            setMessage("Failed to change password. Please try again.");
            console.error(err);
        }
    };

    const handleSendVerification = async () => {
        try {
            await doSendEmailVerifiction();
            setMessage("Verification email sent.");
        } catch (err) {
            setMessage("Failed to send verification email. Please try again.");
            console.error(err);
        }
    };



    return (
        <div className={css.container}>
            {
                currentUser ? (
                    <>
                        <h2 className={css.title}>My Profile</h2>
                        <p>
                        Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now signed in
                        </p>
                        {!currentUser.emailVerified && (
                            <section className={css.emailVerification}>
                                <p>Your email, {currentUser.email} is not verified. Please verify it. </p>
                                <button onClick={handleSendVerification}> Send Verification Email</button>
                            </section>
                        )}
                        <section className={css.changePassword}>
                            <p>Need to change your password?</p>
                            <input 
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button onClick={handleChangePassword}>Change Password</button>
                        </section>
                        <SignOut />
                    </>
                ) : (
                    <SignOut />
                )
            }
            {message && <p className={css.message}>{message}</p>}
        </div>
    );
};

export default MyProfile;