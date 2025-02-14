import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext/index"
import { IsEditingPostContext } from "./Post/contexts/IsEditingPostContext";
import { db } from "../config/firestore";
import {getDoc, doc} from "firebase/firestore";
import { doPasswordChange, doSendEmailVerifiction } from "../config/auth";
import PostingForm from "./Homepage/PostingForm";
import OnCampusPost from "./Post/OnCampusPost";
import OffCampusPost from "./Post/OffCampusPost";
import SignOut from "./SignInSignUp/SignOut";
import css from "../styles/Profile/myProfile.module.css"




const MyProfile = () => {

    const { currentUser } = useAuth();
    const [ userRef, setUserRef ] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const [administeredPostings, setAdministeredPostings] = useState([]);
    const {isEditingPost, IDEditingPost, isDeletingPost,  isChangingBookmarkStatus} = useContext(IsEditingPostContext); //Destructure from IsEditingPostContext

    const [bookmarkedPostings, setBookmarkedPostings] = useState([]);
    const [postsToShow, setPostsToShow] = useState(2); // State to control number of posts shown
    const navigate = useNavigate();

    //optionals just in case currentUser is null (although it shouldn't be null if user is on this page)
    console.log(`Administered postings of ${currentUser?.email}: `, administeredPostings);
    console.log(`Bookmarked postings of ${currentUser?.email}: `, bookmarkedPostings);
    console.log("Value of isEditingPost:", isEditingPost);
    console.log("ID of posting being edited:", IDEditingPost ?? "");

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
                    .filter((docSnapShot) => docSnapShot.exists()) // Filter valid documents
                    .map((docSnapShot) => ({
                        id: docSnapShot.id, //Add the document's ID
                        ...docSnapShot.data() // Spread the document's data
                    }));

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
    }, [currentUser, isEditingPost, isDeletingPost, isChangingBookmarkStatus]); //Want document data refetched and administeredPostings and bookmarkedPostings vars updated everytime currentUser changes,
                       //anytime isEditingPost changes from true to false (a post has been modified), anytime isDeletingPost changes from T to F (a post has been deleted),
                       //or anytime isChangingBookmarkStatus changes from T to F (a bookmark has been added or removed)


    const handleSendVerification = async () => {
        try {
            await doSendEmailVerifiction();
            setMessage("Verification email sent.");
        } catch (err) {
            setMessage("Failed to send verification email. Please try again.");
            console.error(err);
        }
    };

    // Handler for "Show More"
    const handleShowMore = (id) => {
        navigate(`/detailView?id=${id}`);
    };

    const handleShowMorePosts = () => {
        setPostsToShow(prevPostsToShow => prevPostsToShow + 2); // Show 2 more posts
    };



    return (
        <div className={css.container}>
            {
                currentUser ? (
                    <>
                        <h1 className={css.title}> My Profile</h1>
                        <p>
                        Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are signed in.
                        </p>
                        <div className={css.postingsContainer}>
                            {isEditingPost ? <PostingForm id = {IDEditingPost} /> :
                                <>
                                    <section className={css.administered}>
                                        <h2>Your administered postings:</h2>
                                        <div className={css.postings}>
                                            {administeredPostings.slice(0, postsToShow).map((post) => (
                                                <div key={post.id}>
                                                    {post.listingLocation === "oncampus" ? (
                                                        <OnCampusPost post={post} onShowMoreClick={handleShowMore}/>
                                                    ) : (
                                                        <OffCampusPost post={post} onShowMoreClick={handleShowMore}/>
                                                    )}
                                                </div>
                                            ))}
                                            {postsToShow < administeredPostings.length && (
                                                <button className={css.showMore} onClick={handleShowMorePosts}>
                                                    SHOW MORE POSTINGS...
                                                </button>
                                            )}
                                        </div>
                                    </section>
                                    <section className={css.bookmarked}>
                                        <h2>Your bookmarked postings:</h2>
                                        <div className={css.postings}>
                                            {bookmarkedPostings.slice(0, postsToShow).map((post) => (
                                                <div key={post.id}>
                                                    {post.listingLocation === "oncampus" ? (
                                                        <OnCampusPost post={post} onShowMoreClick={handleShowMore} />
                                                    ) : (
                                                        <OffCampusPost post={post} onShowMoreClick={handleShowMore} />
                                                    )}
                                                </div>
                                            ))}
                                            {postsToShow < bookmarkedPostings.length && (
                                                <button className={css.showMore} onClick={handleShowMorePosts}>
                                                    SHOW MORE POSTINGS...
                                                </button>
                                            )}
                                        </div>
                                    </section>
                                </>
                            }
                        </div>
                        {!currentUser.emailVerified && (
                            <section className={css.emailVerification}>
                                <p>Your email, {currentUser.email} is not verified. Please verify it. </p>
                                <button onClick={handleSendVerification}> Send Verification Email</button>
                            </section>
                        )}
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