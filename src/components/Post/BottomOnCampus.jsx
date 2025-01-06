import React from 'react';
import css from "./styles/BottomPost.module.css"

const BottomOnCampus = ({ members, curNumSeek, dorm, totalGroupSize, id, listingLocation, onShowMoreClick }) => {
  return (
    <div className={css.bottom}>
      <div className={css.looking}>
        <span>Looking for {curNumSeek} more</span>
      </div>
      <div className={css.bottomIMGcontainer}>
        <div className={css.bottomIMG}>
          <img className="location" src="/assets/postings/location.png" alt="location" />
          <span>{dorm}</span>
        </div>
        <div className={css.bottomIMG}>
          <img className="bed" src="/assets/postings/bed.png" alt="bed" />
          <span>{totalGroupSize} People Total</span>
        </div>
      </div>
      <div className={`${css.showMore} offCampus`} id={id}>
        <a href="javascript:void(0)" className={`showMoreLink ${listingLocation}`} onClick={() => onShowMoreClick(id)}>
          <span>SHOW MORE...</span>
        </a>
      </div>
    </div>
  );
};

export default BottomOnCampus;