import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext/index"
import SignOut from "./SignInSignUp/SignOut";




const MyProfile = () => {
    const { currentUser} = useAuth();
    return (
        <>
            {
                currentUser ? (
                    <>
                        <div>
                        Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in
                        </div> 
                        <SignOut />
                    </>
                ) : (
                    <SignOut />
                )
            }
        </>
    )
};

export default MyProfile;