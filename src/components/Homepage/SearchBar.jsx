import React, { useContext, useState } from 'react';
import { SearchContext } from '../../context/searchContext.jsx';
import OnCampusSearchForm from './onCampusSearchForm';
import OffCampusSearchForm from './offCampusSearchForm';
import css from "../../styles/SearchBar.module.css";

const SearchBar = () => {
  /*const [listingLocation, setListingLocation] = useState('');
  const [formData, setFormData] = useState({
    "class-year": 0,
    "housing-aim": 0,
    "number-of-people-in-search-group": 0,
    "preferred-dorm": ""
  });*/

  const {formData, setFormData, listingLocation, setListingLocation} = useContext(SearchContext)

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setListingLocation(value); //update value
    localStorage.setItem("listingLocation", value); // Save selection to localStorage
    console.log("Listing Location:", value);
    console.log("New value of listing location {state} object:", listingLocation);
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    const updatedValue = isNaN(value) ? value : Number(value); // Convert numbers
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: updatedValue,
    }));
    localStorage.setItem("form", JSON.stringify({ ...formData, [id]: updatedValue }));
    console.log("Form Data Updated:", { ...formData, [id]: updatedValue });
    console.log("New value of form data {state} object:", formData);
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
                <label className="label">Listing Location</label>
                <select
                  name="Listing Location:"
                  placeholder="Enter Desired Location"
                  id="listing-location"
                  className= {css.select}
                  value={listingLocation}
                  onChange={handleLocationChange}
                >
                  <optgroup className="options-group">
                    <option value="">Select One</option>
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
