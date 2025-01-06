import React from 'react';

const BottomOffCampus = ({ members, curNumSeek, address, totalGroupSize, id, listingLocation, onShowMoreClick }) => {
  return (
    <div className="bottom">
      <div className="looking">
        <span>Looking for {curNumSeek}</span>
      </div>
      <div className="bottomIMGcontainer">
        <div className="bottomIMG">
          {/*<img className="location" src="src/assets/postings/location.png" alt="location" />*/}
          <span>{address}</span>
        </div>
        <div className="bottomIMG">
          <img className="bed" src="public/assets/postings/bed.png" alt="bed" />
          <span>{totalGroupSize} People Total</span>
        </div>
      </div>
      <div className="showMore offCampus" id={id}>
        <a href="javascript:void(0)" className={`showMoreLink ${listingLocation}`} onClick={() => onShowMoreClick(id)}>
          <span>SHOW MORE...</span>
        </a>
      </div>
    </div>
  );
};

export default BottomOffCampus;