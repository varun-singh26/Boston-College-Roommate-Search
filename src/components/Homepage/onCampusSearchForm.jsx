import React, { useContext, useState } from 'react';
import { SearchContext } from '../../context/searchContext';
import css from "../../styles/SearchForm.module.css";

const handleSubmit = (event) => {
  event.preventDefault();

  //use SearchContext instead of local storage to confirm the most recent user data
  const {formData, setFormData, listingLocation, setListingLocation} = useContext(SearchContext)

  /*const formData = JSON.parse(localStorage.getItem("form"));
  const listingLocation = localStorage.getItem("listingLocation");*/

  console.log("Current Listing Location (state variable):", listingLocation);
  console.log('Current Form data (state variable):', formData);

  // Navigate and redirect to the listings page
  const currentURL = new URL(window.location.href);
  currentURL.searchParams.set("page", "listings");
  window.location.href = currentURL.toString();

};

//handleFormChange is passed as props by parent (SearchBar.jsx)
const OnCampusSearchForm = ({ handleFormChange }) => {
  return (
    <form 
      method="post" 
      action="" 
      className="search-field"
      onSubmit={handleSubmit}
    >
      <fieldset className={css.container}>
        <div className={css.fieldContainer}>
          <label className="label" htmlFor="class-year">Class Year:</label>
          <select
            name="Class Year" 
            id="class-year" 
            className={css.select}
            onChange={handleFormChange} // Pass changes to parent
          >
            <optgroup className="options-group">
              <option value="">Select One</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </optgroup>
          </select>
        </div>

        <div className={css.fieldContainer}>
          <label className="label" htmlFor="housing-aim">Housing Aim:</label>
          <select
            name="Housing Aim" 
            id="housing-aim" 
            className={css.select}
            onChange={handleFormChange} // Pass changes to parent
          >
            <optgroup className="options-group">
              <option value="">Select One</option>
              <option value="2">2-man housing</option>
              <option value="3">3-man housing</option>
              <option value="4">4-man housing</option>
              <option value="5">5-man housing</option>
              <option value="6">6-man housing</option>
              <option value="7">7-man housing</option>
              <option value="8">8-man housing</option>
              <option value="9">9-man housing</option>
            </optgroup>
          </select>
        </div>

        <div className={css.fieldContainer}>
          <label className="label" htmlFor="number-of-people-in-search-group">
            Number of people in your group you are seeking housing with:
          </label>
          <select
            name="Number of people in your group"
            id="number-of-people-in-search-group"
            className={css.select}
            onChange={handleFormChange} // Pass changes to parent
          >
            <optgroup className="options-group">
              <option value="">Select One</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </optgroup>
          </select>
        </div>

        <div className={css.fieldContainer}>
          <label className="label" htmlFor="preferred-dorm">Preferred Dorm:</label>
          <select 
            name="Preferred Dorm"
            id="preferred-dorm" 
            className={css.select}
            onChange={handleFormChange} // Pass changes to parent
          >
            <optgroup className="options-group">
              <option value="">Select One</option>
              <option value="Ninety St. Thomas More">Ninety St. Thomas More</option>
              <option value="Vanderslice Hall">Vanderslice Hall</option>
              <option value="Walsh Hall">Walsh Hall</option>
              <option value="Thomas More Apartments">Thomas More Apartments</option>
              <option value="Stayer Hall">Stayer Hall</option>
              <option value="Gabelli Hall">Gabelli Hall</option>
              <option value="Voute Hall">Voute Hall</option>
              <option value="Rubenstein Hall">Rubenstein Hall</option>
              <option value="Ignacio Hall">Ignacio Hall</option>
              <option value="66">66 Hall</option>
              <option value="Roncalli Hall">Roncalli Hall</option>
              <option value="Welch Hall">Welch Hall</option>
            </optgroup>
          </select>
        </div>

        <button type="submit" className={css.searchButton}>
          <img
            src="https://cdn.glitch.global/da9cfe19-f6cb-435e-ae30-d04e66913eee/MagnifyingGlass.png?v=1732079795736"
            alt="magnifying glass"
            className={css.searchButtonImage}
          />
          <p className={css.searchButtonText}>Search</p>
        </button>
      </fieldset>
    </form>
  );
};

export default OnCampusSearchForm;
