import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { SearchContext } from '../../context/searchContext';
import css from "../../styles/SearchForm.module.css"

//handleFormChange is passed as props by parent (SearchBar.jsx)
const OffCampusSearchForm = () => {

  //Call all hooks at the top level of the component
  //use SearchContext instead of local storage to confirm the most recent user data
  //When SearchBar renders, the values of the SearchContext are loaded into the following variables (which are initially empty/0)
  const {formData, setFormData, listingLocation, setListingLocation} = useContext(SearchContext)
  const location = useLocation();
  const useSearch = location.pathname !== "/postings";

  
  // State to track size of "search party"
  // Used to dynamically render available options for Housing-Aim field
  const [numPeople, setNumPeople] = useState("");
  //State variables for the values of the other form fields
  const [housingAim, setHousingAim] = useState("");
  const [preferredStreet, setPreferredStreet] = useState("");
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [sublet, setSublet] = useState("");
  
  //PRINT STATEMENTS FOR DEBUGGING
  console.log("If a field in formData changes, the value of this field must match the value from the event that triggered SearchBar to rerender");
  console.log("formData: ", formData);
  console.log("setFormData: ", setFormData);
  const context = useContext(SearchContext);
  console.log("context: ", context);


   //used to navigate to a new path
  const navigate = useNavigate();
  
   //If a change to formData occurrs, onCampusSearchForm rerenders and the print statements run again (w the updated Context)
   const handleFormChange = (e) => {
    const { id, value } = e.target;
    const updatedValue = isNaN(value) ? value : Number(value); // Convert numerical responses to numbers
    console.log("updatedValue:",updatedValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: updatedValue,
    }));
    console.log("Form Data Updated:", { ...formData, [id]: updatedValue });
  };

  //Handle number of people change
  const handleHousingAimChange = (e) => {
    const value = e.target.value;
    setHousingAim(value);
    handleFormChange(e); // Pass change event to handleFormChange
  };

  //Handle number of people change
  const handleNumPeopleChange = (e) => {
    const value = e.target.value;
    setNumPeople(value);
    handleFormChange(e); // Pass change event to handleFormChange
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setGender(value);
    handleFormChange(e);
  }

  const handleYearChange = (e) => {
    const value = e.target.value;
    setYear(value);
    handleFormChange(e);
  }

  const handleSubletChange = (e) => {
    const value = e.target.value;
    setSublet(value);
    handleFormChange(e);
  }

  const initialFormData = {
    classYear: "",
    housingAim: 0,
    numberPeopleInGroup: 0,
    preferredDorm: "",
    gender: "",
    sublet: "",
  };
  
  // Reset all form fields to initial state
  const resetForm = () => {
    setFormData(initialFormData);
    setNumPeople("");
    setHousingAim("");
    setGender("");    
  };

  //Options for Housing Aim based on the number of people 
  const housingOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((num) => num > Number(numPeople));

  const handleSearch = (event) => {
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
    <div className={css.formContainer}>
    <form
      method="post"
      action=""
      className={css.formOff}
      onSubmit={handleSearch}
    >

        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="numberPeopleInGroup">
            Your Current Group Size:
          </label>
          <select
            name="Number of people in your group"
            id="numberPeopleInGroup"
            className={css.select}
            value = {numPeople}
            onChange={handleNumPeopleChange}
          >
            {formData.numberPeopleInGroup === 0 ? (
              <option value ="" disabled hidden>
                Select One
              </option>) : (
                <option value={formData.numberPeopleInGroup} key={formData.numberPeopleInGroup}>
                  {formData.numberPeopleInGroup}
                </option>)}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
              size !== formData.numberPeopleInGroup ? (
                <option key={size} value={size}>
                  {size}
                </option>
              ) : null
            ))}
          </select>
        </div>
        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="housingAim">Housing Aim:</label>
          <select 
            name="Housing Aim" 
            id="housingAim" 
            className= {css.select}
            value={housingAim}
            onChange={handleHousingAimChange}
          >
            {formData.housingAim === 0 ? (
              <option value ="" disabled hidden>
                Select One
              </option>
            ) : (
              <option value={formData.housingAim} key={formData.housingAim}>
                {formData.housingAim}-man housing
              </option>
            )}
            {housingOptions.map((num) => (
              num !== formData.housingAim ? (
                <option key={num} value={num}>
                  {num}-man housing
                </option>
              ) : null
            ))}
          </select>
        </div>
        {/*To be decided if we want to implement later. For now, I think we are good without it. */}

        {/* <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="preferred-street">Preferred Street:</label>
          <select
          name="Preferred Street"
          id="preferred-street"
          className={css.select}
          value={preferredStreet}
          >

          </select>
          </div> */}

        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="gender">Gender:</label>
            <select name="gender" 
            id="gender" 
            className={css.select} 
            value={gender}
            onChange={handleGenderChange}>
              {formData.gender === "" ? (
                <option value="" disabled hidden> Select One </option>
              ) : (
                <option value={formData.gender}>{formData.gender}</option>
              )}
              {["Male", "Female", "Other"].map((genderOption) => (
                genderOption !== formData.gender ? (
                  <option key={genderOption} value={genderOption}>
                    {genderOption}
                  </option>
                ) : null
              ))}
            </select>
        </div>

        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="classYear">Class Year (Next Year):</label>
          <select name="year" 
            id="classYear" 
            className={css.select} 
            value={year}
            onChange={handleYearChange}>
              {/* Show "Select One" only if no classYear is selected */}
              {formData.classYear === "" && (
                <option value="" disabled hidden>
                  Select One
                </option>
              )}

              {/* Render the selected classYear (if any) */}
              {formData.classYear !== "" && (
                <option value={formData.classYear} key={formData.classYear}>
                  {formData.classYear}
                </option>
              )}

              {/* Render other classYear options, excluding the selected one */}
                {["Senior", "Junior", "Sophomore", "Freshman"].map((classYearOption) => (
                  classYearOption !== formData.classYear ? (
                    <option key={classYearOption} value={classYearOption}>
                      {classYearOption}
                    </option>
                  ) : null
                ))}
            </select>
        </div>

            <div className={css.fieldGroup}>
              <label className={css.label} htmlFor="sublet">Sublets Only:</label>
              <select
                name="sublet"
                id="sublet"
                className={css.select}
                value={sublet}
                onChange={handleSubletChange}
              >
                {formData.sublet === "" ? (
                  <option value ="" disabled hidden>
                    Select One
                  </option>
                ) : (
                  <option value = {formData.sublet} key={formData.sublet}>
                    {formData.sublet}
                  </option>
                )}
                {['Yes', 'No'].map((subletOption) => (
                  subletOption !== formData.sublet ? (
                    <option value = {subletOption} key={subletOption}>
                      {subletOption}
                    </option>
                  ) : null
              ))}
              </select>
            </div>

        <div className={css.finalButtons}>

          {useSearch && (
            <button type="submit" className={css.searchButton}>
              Search
            </button>
          )}
          <button type="button" onClick={resetForm} className={css.resetButton}>
              Reset
          </button>

        </div>
    </form>
    <p className={css.formDetails}>Select your search filters above. Filters may be left blank.</p>
    </div>
  );
};

export default OffCampusSearchForm;
