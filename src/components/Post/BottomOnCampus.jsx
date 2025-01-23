import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { db } from "../../config/firestore";
import { updateDoc, getDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import css from "./styles/BottomPost.module.css";

const BottomOnCampus = ({ members, curNumSeek, dorm, totalGroupSize, id, listingLocation, onShowMoreClick }) => {
  
  //destructure currentUser from AuthContext
  const { currentUser } = useAuth();

  //state for user document reference
  const [userRef, setUserRef] = useState(null);

  //Create state variables for this component
  const [bookmarked, setBookmarked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Set userRef and check initial bookmark state when component mounts or when currentUser changes
  useEffect(() => {
    const fetchUserRefAndBookmarkStatus = async () => {
      if (currentUser) {
        //update userRef
        const userRef = doc(db, "users", currentUser.uid);
        setUserRef(userRef);

        //Check if the post is already bookmarked
        try {
          const userDoc = await getDoc(userRef);
          const userBookmarks = userDoc.data()?.bookmarkedPostings || []; //How does this line work?
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

    console.log(`bookmark for post with id, ${id}, was clicked`);

    //clear previous error message, if any
    setErrorMessage("");

    //executes if a user is signed in
    if (currentUser) {
      try {
        if (!bookmarked) {
          // Add the post to the user's bookmarkedPostings array
          await updateDoc(userRef, {
            bookmarkedPostings: arrayUnion(id),
          });
          console.log("Added to bookmarkedPostings array of user", userRef);
        } else {
          // Remove the post from the user's bookmarkedPostings array
          await updateDoc(userRef, {
            bookmarkedPostings: arrayRemove(id)
          });
          console.log(`Removed posting with id ${id} from bookmarkedPostings of user`, userRef);
        }

        //Toggle bookmark state for UI
        setBookmarked(!bookmarked);
      } catch (err) {
        console.error("Error updating bookmarkedPostings field: ", err);
        setErrorMessage("Something went wrong. Please try again.");
      }
    } else {
      // Prompt user to sign in if not logged in
      setErrorMessage("You need to sign in to bookmark a post")
    }
  };
    
  
  //      Have bookmark-black.png render if the id of this post is in current user's saved postings. 
  //      Have bookmark-white.png render if not
  //      If user isn't logged in show bookmark-white.png
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