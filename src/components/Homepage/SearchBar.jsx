import React, { useContext, useState } from 'react';
import { SearchContext } from '../../context/searchContext.jsx';
import OnCampusSearchForm from './onCampusSearchForm';
import OffCampusSearchForm from './offCampusSearchForm';

//NOTE: if the context changes frequently, it can trigger unecessary re-renders across the components subscribing to it.
const SearchBar = () => {

  //use SearchContext instead of local storage to confirm the most recent user data
  //When SearchBar renders, the values of the SearchContext are loaded into the following variables (which are initially empty/0)
  const {formData, setFormData, listingLocation, setListingLocation} = useContext(SearchContext)
  //PRINT STATEMENTS FOR DEBUGGING
  console.log("If listingLocation changes, listingLocation must match the value from the event that triggered SearchBar to rerender");
  console.log("listingLocation: ", listingLocation);
  console.log("setListingLocation: ", setListingLocation);

  //If a change to formData occurrs, SearchBar rerenders and the print statements run again (w the updated Context)
  /*const handleFormChange = (e) => {
    const { id, value } = e.target;
    console.log(e.target);
    const updatedValue = isNaN(value) ? value : Number(value); // Convert numerical responses to numbers
    console.log("updatedValue:",updatedValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: updatedValue,
    }));
    console.log("Form Data Updated:", { ...formData, [id]: updatedValue });
  };*/

  return (
    <>
      {/* Render the form dynamically based on the selected listing location */}
      {listingLocation === 'oncampus' && <OnCampusSearchForm />}
      {listingLocation === 'offcampus' && <OffCampusSearchForm />}
    </>
  );
};

export default SearchBar;