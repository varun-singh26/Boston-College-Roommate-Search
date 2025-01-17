import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../../config/auth";
import { useAuth } from "../../context/authContext/index";
import css from "./styles/SignIn.module.css"

const SignIn = () => {

  //destructure AuthContext
  const { currentUser, setCurrentUser, userLoggedIn, setUserLoggedIn, loading, setLoading } = useAuth();

  //Print state of AuthContext vars for debugging
  console.log("AuthContext: ");
  console.log("current user: ", currentUser);
  console.log("user logged in?: ", userLoggedIn);
  console.log("loading: ", loading);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState(''); 
  console.log("error message: ", errorMessage);

  //used to navigate to a new path
  const navigate = useNavigate();
  
  const handleEmail = (value) => {
    setEmail(value);
  }

  const handlePassword = (value) => {
    setPassword(value);
  }

  const handleSubmit = async (e) => {
    
    //prevent traditional form action
    e.preventDefault();

    if (!loading) {

      console.log("Starting the sign in process:");
      setLoading(true); //Start the sign-in process
      console.log("loading? :", true); //runs immediately, here so we can see the updated state in the console
      setErrorMessage(""); //clear previous error message, if any

      const result = await doSignInWithEmailAndPassword(email, password); //Sign in exising user

      if (result.error) { //Error occurred in doSignInWithEmailAndPassword, possibly due to entering invalid account info
        
        setErrorMessage(result.error); // Update the state with the error message
        console.log("Error occurred during signin process.");
        console.log("current user: ", currentUser); //runs immediately
        console.log("user logged in? ", userLoggedIn);

      } else {
        console.log("Sign in was successful!");

        //CurrentUser and userLoggedIn are set to the logged in user and true, respectively via auth/index.jsx
   
        console.log("current user: ", result.user); //runs immediately, here so we can see the updated state in the console
        console.log("user logged in? ", true); //Here for same reason as above

        navigate("/myProfile"); // Redirect
      }
      
      setLoading(false); // Reset loading state regardless of if sign-in was successful or not
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault()
    if(!loading) {
      setLoading(true);
      try {
        const result = await doSignInWithGoogle();
  
        if (result) { //What type of object is result?
          console.log("Google Sign-In successful:", result.user);
          //CurrentUser and userLoggedIn are set to the logged in user and true, respectively via auth/index.jsx
          //setCurrentUser(result.user);
          //setUserLoggedIn(true);
          console.log("current user: ", result.user); //runs immediately, here so we can see the updated state in the console
          console.log("user logged in? ", true); //Here for same reason as above
          
          navigate("/myProfile");
        }
      } catch (err) {  //could be an error with users signing in w Google popup. If so, we need to catch this error.
        console.error("Google Sign-In error:", err);
        setErrorMessage("Failed to sign in with Google. Please try again.");
      } finally {
        setLoading(false); // Reset loading state regardless of if Google sign-in was successful or not
      }
    }
  };

  //Upon successfult sign-in set userLoggedIn from AuthContext to true and set url path to /myProfile
  //This file should render the profile page if userLoggedIn is true

  return (
    <section className={css["signin-container"]}>
      <div className="signinDiv">
        <h1>Sign In</h1>
        {errorMessage && <p className={css.errorMessage}>{errorMessage}</p>}
        <form onSubmit={handleSubmit} action="" method="POST">
          <input type="email" value={email} name="email" placeholder="Email Address" onChange={(e) => handleEmail(e.target.value)} required />
          <input type="password" value={password} name="password" placeholder="Password" onChange={(e) => handlePassword(e.target.value)} required />
          <button type="submit">Sign In</button>
          Or
          <button onClick={onGoogleSignIn}>Sign In with Google</button>
        </form>
        <a href="/signUp">Don't have an account? Sign Up</a>
        <a href="/forgot-password">Forgot your password?</a>
      </div>
    </section>
  )
};
export default SignIn