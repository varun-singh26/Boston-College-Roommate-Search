import React, { useEffect, useState, useContext } from 'react';
import { SearchContext } from '../../context/searchContext.jsx';
import { DataContext } from "../../context/dataContext.jsx"
import { FilteredPostingsContext } from '../../context/FilteredPostingsContext.jsx';
import FilteredPosts from './FilteredPosts.jsx';

//NOTE: if the context changes frequently, it can trigger unecessary re-renders across the components subscribing to it.
const Posts = () => {
  const {formData, setFormData, listingLocation, setListingLocation} = useContext(SearchContext);
  const {data, setData, loading, setLoading} = useContext(DataContext);
  const context = useContext(FilteredPostingsContext);
  console.log(context);
  const {filteredPostings, setFilteredPostings} = useContext(FilteredPostingsContext);
  console.log("data: ", data);  
  console.log("filteredPostings: ", filteredPostings);


  useEffect(() => {
    if (!formData) {
      console.log('Form Data is empty or undefined.');
      return;
    }

    //Need to fetch the data from DB.json
    if (listingLocation && data[listingLocation]) {
      const filtered = data[listingLocation].filter(
        (group) =>
          group.aim_integer === formData['housing-aim'] &&
          group.numSeek === formData['number-of-people-in-search-group']
      );
      console.log("filtered postings (filteredPostings must match): ", filtered);
      setFilteredPostings(filtered);
    } else {
      console.log('Invalid listing location or data not available.');
    }
  }, [listingLocation, formData, data]); //Dependency Array. useEffect runs anytime any object in this array changes

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