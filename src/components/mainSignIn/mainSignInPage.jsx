import { useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext/index.jsx";
// import Google from "../../images/logos/google.svg.webp";
// import logo from "../../images/logos/heightsHousingVertical.jpg";

// Import the warning component
import InAppBrowserWarning from "./InAppBrowserWarning.jsx";

import css from "./mainSignInPage.module.css";

const MainSignInPage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isInAppBrowser, setIsInAppBrowser] = useState(false);


    useEffect(() => {
        if (currentUser) {
            console.log("✅ User detected, navigating away...");
            navigate("/"); // Redirect if already signed in
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        // Simple check to see if the user is using an in-app browser
        const userAgent = navigator.userAgent.toLowerCase();
        const inAppRegex = /instagram|fbav|facebook|line|snapchat|messenger|twitter|tiktok/i;
        setIsInAppBrowser(inAppRegex.test(userAgent));
    }, []);

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        try {
            await signInWithPopup(auth, provider);
            console.log("🎉 Sign-in successful, navigating...");
        } catch (error) {
            console.error("❌ Sign-in error:", error);
        }
    };

    return (
        <div className={css.signInPage}>
            <img className={css.logo} src="/images/logos/heightsHousingVertical.jpg" alt="Heights Housing Logo" />
            <h2 className={css.signInTitle}>Sign in with your Boston College email to continue</h2>
            
            {/* 1) Show the in-app browser warning if detected */}
            {isInAppBrowser && <InAppBrowserWarning />}

            {/* 2) Hide or disable the sign-in button if an in-app browser is detected */}
            {!isInAppBrowser && (
                <button onClick={handleGoogleSignIn} className={css.signInButton}>
                    <p className={css.googleText}>Sign in with</p> <img className={css.googleImg} src="/images/logos/google.svg.webp" alt="Google" />
                </button>
            )}
        </div>
    );
};

export default MainSignInPage;
