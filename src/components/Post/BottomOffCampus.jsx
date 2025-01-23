import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext/index';
import { db } from '../../config/firestore';
import {collection, updateDoc, getDoc, doc, arrayUnion, arrayRemove} from "firebase/firestore";
import css from "./styles/BottomPost.module.css";

const BottomOffCampus = ({ members, curNumSeek, address, totalGroupSize, id, listingLocation, onShowMoreClick }) => {

  //destructure currentUser, userLoggedIn from AuthContext
  const { currentUser, userLoggedIn } = useAuth();

  //state for user document reference
  const [userRef, setUserRef] = useState(null);

  //state for posting document reference
  //just for printing purposes
  const [postingRef, setPostingRef] = useState(doc(db, "postings", id)); //postingRef is initialized to be the doc reference for this particular post

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
          console.error("Error fetching user document: ", err);
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
            console.log("posting", postingRef);
            console.log("Added to bookmarkedPostings array of user", userRef);
          } else {
            // Remove the post from the user's bookmarkedPostings array
            await updateDoc(userRef, {
              bookmarkedPostings: arrayRemove(id)
            });
            console.log(`Removed posting with id ${id} from bookmarkedPostings of user`, userRef);
          }

          // Toggle bookmark state for UI
          setBookmarked(!bookmarked);
        } catch (err) {
          console.error("Error updating bookmarkedPostings field: ", err);
          setErrorMessage("Something went wrong. Please try again.");
        }
      } else {
        // Prompt user to sign in if not logged in
        setErrorMessage("You need to sign in to bookmark a post.");
      }
    };

  //      Have bookmark-black.png render if the id of this post is in current user's saved postings. 
  //      Have bookmark-white.png render if not
  //      If user isn't logged in show bookmark-white.png

  return (
    <div className={css.bottom}>
      <div className={css.container}>
        Bookmark
        {errorMessage && <p className={css.errorMessage}> {errorMessage} </p>}
        {/* The code below renders the white bookmark if a user isn't signed in. If a user is signed in, then the black bookmark will render if bookmarked is true 
        and the white on will render if not*/}
        <img
          onClick={handleBookmarkClick}
          className={bookmarked ? "bookmark" : "bookmarkWhite"}
          src={bookmarked ? "/assets/postings/bookmark.png" : "/assets/postings/bookmark-white.png"}
          alt={bookmarked ? "Bookmark" : "White Bookmark"}
        />
        {/*<img className='bookmarkWhite' src='/assets/postings/bookmark-white.png' alt='whiteBookmark'/>*/}
        <span>{totalGroupSize - curNumSeek} looking for {curNumSeek} more</span>
      </div>
      <div className={css.bottomIMGcontainer}>
        <div className={css.bottomIMG}>
          <img className="location" src="/assets/postings/location.png" alt="location" />
          <span>{address}</span>
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

export default BottomOffCampus;