import React, { useEffect, useState, useContext } from 'react';
import { SearchContext } from '../../context/searchContext.jsx';
import FilteredPosts from './FilteredPosts.jsx';

const Posts = ({ data }) => {
  const {formData, setFormData, listingLocation, setListingLocation} = useContext(SearchContext)
  const [filteredListings, setFilteredListings] = useState([]); //Change? (don't want filtered listings tied to Listings.jsx)

  useEffect(() => {
    if (!formData) {
      console.log('Form Data is empty or undefined.');
      return;
    }

    if (listingLocation && data[listingLocation]) {
      const filtered = data[listingLocation].filter(
        (group) =>
          group.aim_integer === formData['housing-aim'] &&
          group.numSeek === formData['number-of-people-in-search-group']
      );
      setFilteredListings(filtered);
    } else {
      console.log('Invalid listing location or data not available.');
    }
  }, [listingLocation, formData, data]); //Why is this needed when using useEffect?

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