import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext/index"
import { doPasswordChange, doSendEmailVerifiction } from "../config/auth";
import SignOut from "./SignInSignUp/SignOut";




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
        <>
            {
                currentUser ? (
                    <>
                        <h1>My Profile</h1>
                        <p>
                        Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now signed in
                        </p>
                        {!currentUser.emailVerified && (
                            <div>
                                <p>Your email, {currentUser.email} is not verified. Please verify it. </p>
                                <button onClick={handleSendVerification}> Send Verification Email</button>
                            </div>
                        )}
                        <div>
                            <h2>Change Password</h2>
                            <input 
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button onClick={handleChangePassword}>Change Password</button>
                        </div>
                        <SignOut />
                    </>
                ) : (
                    <SignOut />
                )
            }
            {message && <p>{message}</p>}
        </>
    );
};

export default MyProfile;