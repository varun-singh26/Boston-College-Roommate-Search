import React, { useState, useEffect, useContext } from 'react';
import { IsEditingPostContext } from './contexts/IsEditingPostContext';
import { useAuth } from '../../context/authContext';
import { db } from "../../config/firestore";
import { collection, updateDoc, deleteDoc, getDoc, getDocs, doc, arrayUnion, arrayRemove, writeBatch } from 'firebase/firestore';
import css from "./styles/BottomPost.module.css";

const BottomOnCampus = ({ members, curNumSeek, dorm, totalGroupSize, id, listingLocation, onShowMoreClick }) => {
  
  //destructure IsEditingPostContext
  //State to toggle editing mode of administered postings
  const { setIsEditingPost, setIDEditingPost, setIsDeletingPost,  setIsChangingBookmarkStatus } = useContext(IsEditingPostContext);

  //destructure currentUser from AuthContext
  const { currentUser } = useAuth();

  //state for user document reference
  const [userRefState, setUserRefState] = useState(null);
  //state for user doc
  const [userDocState, setUserDocState] = useState(null);

  //state for posting document reference (just for printing purposes)
  const [postingRef, setPostingRef] = useState(doc(db, "postings", id)); //postingRef is initialized to be the doc reference for this particular post

  //Create state variables for this component
  const [bookmarked, setBookmarked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userBookmarks, setUserBookmarks] = useState(null);
  const [userAdministered, setUserAdministered] = useState(null);


  // Set userRef and check initial bookmark state when component mounts or when currentUser changes
  useEffect(() => {
    const fetchUserRefAndBookmarkStatus = async () => {
      if (currentUser) {
        //update userRef
        const userRef = doc(db, "users", currentUser.uid);
        setUserRefState(userRef);
  
        //Check if the post is already bookmarked
        try {
          const userDoc = await getDoc(userRef);
          setUserDocState(userDoc); //update userDocState
  
          const userBookmarks = userDoc.data()?.bookmarkedPostings || []; //How does this line work?
          const userAdministered = userDoc.data()?.administeredPostings || [];
  
          //Update state variables for this component"
          setUserBookmarks(userBookmarks);
          setUserAdministered(userAdministered);
          setBookmarked(userBookmarks.includes(id));
        } catch (err) {
          console.error("Error fetching user document: ", err)
        }
      }
    };

    fetchUserRefAndBookmarkStatus()
  }, [currentUser, id]);


  
  //Handle bookmark toggle
  const handleBookmarkClick = async() => {

    setIsChangingBookmarkStatus(true); //Process of changing bookmark status has started

    console.log(`bookmark for post with id, ${id}, was clicked`);

    //clear previous error message, if any
    setErrorMessage("");

    //executes if a user is signed in
    if (currentUser) {
      try {
        if (!bookmarked) {
          // Add the post to the user's bookmarkedPostings array
          await updateDoc(userRefState, {
            bookmarkedPostings: arrayUnion(id),
          });
          console.log("posting", postingRef);
          console.log("Added to bookmarkedPostings array of user", userRefState);
        } else {
          // Remove the post from the user's bookmarkedPostings array
          await updateDoc(userRefState, {
            bookmarkedPostings: arrayRemove(id)
          });
          console.log(`Removed posting with id ${id} from bookmarkedPostings of user`, userRefState);
        }

        //Toggle bookmark state for UI
        setBookmarked(!bookmarked);
      } catch (err) {
        console.error("Error updating bookmarkedPostings field: ", err);
        setErrorMessage("Something went wrong. Please try again.");
      }
      finally {
        setIsChangingBookmarkStatus(false); //Process of changing bookmark status has ended
      }
    } else {
      // Prompt user to sign in if not logged in
      setErrorMessage("You need to sign in to bookmark a post")
    }
  };

  const handleModify = (id) => {
    //Render posting form Filled in with the data from this posting
    //If any changes are made, modify the corresponding document in firestore

    setIsEditingPost(true); //Toggle editing mode
    setIDEditingPost(id); //set ID of post being edited (for fetching purposes in PostingForm.jsx)
  };



  const handleDelete = async(id) => {

    setIsDeletingPost(true); //Deletion process has started

    console.log(`Attempting to delete post with ID: ${id}`);

    //Clear any previous error messages
    setErrorMessage("");

    //Confirm before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (!confirmDelete) return;

    if (!currentUser || !userRefState) {
      setErrorMessage("You must be signed in to delete a post."); //also returns if userRef is null
      return;
    }

    try {
      // Delete the post from Firestore
      await deleteDoc(doc(db, "postings", id));
      console.log(`Successfully deleted post with ID: ${id}`);

      try {
        // Remove the post ID from the current user's administered postings
        await updateDoc(userRefState, {                
          administeredPostings: arrayRemove(id)
        });
        console.log(`Removed post ID ${id} from the user's administered postings.`);
      } catch (updateError) {
        console.error("Error removing post ID from user's administered postings:", updateError);
        setErrorMessage("Post deleted, but an error occurred while updating the administered postings of your account.");
      }

      //Fetch all users to check if they bookmarked this post
      const usersRef = collection(db, "users"); //Gets a reference to the users collection in Firestore
      const usersSnapShot = await getDocs(usersRef); //Fetches all documents (users) in the users collection and stores them in 
                                                     //userSnapshot

      //Iterate through all users and remove the deleted post from their bookmarks (if it's there)
      const batch = writeBatch(db); //Create a batch operation to update multiple documents at once
                                    //Batches are used to perform multiple Firestore updates in a single transaction
      usersSnapShot.forEach((userDoc) => {
        const userData = userDoc.data();
        if(userData.bookmarkedPostings?.includes(id)) {
          const userRef = doc(db, "users", userDoc.id);
          batch.update(userRef, { //schedules an update for this user's document as part of the batch
            bookmarkedPostings: arrayRemove(id),
          });
          console.log(`Queued removal of post (id: ${id}) from user's (uid: ${userDoc.id}) bookmarks.`);
        }
      });
      // Commit all updates at once
      await batch.commit(); //Much faster and more efficient than calling updateDoc() multiple times
      console.log(`Successfully removed post (id: ${id}) from all affected users' bookmarkedPostings.`);

    } catch (deleteError) {
      console.error("Error deleting post:", deleteError);
      setErrorMessage("Failed to delete post. Please try again.");
    }
    finally {
      setIsDeletingPost(false); //Deletion process has ended
    }
  };

  

  return (
    <div className={css.bottom}>
      <div className={css.container}>
          Bookmark
          {errorMessage && <p className={css.errorMessage}>{errorMessage}</p>} 
          <img
            onClick={handleBookmarkClick}
            className={bookmarked ? "bookmark" : "bookmarkWhite"}
            src={bookmarked ? "/assets/postings/bookmark.png" : "/assets/postings/bookmark-white.png"}
            alt={bookmarked ? "Bookmark" : "White Bookmark"}
          />
        <span>{totalGroupSize - curNumSeek} looking for {curNumSeek} more</span>
      </div>
      <div className={css.bottomIMGcontainer}>
        <div className={css.bottomIMG}>
          <img className="location" src="/assets/postings/location.png" alt="location" />
          <span>{dorm}</span>
        </div>
        <div className={css.bottomIMG}>
          <img className="bed" src="/assets/postings/bed.png" alt="bed" />
          <span>{totalGroupSize}-man Housing</span>
        </div>
        {/*Only give option to modify or delete if currentUser is not null and this post is in currentUser's administered postings */}
          {/*Need three conditions to be satisfied in order for modify button to appear:
          1. User must be signed in
          2. userAdministered var of this component must not be null (initial state is null)
          3. userAdministered array must include the id of this posting (only the admin of a posting can modify it) */}
          {currentUser != null && userAdministered!=null && userAdministered.includes(id) && 
            <div className={css.bottomIMG}>
              <img 
                onClick={() => handleModify(id)}
                src="/assets/postings/modify.jpeg" 
                alt="clipboard"
              />
              <img
                onClick={() => handleDelete(id)}
                src="/assets/postings/trashBin.jpeg"
                alt="trashBin"
              />
            </div>
          }
      </div>
      <div className={`${css.showMore} offCampus`} id={id}>
        <a className={`showMoreLink ${listingLocation}`} onClick={() => onShowMoreClick(id)}>
          <span>SHOW MORE...</span>
        </a>
      </div>
    </div>
  );
};

export default BottomOnCampus;