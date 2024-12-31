import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { SearchContext } from '../../context/searchContext';
import css from "../../styles/SearchForm.module.css"

//handleFormChange is passed as props by parent (SearchBar.jsx)
const OffCampusSearchForm = ({ onChange }) => {

  //Call all hooks at the top level of the component
  //use SearchContext instead of local storage to confirm the most recent user data
  const {formData, setFormData, listingLocation, setListingLocation} = useContext(SearchContext)
  const navigate = useNavigate();

  // State to track size of "search party"
  // Used to dynamically render available options for Housing-Aim field
  const [numPeople, setNumPeople] = useState("");
  
  //Handle number of people change
  const handleNumPeopleChange = (e) => {
    const value = e.target.value;
    setNumPeople(value);
    onChange(e); // Pass change event to handleFormChange (in SearchBar.jsx)
  };

  //Options for Housing Aim based on the number of people 
  const housingOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((num) => num > Number(numPeople));

  const handleSubmit = (event) => {
    event.preventDefault();
  
    console.log("Current Listing Location (state variable):", listingLocation);
    console.log('Current Form data (state variable):', formData);
  
    //Append to the current path
    navigate("/postings");

    // Navigate and redirect to the postings page
    /*const currentURL = new URL(window.location.href);
    currentURL.searchParams.set("page", "postings");
    window.location.href = currentURL.toString();*/
  
  };

  return (
    <form
      method="post"
      action="http://www.randyconnolly.com/tests/process.php"
      className="search"
      onSubmit={handleSubmit}
    >
      <fieldset className={css.container}>

        <div className={css.fieldContainer}>
          <label className="label" htmlFor="number-of-people-in-search-group">
            Number of people in your group you are seeking housing with:
          </label>
          <select
            name="Number of people in your group"
            id="number-of-people-in-search-group"
            className={css.select}
            value = {numPeople}
            onChange={handleNumPeopleChange}
          >
            <option value ="" disabled hidden>
              Select One
            </option>
            <optgroup className="options-group">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
        <div className={css.fieldContainer}>
          <label className="label" htmlFor="housing-aim">Housing Aim:</label>
          <select 
            name="Housing Aim" 
            id="housing-aim" 
            className= {css.select}
            onChange={onChange}
            disabled={!numPeople} // Disable if no "Number of people" is selected
          >
            <option value ="" disabled hidden>
              Select One
            </option>
            <optgroup className="options-group">
              {housingOptions.map((num) => (
                <option key={num} value={num}>
                  {num}-man housing
                </option>
              ))}
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

export default OffCampusSearchForm;
