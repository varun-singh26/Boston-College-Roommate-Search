import { useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext/index.jsx";
import Swal from "sweetalert2";
// import Google from "../../images/logos/google.svg.webp";
// import logo from "../../images/logos/heightsHousingVertical.jpg";

// Import the warning component
import InAppBrowserWarning from "./InAppBrowserWarning.jsx";

import css from "./mainSignInPage.module.css";

const MainSignInPage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const isMobile = window.innerWidth < 2000;
    //const [isInAppBrowser, setIsInAppBrowser] = useState(false);
    //const [userAgent, setUserAgent] = useState("");

    function isInstagramOrLinkedIn() {
        const ua = navigator.userAgent;
        if (/Instagram/i.test(ua)) return "Instagram";
        if (/LinkedIn/i.test(ua)) return "LinkedIn";
        return false;
    }

    useEffect(() => {
        const checkBrowser = async () => {
            if (currentUser) {
                console.log("✅ User detected, navigating away...");
                navigate("/"); // Redirect if already signed in
                return;
            }

            const inAppBrowser = isInstagramOrLinkedIn();
            if (inAppBrowser) {
                Swal.fire({
                    title: `${inAppBrowser} In-App Browser Warning`,
                    text: `If using an in-app browser via ${inAppBrowser}, please open this page in your default external browser (Safari, Chrome, etc.). The sign-in function may not work otherwise.`,
                    icon: 'warning',
                    confirmButtonText: 'I understand'
                });
                return;
            }

            if (isMobile) {
                Swal.fire({
                    title: 'Mobile Warning',
                    text: 'This website is not optimized for mobile devices. Please use a desktop or laptop for the best experience.',
                    icon: 'warning',
                    confirmButtonText: 'I wish to continue anyway'
                });
            }
        };

        checkBrowser();
    }, [currentUser, navigate, isMobile]); // Ensure dependencies are included

    // Decided not to use this for now, but kept the code incase we want to in the future
    {/*useEffect(() => {
        // Simple check to see if the user is using an in-app browser
        const userAgent = navigator.userAgent.toLowerCase();
        console.log("User agent:", userAgent);
        setUserAgent(userAgent); // For debugging purposes
        alert(`User agent: ${userAgent}`);
        const inAppRegex = /instagram|fbav|facebook|line|snapchat|messenger|twitter|tiktok/i;
        setIsInAppBrowser(inAppRegex.test(userAgent));
    }, []); */}

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
            <img className={css.logo} src="/images/logos/heightsHousingVerticalTransparent.png" alt="Heights Housing Logo" />
            <h2 className={css.signInTitle}>Sign in with your Boston College email to continue</h2>

            {/* An easier and more efficient fix than detecting if the user is using an InAppBrowser. (They would have to nonetheless copy and paste the URL of heights housing into their browser*/}
            {/* <h3 className={css.signInTitle}> If using an In-App browser via a mobile device (Instagram, LinkedIn), click the three dots (ie. ...) in the upper right corner and select "Open in external browser". Then click "Sign in with Google"</h3> */}
            
            {/* 1) Show the in-app browser warning if detected, then Hide or disable the sign-in button if an in-app browser is detected (NOT USING THIS) */}
            {/*isInAppBrowser && <InAppBrowserWarning />*/}

            <button onClick={handleGoogleSignIn} className={css.signInButton}>
                <p className={css.googleText}>Sign in with</p> <img className={css.googleImg} src="/images/logos/google.svg.webp" alt="Google" />
            </button>
        </div>
    );
};

export default MainSignInPage;
