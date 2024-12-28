import React, { useEffect, useState, useContext } from 'react';
import { SearchContext } from '../../context/searchContext.jsx';
import { DataContext } from "../../context/dataContext.jsx"
import FilteredPosts from './FilteredPosts.jsx';

const Posts = () => {
  const {formData, setFormData, listingLocation, setListingLocation} = useContext(SearchContext);
  const {data, setData, loading, setLoading} = useContext(DataContext);
  console.log("data: ", data);
  const [filteredPostings, setFilteredPostings] = useState([]); //Change? (don't want filtered listings tied to Posts.jsx)
  
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