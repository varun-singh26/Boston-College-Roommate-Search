import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../../config/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { setIndexConfiguration } from "firebase/firestore";



export const AuthContext = createContext();

//function to get this AuthContext
export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null); //Whenever a user logs in, we want current to be set to their information
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    
    //Print statements for debugging:
    console.log("current user: ", currentUser);
    console.log("user is logged in?: ", userLoggedIn);
    console.log("loading: ", loading);

                                                                      //This listener continously monitors the authentication status and is triggerred(login, logout,
                                                                      //when one of the following happens: 1. A user logs in. 2. A user logs out. 3. The authentication state 
                                                                      //is checked on app initialization.
    useEffect(() => {                                                 // When a user logs in, the listener updates the currentUser state with authenticated user's details and sets userLoggedIn to true. 
                                                                      //When a user logs out, initializeUser sets currentUser to null and userLoggedIn to false       
        const unsubscribe = onAuthStateChanged(auth, (user) => {      //onAuthStateChanged remains active as long as this component (AuthProvider) is mounted
        
        setLoading(true); //set loading to true, if not already, to indicate the signin or login process has begun
        console.log("loading: ", true); //renders immediately
        try {
            if (user) {
                //User is signed in
                console.log("User signed in:", user); //logs the user object
                setCurrentUser(user); //Update the state of CurrentUser
                setUserLoggedIn(true);
                console.log("userLoggedIn: ", true); //display the state of userLoggedIn in the console
            } else {
                //User is signed out
                console.log("No user signed in");
                setCurrentUser(null); //Update the state of CurrentUser
                setUserLoggedIn(false);
                console.log("current user: ", null); //runs immediately, here so we can see the updated state in the console
                console.log("userLoggedIn: ", false); //display the state of userLoggedIn in the console
                console.log("loading: ", true);
            }
        } catch (error) {
            console.error("Error handling authentication state change", error);
            //Optionally, set an error state from auth/index.js to display a message to the user,
            //rather than have SignIn, SignUp, SignOut each have their own error states
        } finally {
            setLoading(false); //Always stop loading when a user signs-in/up or signs out or when there's an error handling the authentication state change
            console.log("loading (new value): ", false) //executes immediately; Before the state update to loading can occur in the next render cycle
                                                        //here so we can see the updated state in the console
        }
    });
        return unsubscribe; //cleans up the listener once AuthProvider is UNMOUNTED from the tree (Why is this necessary?)

    }, []); //Empty dependency array (the useEffect only runs when the App first mounts) 
            //onAuthStateChanged calls initializeUser to check if a user is still logged in or not, in order
            //to update the react components that subscribe to the authContext (currentUser, userLoggedIn, loading)
            //such has NavBar, the homepage, etc.

    //expose the state variables so other components can read them and render components depending on their value
    const value = {
        currentUser, setCurrentUser,
        userLoggedIn, setUserLoggedIn,
        loading, setLoading
    };

    return (
        <AuthContext.Provider value = {value}>
            {!loading && children} {/* Renders children only after the authentication state has been resolved. ie !loading. I dont' know if this is necessary*/}
        </AuthContext.Provider>
    );

};

export default AuthProvider;