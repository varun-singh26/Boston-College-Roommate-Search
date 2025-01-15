import { auth } from "./firestore"; //Realizing now that this file should be name ./firebase (Change this in the future)
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, updatePassword, sendEmailVerification } from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password, name, phoneNumber) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        //set additional fields of userCredential.user object
        userCredential.user.displayName = name;
        userCredential.user.phoneNumber = phoneNumber;

        return { user: userCredential.user, error: null};
    } catch (error) {
        return { user: null, error: error.message}
    }
};

export const doSignInWithEmailAndPassword = async (email, password) => {

    //must return the same type of object regardless of success or error
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
                                                          //If function succeeds (ie. user is not null) then /myProfile
                                                          //page is navigated to via SignIn.jsx

        return { user: userCredential.user, error: null}; //user contains details about the signed in 
                                                          //user, ie uid, email, displayName, phone number
    } catch (error) {
        return { user: null, error: error.message}; //error.message contains a description of the error that was thrown

    }
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    //Can also save the users authentication information to cloud firestore
    //using result.user
    return result;
};

export const doSignOut = async () => {
    try {
        await auth.signOut(); //Sign out the user
        return {error: null}; //Return no error if successful
    } catch (error) {
        return {error: error.message} //Return the error message if signout not successful
    }
};

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
};

//What does this function do?
export const doSendEmailVerifiction = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};




