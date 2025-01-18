import React, { useContext, useEffect } from 'react';
import { SearchContext } from '../../context/searchContext.jsx';
import SearchBar from "./SearchBar.jsx";
import Backdrop from "./backdrop.jsx";
import css from "../../styles/Splash.module.css";

const Splash = () => {
  // Search context variables
  const { setListingLocation } = useContext(SearchContext);

  // State to track which button is active
  const [activeButton, setActiveButton] = React.useState("oncampus"); // Default to "oncampus"

  // Handle button clicks
  const handleOnCampusClick = () => {
    setListingLocation("oncampus");
    setActiveButton("oncampus"); // Mark "oncampus" as active
  };

  const handleOffCampusClick = () => {
    setListingLocation("offcampus");
    setActiveButton("offcampus"); // Mark "offcampus" as active
  };

  useEffect(() => {
    // Set initial active button
    setListingLocation("oncampus");
  }, [setListingLocation]);

  return (
    /*<div className={css.backgroundLayer}>*/
    <div className={css.container} aria-label="Image of Gasson Hall">
      <Backdrop />
      {/* <div className={css.introText}>
        <p>Welcome to BCRS!</p>
        <p>Your pal throughout the BC Housing Lottery</p>
      </div> */}
      <div className={css.contentWrapper}>
        <div className={css.buttonsContainer}>
          {/* On-Campus Button */}
          <button
            onClick={handleOnCampusClick}
            className={`${css.onCampusButton} ${activeButton === "oncampus" ? css.pressed : ""}`}
          >
            <p>On-Campus</p>
          </button>

          {/* Off-Campus Button */}
          <button
            onClick={handleOffCampusClick}
            className={`${css.offCampusButton} ${activeButton === "offcampus" ? css.pressed : ""}`}
          >
            <p>Off-Campus</p>
          </button>
        </div>
        <div className={css.searchBarWrapper}>
          <SearchBar />
        </div>
      </div>
      <div className={css.backgroundLayer}></div>
    </div>
    /*</div>*/
  );
};

export default Splash;
