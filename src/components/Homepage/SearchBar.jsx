import React, { useContext, useState } from 'react';
import { SearchContext } from '../../context/searchContext.jsx';
import OnCampusSearchForm from './onCampusSearchForm';
import OffCampusSearchForm from './offCampusSearchForm';
import css from "../../styles/SearchBar.module.css";

//NOTE: if the context changes frequently, it can trigger unecessary re-renders across the components subscribing to it.
const SearchBar = () => {

  //use SearchContext instead of local storage to confirm the most recent user data
  //When SearchBar renders, the values of the SearchContext are loaded into the following variables (which are initially empty/0)
  const {formData, setFormData, listingLocation, setListingLocation} = useContext(SearchContext)
  console.log("If listingLocation changes, listingLocation must match the value from the event that triggered SearchBar to rerender");
  console.log("If a field in formData changes, the value of this field must match the value from the event that triggered SearchBar to rerender");
  console.log("formData: ", formData);
  console.log("setFormData: ", setFormData);
  console.log("listingLocation: ", listingLocation);
  console.log("setListingLocation: ", setListingLocation);
  const context = useContext(SearchContext);
  console.log("context: ", context);

  //If a change to listingLocation occurrs, SearchBar rerenders and the above code runs again (w the updated Context)
  const handleLocationChange = (e) => {
    const value = e.target.value;
    console.log("value", value);
    console.log(`Setting listingLocation with new value: ${value}`);
    setListingLocation(value); //update listingLocation
  };

  //If a change to formData occurrs, SearchBar rerenders and the print statements run again (w the updated Context)
  const handleFormChange = (e) => {
    const { id, value } = e.target;
    console.log(e.target);
    const updatedValue = isNaN(value) ? value : Number(value); // Convert numerical responses to numbers
    console.log("updatedValue:",updatedValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: updatedValue,
    }));
    console.log("Form Data Updated:", { ...formData, [id]: updatedValue });
  };

  return (
    <section className={css.container}>
      <div className={css.innerContainer}>
        <div className="formWrapper">
          <form
            method="post"
            action=""
            className="search"
          >
            <fieldset className={css.outerFieldContainer}>
              <div className={css.innerFieldContainer}>
                <label className="label">Where do you want to live?</label>
                <select
                  name="Listing Location:"
                  placeholder="Enter Desired Location"
                  id="listing-location"
                  className= {css.select}
                  value={listingLocation}
                  onChange={handleLocationChange}
                >
                  <option value ="" disabled hidden>
                    Select One
                  </option>
                  <optgroup className="options-group">
                    <option value="oncampus">On Campus</option>
                    <option value="offcampus">Off Campus</option>
                  </optgroup>
                </select>
              </div>
            </fieldset>
          </form>

          {/* Render the second form dynamically based on the selected listing location */}
          {listingLocation === 'oncampus' && (
            <OnCampusSearchForm onChange={handleFormChange} />
          )} {/* <OnCampusSearchForm onChange={handleFormChange} /> will not render if the condition is falsey (will short circuit instead) */}
          {listingLocation === 'offcampus' && (
            <OffCampusSearchForm onChange={handleFormChange} />
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
