import React, { useEffect, useState, useContext } from 'react';
import { SearchContext } from '../../context/searchContext.jsx';
import { PostingsContext } from '../../context/PostingsContext.jsx';
import { FilteredPostingsContext } from '../../context/FilteredPostingsContext.jsx';
import { useHandleLocationClick } from '../../helperFunctions/HandleOnAndOffCampusClick.jsx';
import FilteredPosts from './FilteredPosts.jsx';
import OnCampusSearchForm from '../Homepage/onCampusSearchForm.jsx';
import OffCampusSearchForm from '../Homepage/offCampusSearchForm.jsx';
import { useLocation, useNavigate } from "react-router-dom";
import css from "./styles/Posts.module.css";


//NOTE: if the context changes frequently, it can trigger unecessary re-renders across the components subscribing to it.
const Posts = () => {
  const {formData, setFormData, listingLocation, setListingLocation} = useContext(SearchContext);
  const {postings, setPostings} = useContext(PostingsContext);
  const {filteredPostings, setFilteredPostings} = useContext(FilteredPostingsContext); 
  const {handleOnCampusClick, handleOffCampusClick} = useHandleLocationClick();

  const DEBUG_MODE = true;
  if (DEBUG_MODE) {
    console.log("listing location: ", listingLocation);
    console.log("form data:", formData);
    console.log("postings: ", postings)
    console.log("filteredPostings: ", filteredPostings);
  }

  /*PostingsContext.jsx updates the Postings context whenever the url path changes so we will be using 
  all the latest postings when this page is navigated to */

  useEffect(() => {
    let filtered = []; //initialize to empty array

    if (!formData || !listingLocation) {
      console.log('Form Data or listing location is not set.');
      return;
    }

    //A guard to ensure that postings isn't empty before attempting to filter it
    //Use strict equality operator
    if (!postings || postings.length === 0) {
      console.log("No postings to filter");
      return;
    }

    //filter postings:
    //Made two branches incase we want to use different filtering logic for oncampus vs offcampus
    if (listingLocation === "oncampus") {
      filtered = postings.filter(
        (posting) => 
          posting.aimInteger == formData["housing-aim"] &&
          posting.curNumSeek == formData["number-of-people-in-search-group"] 
      );
    } else if (listingLocation == "offcampus") {
      filtered = postings.filter(
        (posting) => 
          posting.aimInteger == formData["housing-aim"] &&
          posting.curNumSeek == formData["number-of-people-in-search-group"] 
      );

    } else {
      console.log("Data not available.");
      return;
    }

    //Only update if the filtered results are different than the current state of filteredPostings (to avoid unecessary page rerenders)
    //Consideration for the future: JSON.stringify can be inefficient for large objects. A deep comparison function might be better if performance is critical. For now, this is fine if the dataset isn't large.
    if (JSON.stringify(filtered) !== JSON.stringify(filteredPostings)) {
      setFilteredPostings(filtered);
    }
  }, [listingLocation, formData, postings]); //Dependency Array. useEffect runs anytime any object in this array changes (ie. if postings is updated, 
                                             //the filtering is done with the latest data)
                                             //Is it necessary to keep listingLocation in the array?

  return (
    <section>
      <div className ={css.searchContainer}>
        <div className={css.buttonContainer}>
          <button onClick={handleOnCampusClick} className={css.button}>
            <span className={css.buttonText}>On Campus</span>
          </button>
          <button onClick={handleOffCampusClick} className={css.button}>
            <span className={css.buttonText}>Off Campus</span>
          </button>
        </div>
        <div className={css.formContainer}>
          {listingLocation == "oncampus" &&
            <OnCampusSearchForm />
          }
          {listingLocation == "offcampus" &&
            <OffCampusSearchForm />
          }
        </div>
      </div>
      <FilteredPosts filteredPostings={filteredPostings} listingLocation={listingLocation} />
    </section>
  );

};

export default Posts;