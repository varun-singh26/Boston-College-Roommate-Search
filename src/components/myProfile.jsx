import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext/index"
import { db } from "../config/firestore";
import {getDoc, doc} from "firebase/firestore";
import { doPasswordChange, doSendEmailVerifiction } from "../config/auth";
import SignOut from "./SignInSignUp/SignOut";
import css from "../styles/Profile/myProfile.module.css"




const MyProfile = () => {

    const { currentUser } = useAuth();
    const [ userRef, setUserRef ] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const [administeredPostings, setAdministeredPostings] = useState([]);
    const [bookmarkedPostings, setBookmarkedPostings] = useState([]);

    console.log(`Administered postings of ${currentUser.email}: `, administeredPostings);
    console.log(`Bookmarked postings of ${currentUser.email}: `, bookmarkedPostings);

    //When component first renders, set administeredPostings and bookmarkedPostings with corresponding information from  user's document
    useEffect(() => {

        const fetchPostingsFromIDs = async (IDs) => {
            try {
                //map each id to the corresponding posting reference
                const postingReferences = IDs.map((id) => doc(db, "postings", id))

                //Resolve all 'getDoc' calls concurrently (What does this mean?)
                //Wait till all promises are fulfilled (all references have their corresponding document fetched)
                const postingsDocs = await Promise.all(
                    postingReferences.map((reference) => getDoc(reference))
                );

                // Filter valid documents and map them to their data
                const postings = postingsDocs
                    .filter((docSnapShot) => docSnapShot.exists())
                    .map((docSnapShot) => docSnapShot.data());

                return postings; // Return array of data
            } catch (err) {
                console.error("Error fetching posting documents: ", err);
                return []; // Return an empty array on error
            }
        }

        const fetchAdministeredAndBookmarkedPostings = async () => {
            
            // This should always be the case
            if (currentUser) {
                //make reference to user's doc
                const userRef = doc(db, "users", currentUser.uid);
                setUserRef(userRef);
                //fetch user's doc
                try {
                    const userDoc = await getDoc(userRef);
                    const administeredIDs = userDoc.data()?.administeredPostings || []; //if doc exists, set administeredIDs to administeredPostings field of doc. Otherwise, set to an empty array.
                    //will this work as intended?
                    const bookmarkedIDs = userDoc.data()?.bookmarkedPostings || []

                    //for debuggiing
                    console.log("administered postings IDs: ", administeredIDs);
                    console.log("bookmarked postings IDs: ", bookmarkedIDs );

                    // Call fetchPostingsFromIDs for each set of IDs
                    const administeredData = await fetchPostingsFromIDs(administeredIDs);
                    const bookmarkedData = await fetchPostingsFromIDs(bookmarkedIDs);

                    // Update state with resolved data
                    setAdministeredPostings(administeredData);
                    setBookmarkedPostings(bookmarkedData);
                } catch (err) {
                    console.error("Error fetching user document: ", err);
                }
            }
        };

        fetchAdministeredAndBookmarkedPostings()
    }, [currentUser]); //Want document data refetched and administeredPostings and bookmarkedPostings vars updated everytime currentUser changes

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
        <div className={css.container}>
            {
                currentUser ? (
                    <>
                        <h2 className={css.title}>My Profile</h2>
                        <p>
                        Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now signed in
                        </p>
                        {!currentUser.emailVerified && (
                            <section className={css.emailVerification}>
                                <p>Your email, {currentUser.email} is not verified. Please verify it. </p>
                                <button onClick={handleSendVerification}> Send Verification Email</button>
                            </section>
                        )}
                        <section className={css.changePassword}>
                            <p>Need to change your password?</p>
                            <input 
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button onClick={handleChangePassword}>Change Password</button>
                        </section>
                        <SignOut />
                    </>
                ) : (
                    <SignOut />
                )
            }
            {message && <p className={css.message}>{message}</p>}
        </div>
    );
};

export default MyProfile;