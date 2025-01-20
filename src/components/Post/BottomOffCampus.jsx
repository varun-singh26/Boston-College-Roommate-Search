import React, { useState } from 'react';
import css from "./styles/BottomPost.module.css";

const BottomOffCampus = ({ members, curNumSeek, address, totalGroupSize, id, listingLocation, onShowMoreClick }) => {

  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmarkClick = () => {
    //If posting not yet bookmarked
      //Check if user is logged in. If not prompt them to log in and add posting to user's saved postings
      //Change bookmarked to true to force a page rerender

    //If posting is bookmarked
      //Check if user is logged in. If not prompt them to log in and then remove posting from users saved postings
      //Change bookmarked to false to force a page rerender

      console.log(`Post with id, ${id}, was clicked`);

  };
  
  //TODO: Have bookmark-black.png render if the id of this post is in current user's saved postings. 
  //      Have bookmark-white.png render if not
  //      If user isn't logged in show bookmark-white.png

  return (
    <div className={css.bottom}>
      <div className={css.container}>
        Bookmark posting 
        <img className='bookmarkWhite' src='/assets/postings/bookmark-white.png' alt='whiteBookmark'/>
        <span>{totalGroupSize - curNumSeek} looking for {curNumSeek} more</span>
      </div>
      <div className={css.bottomIMGcontainer}>
        <div className={css.bottomIMG}>
          <img className="location" src="/assets/postings/location.png" alt="location" />
          <span>{address}</span>
        </div>
        <div className={css.bottomIMG}>
          <img className="bed" src="/assets/postings/bed.png" alt="bed" />
          <span>{totalGroupSize} People Total</span>
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