import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext/index";
import css from "./styles/SignUp.module.css"
import { doCreateUserWithEmailAndPassword } from "../../config/auth";


const SignUp = () => {

    //destructure AuthContext
    const { currentUser, setCurrentUser, userLoggedIn, setUserLoggedIn, loading, setLoading } = useAuth(); 

    //Print state of AuthContext vars for debugging
    console.log("AuthContext: ");
    console.log("current user: ", currentUser);
    console.log("user logged in?: ", userLoggedIn);
    console.log("loading: ", loading);


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isBCStudent, setIsBCStudent] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    console.log("error message: ", errorMessage);

    //used to navigate to a new path
    const navigate = useNavigate();

    const handleName = (value) => {
        setName(value);
    }
    const handleEmail = (value) => {
        setEmail(value);
    }

    const handlePassword = (value) => {
        setPassword(value);
    }
    const handleConfirmPassword = (value) => {
        setConfirmPassword(value);
    }

    const handlePhoneNumber = (value) => {
        setPhoneNumber(value)
    }

    const handleSubmit = async (e) => {
        
        //prevent traditional form action
        e.preventDefault();

        //Ensure that password and confirmPassword match
        //should have setLoading(true); here because the loading process
        //has begun, but that wouldn't work with our current logic.
        //Instead, we'll just set loading = true when the third if block is reached and
        //treat that as the start of the loading process
        if (password != confirmPassword) {
            setErrorMessage("Passwords do not match");
            setLoading(false); //reset loading state
            return;
        }

        //Ensure that user is a BC student
        //similar to previous if block, should have setLoading(true) here because the loading process
        //has begun, but that wouldn't work with our current logic.
        //Instead, we'll just set loading = true when the next if block is reached and
        //treat that as the start of the loading process
        if (!isBCStudent) {
            setErrorMessage("Must be a BC student to create an account with and use Boston College Roommate Search");
            setLoading(false); //reset loading state
            return;
        }

        if (!loading) {

            console.log("starting sign-up process");
            setLoading(true); //Start the signup process
            console.log("loading? :", true); //runs immediately, here so we can see the updated state in the console
            setErrorMessage(""); //clear previous error message, if any

            const result = await doCreateUserWithEmailAndPassword(email, password, name, phoneNumber); //Create new user

            if (result.error) { //Error occurred in doCreateUserWithEmailAndPassword func

                setErrorMessage(result.error);  // Update the state with the error message
                console.log("Error occurred during signup process.");
                console.log("current user: ", currentUser); //runs immediately
                console.log("user logged in? ", userLoggedIn); 
            } else {
                console.log("Sign up was successful!");

                //CurrentUser and userLoggedIn are set to the newly created user and true, respectively, via auth/index.jsx

                console.log("current user: ", result.user); //runs immediately, here so we can see the updated state in the console
                console.log("user logged in? ", true); //Here for same reason as above

                navigate("/myProfile"); //Redirect
            }

            setLoading(false); // Reset loading state regardless of if sign-up was successful or not
        }
    };

    //When a new user signs up send them an email confirmation?
    return (
        <section className={css["signup-container"]}>
            <div className="signupDiv">
                <h1>Sign Up</h1>
                {errorMessage && <p className={css.errorMessage}>{errorMessage}</p>}
                <form onSubmit={handleSubmit} action="" method="POST">
                    <input type="text" value={name} name="name" placeholder="Full Name" onChange={(e) => handleName(e.target.value)}  required />
                    <input type="email" value={email} name="email" placeholder="Email Address" onChange={(e) => handleEmail(e.target.value)} required />
                    {/*password needs to be atleast 6 characters for signup to work with firebase auth. TODO: implement a check for this*/}
                    <input type="password" value={password} name="password" placeholder="Password" onChange={(e) => handlePassword(e.target.value)} required />
                    <input type="password" value={confirmPassword} name="confirmPassword" placeholder="Confirm Password" onChange={(e) => handleConfirmPassword(e.target.value)} required />
                    {/*<input type="date" name="dob" placeholder="Date of Birth" required />*/}
                    <label>
                        {/*With check boxes, checked attribute is better to use than value attribute. OnChange attribute is better to use than onClick attribute */}
                        {/*With the current value for onChange, the function will only execute when the box is checked and NOT when the component first executes*/}
                        <input type="checkbox" checked={isBCStudent} name="isBCStudent" onChange={() => setIsBCStudent(!isBCStudent)} />
                            Are you a Boston College student?
                    </label>
                    <input type="tel" value={phoneNumber} name="phone" placeholder="Phone Number (Optional)" onChange={(e) => handlePhoneNumber(e.target.value)} />
                    <button type="submit">Sign Up</button>
                </form>
                <a href="/signIn">Already have an account? Sign In</a>
            </div>
      </section>
    )

};

export default SignUp;