import React, { useContext, useEffect } from 'react';
import { SearchContext } from '../../context/searchContext.jsx';
import { PostingsContext } from '../../context/PostingsContext.jsx';
import { FilteredPostingsContext } from '../../context/FilteredPostingsContext.jsx';
import { useHandleLocationClick } from '../../helperFunctions/HandleOnAndOffCampusClick.jsx';
import FilteredPosts from './FilteredPosts.jsx';
import OnCampusSearchForm from '../Homepage/onCampusSearchForm.jsx';
import OffCampusSearchForm from '../Homepage/offCampusSearchForm.jsx';
import css from "./styles/Posts.module.css";
import AllPosts from './AllPosts.jsx';


//NOTE: if the context changes frequently, it can trigger unecessary re-renders across the components subscribing to it.
const Posts = () => {
  const {formData, listingLocation} = useContext(SearchContext);
  const {postings } = useContext(PostingsContext);
  const {filteredPostings } = useContext(FilteredPostingsContext); 
  // const {handleOnCampusClick, handleOffCampusClick} = useHandleLocationClick();
  const [activeButton, setActiveButton] = React.useState("oncampus"); // Default to "oncampus"


  const { setListingLocation } = useContext(SearchContext);

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

  const DEBUG_MODE = true;
  if (DEBUG_MODE) {
    console.log("listing location: ", listingLocation);
    console.log("form data:", formData);
    console.log("postings: ", postings)
    console.log("filteredPostings: ", filteredPostings);
  }

  const isFormEmpty = () => {
    for (const key in formData) {
      console.log("key", key)
      console.log("form[key]", formData[key])
      if (formData[key] !== 0 && formData[key] !== "") {
        return false;
      }
    }
    return true;
  }

  console.log("isFormEmpty", isFormEmpty());

  /*PostingsContext.jsx updates the Postings context whenever the url path changes so we will be using 
  all the latest postings when this page is navigated to */


  return (
    <main className = {css.postsPageContainer}>
      <div className ={css.searchContainer}>
        <div className={css.buttonContainer}>
          <button onClick={handleOnCampusClick} className={`${css.button} ${listingLocation === "oncampus" ? css.active : ""}`}>
            <span className={css.buttonText}>On Campus</span>
          </button>
          <button onClick={handleOffCampusClick} className={`${css.button} ${listingLocation === "offcampus" ? css.active : ""}`}>
            <span className={css.buttonText}>Off Campus</span>
          </button>
        </div>
        <div className={css.formContainer}>
          {listingLocation === "oncampus" &&
            <OnCampusSearchForm />
          }
          {listingLocation === "offcampus" &&
            <OffCampusSearchForm />
          }
        </div>
      </div>
      {isFormEmpty() ? (
        <AllPosts></AllPosts>
      ) : (
        <FilteredPosts filteredPostings={postings}/>
      )}
    </main>
  );

};

export default Posts;