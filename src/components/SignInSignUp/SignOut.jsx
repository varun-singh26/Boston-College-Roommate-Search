import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext/index";
import { doSignOut } from "../../config/auth";


const SignOut = () => {

    const DEBUG_MODE = true;

    //destructure AuthContext
    const { currentUser, setCurrentUser, userLoggedIn, setUserLoggedIn, loading, setLoading } = useAuth();

    if (DEBUG_MODE) {
        console.log("AuthContext: ");
        console.log("current user: ", currentUser);
        console.log("user logged in?: ", userLoggedIn);
        console.log("loading: ", loading);
    }

    const [errorMessage, setErrorMessage] = useState("");

     //used to navigate to a new path
    const navigate = useNavigate();

    const handleSignOut = async (e) => {

        console.log("starting sign-out process");
        setLoading(true); //Start the signout process
        console.log("loading? :", true); //runs immediately, here so we can see the updated state in the console
        setErrorMessage(""); //Clear previous error message, if any

        try {
            const result = await doSignOut(); //Execute sign out
            if (result.error) { //Error occurred in doSignOut func and sign out didn't occur
                setErrorMessage(result.error);
                console.log("Error occurred during signout process.")
                console.log("current user: ", currentUser); //runs immediately
                console.log("user logged in? : ", userLoggedIn);
    
            } else {
                console.log("Sign out was successful!");

                //CurrentUser and userLoggedIn are reset to null and false via auth/index.jsx

                console.log("current user: ", null); //runs immediately, here so we can see the updated state in the console
                console.log("user logger in: ", false); //Here for same reason as above
    
                navigate("/"); //Redirect 
            }
        } catch (error) { //Safety net for unexpected errors that occur separate from auth.signOut()
            setErrorMessage("An unexpected error occurred during sign-out process.");
        } finally {
            setLoading(false); //Reset loading state regardless of if sign-out was successful or not
        }
    };

    return (
        <>
        {errorMessage && <p className="error-message"> {errorMessage} </p>}
        <button onClick={handleSignOut} disabled={loading}>
            {loading ? "Signing Out..." : "Sign Out"}
        </button>
        </>
    )
};

export default SignOut;