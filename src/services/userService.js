import { db } from "../config/firestore";
import {doc, setDoc, getDoc} from "firebase/firestore";


export const createUserInFirestore = async (user) => {

    //destructure fields from user object
    const { uid, displayName, email, emailVerified, phoneNumber, photoURL } = user
    
    //Create a reference to the doc in the "users" collection whose doc ID is uid.
    //Will this work if the users collection hasn't been created yet?
    const userDocRef = doc(db, "users", uid);

    //Check if the document already exists
    const docSnapshot = await getDoc(userDocRef);

    //If it doesn't, set its fields with the corresponding fields from the new user
    //ie. add a new doc in the "users" collection for the new user 
    //bookmarkedPostings and administeredPostings are initially empty for the new user
    if (!docSnapshot.exists()) {

        try {
            await setDoc(userDocRef, {
                uid,
                displayName,
                email,
                emailVerified,
                phoneNumber,
                photoURL,
                bookmarkedPostings: [],
                administeredPostings: []
            });
            console.log("User signed up and added to Firestore:", user) //add message confirming new document was created
        } catch (error) {
            console.error("Error creating user in Firestore:", error);
        }
    }

};