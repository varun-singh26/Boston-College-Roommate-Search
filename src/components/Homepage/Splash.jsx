import React, { useContext, useState } from 'react';
import { SearchContext } from '../../context/searchContext.jsx';
import SearchBar from "./SearchBar.jsx";
import css from "../../styles/Splash.module.css";
import {collection, getDocs} from "firebase/firestore";
const Splash = () => {

  //When SearchBar renders, the values of the SearchContext are loaded into the following variables (which are initially empty/0)
  const {formData, setFormData, listingLocation, setListingLocation} = useContext(SearchContext)

  console.log("If listingLocation changes, listingLocation must match the value from the event that triggered Splash.jsx to rerender");
  console.log("listingLocation: ", listingLocation);
  console.log("setListingLocation: ", setListingLocation);
  const context = useContext(SearchContext);
  console.log("context: ", context);


  //Testing read functionality from cloud firestore



  const handleOnCampusClick = (e) => {
    setListingLocation("oncampus");
    console.log(`Setting listingLocation with new value: oncampus`);
  };

  const handleOffCampusClick = (e) => {
    setListingLocation("offcampus");
    console.log(`Setting listingLocation with new value: offcampus`);
  };
  
  return (
    <div className= {css.container} aria-label="Image of Gasson Hall">
      <div className={css.contentWrapper}>
        <h1 className={css.mainTitle}>Find Your Housing Group</h1>
        <p className={css.subtitle}>Search listings tailored to your preferences</p>
        <div className={css.buttonsContainer}>
          <button onClick={handleOnCampusClick} className={css.onCampusButton}>
            <p>On-Campus</p>
          </button>
          <button onClick={handleOffCampusClick} className={css.offCampusButton}>
            <p>Off-Campus</p>
          </button>
        </div>
      </div>
      <div className={css.searchBarWrapper}>
        <SearchBar />
      </div>
    </div>
  );
};

export default Splash;
