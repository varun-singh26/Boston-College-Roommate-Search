import React, { useEffect, useState, useContext } from 'react';
import { SearchContext } from '../../context/searchContext.jsx';
import { DataContext } from "../../context/dataContext.jsx"
import { FilteredPostingsContext } from '../../context/FilteredPostingsContext.jsx';
import FilteredPosts from './FilteredPosts.jsx';
import { db } from '../../config/firestore.jsx';
import {collection, getDocs, doc} from "firebase/firestore";
import { useLocation } from "react-router-dom";

//NOTE: if the context changes frequently, it can trigger unecessary re-renders across the components subscribing to it.
const Posts = () => {
  const {formData, setFormData, listingLocation, setListingLocation} = useContext(SearchContext);
  console.log("listing location: ", listingLocation);
  console.log("form data:", formData);

  const {filteredPostings, setFilteredPostings} = useContext(FilteredPostingsContext); 
  const [postings, setPostings] = useState([]);
  console.log("filteredPostings: ", filteredPostings);
  console.log("postings: ", postings)

  const location = useLocation();

  useEffect(() => {
    //Fetch postings collection frome firestore whenever path changes
    const getPostings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "postings")) //reference to the service and the path of the collection we want to access
        const queriedPostings = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        //update the state of postings with the documents from cloud firestore
        setPostings(queriedPostings);
      } catch (error) {
        console.error("Error fetching postings:", error);
      }
    };
    getPostings();
  }, [location.pathname]); //Fetches postings collection from firestore whenever url path changes

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
    //Made two branches incase we want to use different logic for oncampus vs offcampus
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

  /*return (
    <div>
      <FilteredPosts filteredListings={filteredListings} listingLocation={listingLocation} />
    </div>
  );*/

  return (
    <div>
      PLACEHOLDER
    </div>
  );
};

export default Posts;