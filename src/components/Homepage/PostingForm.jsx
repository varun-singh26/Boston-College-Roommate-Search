import React, { useState, useEffect } from 'react';
import css from "../../styles/Homepage/Form.module.css"

const PostingForm = () => {
  const [location, setLocation] = useState('off-campus');
  const [residents, setResidents] = useState([
    { name: '', academicYear: 'freshman' },
  ]);
  const [formData, setFormData] = useState({
    numSeek: '',
    dorm: '',
    address: '',
    rent: '',
    utilities: 'included',
    startDate: '',
    endDate: '',
  });

  // Handle location toggle effect
  useEffect(() => {
    if (location === 'off-campus') {
      setFormData((prev) => ({ ...prev, dorm: '' }));
    } else {
      setFormData((prev) => ({ ...prev, address: '', rent: '', utilities: '', startDate: '', endDate: '' }));
    }
  }, [location]);

  // Add a new resident row
  const addResident = () => {
    setResidents((prev) => [...prev, { name: '', academicYear: 'freshman' }]);
  };

  //Remove a resident row
  const removeResident = (indexToRemove) => {
    setResidents((prevResidents) => 
        prevResidents.filter((_, index) => index != indexToRemove)
    );
  };

  // Handle resident change
  const handleResidentChange = (index, field, value) => {
    const updatedResidents = [...residents];
    updatedResidents[index][field] = value;
    setResidents(updatedResidents);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ location, residents, formData });
    // Integrate with backend or state management here
  };

  return (
    <div className={css.container}>
      <header className={css.headerTextContainer}>
        <h2 className={css.headerText}> Can't find the right housing group?</h2>  
        <h2> Make your own <span className={css.keyword}>Posting</span> and have potential roommates find you: </h2>
      </header>  
      <form className={css.postForm} onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="location">Location:</label>
          <select id="location" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="off-campus">Off-Campus</option>
            <option value="on-campus">On-Campus</option>
          </select>
        </div>

        <div className={css.formGroup}>
          <label>Current Group Members:</label>
          <div className={css.residentsContainer}>
            {residents.map((resident, index) => (
              <div key={index} className={css.residentRow}>
                <input
                  type="text"
                  value={resident.name}
                  placeholder="Resident Name"
                  onChange={(e) => handleResidentChange(index, 'name', e.target.value)}
                />
                <select
                  value={resident.academicYear}
                  onChange={(e) => handleResidentChange(index, 'academicYear', e.target.value)}
                >
                  <option value="freshman">Freshman</option>
                  <option value="sophomore">Sophomore</option>
                  <option value="junior">Junior</option>
                  <option value="senior">Senior</option>
                </select>
                <button type="button" onClick={() => removeResident(index)} className={css.addButton}>Remove</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addResident} className={css.addButton}>Add More</button>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="looking-for">Looking for:</label>
          <input
            type="number"
            id="looking-for"
            value={formData.numSeek}
            onChange={(e) => setFormData({ ...formData, numSeek: e.target.value })}
            placeholder="e.g., 8"
          />
        </div>

        {location === 'off-campus' ? (
          <>
            <div className={css.formGroup}>
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g., 140 Commonwealth Ave, Chestnut Hill, MA 02467"
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="rent">Monthly Rent:</label>
              <input
                type="number"
                id="rent"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                placeholder="e.g., 1500"
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="utilities">Utilities:</label>
              <select
                id="utilities"
                value={formData.utilities}
                onChange={(e) => setFormData({ ...formData, utilities: e.target.value })}
              >
                <option value="included">Included</option>
                <option value="not-included">Not Included</option>
              </select>
            </div>

            <div className={css.formGroup}>
              <label htmlFor="start-date">Start Date:</label>
              <input
                type="date"
                id="start-date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />

              <label htmlFor="end-date">End Date:</label>
              <input
                type="date"
                id="end-date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </>
        ) : (
          <div className={css.formGroup}>
            <label htmlFor="dorm">Preferred Dorm:</label>
            <select
              id="dorm"
              value={formData.dorm}
              onChange={(e) => setFormData({ ...formData, dorm: e.target.value })}
            >
              <option value="">Select One</option>
              <option value="Gabelli">Gabelli</option>
              <option value="Ignacio">Ignacio</option>
              <option value="Modulars">Modulars</option>
              <option value="Ninety St. Thomas More">Ninety St. Thomas More</option>
              <option value="Reservoir">Reservoir</option>
              <option value="Rubenstein">Rubenstein</option>
              <option value="Stayer">Stayer</option>
              <option value="Thomas More">Thomas More</option>
              <option value="Vanderslice">Vanderslice</option>
              <option value="Voute">Voute</option>
              <option value="Walsh">Walsh</option>
            </select>
          </div>
        )}

        <div className={css.formGroup}>
          <label htmlFor="upload-images">Upload Images:</label>
          <input type="file" id="upload-images" multiple />
        </div>

        <button type="submit" className={css.submitButton}>Submit</button>
      </form>
    </div>
  );
};

export default PostingForm;
