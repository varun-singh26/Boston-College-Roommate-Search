import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { SearchContext } from '../../context/searchContext';
import css from "../../styles/SearchForm.module.css";


//OnChange (handleFormChange) is passed as props by parent (SearchBar.jsx)
const OnCampusSearchForm = () => {

  //Call all hooks at the top level of the component
  //use SearchContext instead of local storage to confirm the most recent user data
  //When SearchBar renders, the values of the SearchContext are loaded into the following variables (which are initially empty/0)
  const {formData, setFormData, listingLocation, setListingLocation} = useContext(SearchContext)

  // State to track size of "search party"
  // Used to dynamically render available options for Housing-Aim field
  const [numPeople, setNumPeople] = useState("");
  //State variables for the values of the other form fields
  const [housingAim, setHousingAim] = useState("");
  const [preferredDorm, setPreferredDorm] = useState("");
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");

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
    console.log(e.target);
    const updatedValue = isNaN(value) ? value : Number(value); // Convert numerical responses to numbers
    console.log("updatedValue:",updatedValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: updatedValue,
    }));
    console.log("Form Data Updated:", { ...formData, [id]: updatedValue });
  };


  //Handle number of people change
  const handlePreferredDormChange = (e) => {
    const value = e.target.value;
    setPreferredDorm(value);
    handleFormChange(e); // Pass change event to handleFormChange
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

  //Options for Housing Aim based on the number of people 
  const housingOptions = [2, 3, 4, 5, 6, 7, 8, 9].filter((num) => num > Number(numPeople));

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
      className={css.form}
      onSubmit={handleSearch}
    >

        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="number-of-people-in-search-group">
            Current Group Size:
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="housing-aim">Housing Aim:</label>
          <select
            name="Housing Aim" 
            id="housing-aim" 
            className={css.select}
            value = {housingAim}
            onChange={handleHousingAimChange}
            //disabled={!numPeople} // Disable if no "Number of people" is selected
          >
            <option value ="" disabled hidden>
              Select One
            </option>
            {housingOptions.map((num) => (
              <option key={num} value={num}>
                {num}-man housing
              </option>
            ))}
          </select>
        </div>
        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="preferred-dorm">Preferred Dorm:</label>
          <select 
            name="Preferred Dorm"
            id="preferred-dorm" 
            className={css.select}
            value = {preferredDorm}
            onChange={handlePreferredDormChange}
            //disabled={!numPeople} // Disable if no "Number of people" is selected 
          >
            <option value ="" disabled hidden>
              Select One
            </option>
            <option value="Ninety-St-Thomas-More">Ninety St. Thomas More</option>
            <option value="Vanderslice">Vanderslice Hall</option>
            <option value="Walsh">Walsh Hall</option>
            <option value="Thomas-More">Thomas More Apartments</option>
            <option value="Modulars">The Mods</option>
            <option value="Reservoir">2000 Commonwealth Avenue</option>
            <option value="Stayer">Stayer Hall</option>
            <option value="Gabelli">Gabelli Hall</option>
            <option value="Voute">Voute Hall</option>
            <option value="Rubenstein">Rubenstein Hall</option>
            <option value="Ignacio">Ignacio Hall</option>
            <option value="66">66 Commonwealth Avenue</option> {/*Need images of 66*/}
            <option value="Roncalli">Roncalli Hall</option> {/*Need images of Roncalli*/}
            <option value="Welch">Welch Hall</option> {/*Need images of Welch*/}
          </select>
        </div>

        <div className={css.fieldGroup}>
        <label className={css.label} htmlFor="gender">Gender:</label>
            <select name="gender" 
            id="gender" 
            className={css.select} 
            value={gender}>
              <option value="" disabled hidden> Select One </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              </select>
        </div>

        <div className={css.fieldGroup}>
        <label className={css.label} htmlFor="year">Class Year:</label>
            <select name="year" 
            id="year" 
            className={css.select} 
            value={year}>
              <option value="" disabled hidden> Select One </option>
              <option value="Male">Senior</option>
              <option value="Female">Junior</option>
              <option value="Other">Sophomore</option>
              <option value="Other">Freshman</option>
              </select>
        </div>

        <button type="submit" className={css.searchButton}>
          Search
        </button>
    </form>
    <p className={css.formDetails}>Select your search filters above. Filters may be left blank.</p>
    </div>

  );
};

export default OnCampusSearchForm;
