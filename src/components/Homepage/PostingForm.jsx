import React, { useState, useEffect } from 'react';
import css from "../../styles/Homepage/Form.module.css"
import {db} from "../../config/firestore";
import {collection, addDoc} from "firebase/firestore";

const PostingForm = () => {
  const debugMode = true;
  const [location, setLocation] = useState('offcampus');
  const [residents, setResidents] = useState([
    { name: '', academicYear: 'freshman', instagramHandle: '', email: '' },
  ]);
  const [formData, setFormData] = useState({
    numSeek: '',
    dorm: '',
    address: '',
    rent: '',
    utilities: 'included',
    startDate: '',
    endDate: '',
    adminPhoneNumber: '',
    adminInstagramHandle: '',
    adminEmail: ''
  });

  //print statements for debugging (when in debug mode)
  if (debugMode) {
    console.log("formdata: ", formData);
    console.log("residents: ", residents);
    console.log("location (offcampus is default): ", location);
  }

  // Handle location toggle effect
  //clears unecessary fields of formData when location changes
  useEffect(() => {
    if (location === 'offcampus') {
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

  //Perform form validation
  const validateForm = () => {
    const errors = [];

    //Check to ensure posting as at least one current member (which would be the group admin). If not, form is invalid
    if (residents.length == 0 || residents[0].name == "") { //will short circuit
        errors.push("Please add at least one current member to your posting");
    }

    if (!(formData.numSeek > 0)) {
        errors.push("Please specify the number of roomates you're looking to attract to your posting (must be at least one)");
    }

    if (location == "offcampus" && (!formData.address || !formData.rent || !formData.startDate || !formData.endDate)) {
        errors.push("Please fill all off-campus fields!");
    }

    if (location == "oncampus" && !formData.dorm) {
        errors.push("Please select a dorm!");
    }

    if (!formData.adminEmail || !formData.adminPhoneNumber) {
        errors.push("Please provide either admin phone number or email (or both)");
    }

    if (errors.length > 0) {
        alert(errors.join("\n"));
        return false
    }

    return true;
  };

  // Handle form submission to cloud firestore:
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log({ location, residents, formData });

    //If form isn't valid, don't submit to cloud firestore
    if (!validateForm()) {
        return;
    }

    // If form is valid, continue execution and add posting to postings collection in cloud firestore
    const period = {
        start: {
            month: new Date(formData.startDate).getMonth() + 1, //Months are zero-indexed
            day: new Date(formData.startDate).getDate(),
            year: new Date(formData.startDate).getFullYear()
        },
        end: {
            month: new Date(formData.endDate).getMonth() + 1,
            day: new Date(formData.endDate).getDate(),
            year: new Date(formData.endDate).getFullYear()
        }
    };
    const members = residents.map((resident) => ({
        name: resident.name,
        academicYear: resident.academicYear,
        instagramHandle: resident.instagramHandle,
        email: resident.email
    }));
    const adminContactInfo = {
        email: formData.adminEmail,
        instagramHandle: formData.adminInstagramHandle,
        phoneNumber: formData.adminPhoneNumber
    }
    try {
        const docRef = await addDoc(collection(db, "postings"), {
            address: formData.address || "",
            adminContact: adminContactInfo,
            aimInteger: residents.length + parseInt(formData.numSeek,10),
            curGroupSize: residents.length,
            curNumSeek: parseInt(formData.numSeek, 10),
            dorm: location == "oncampus" ? formData.dorm : null,
            listingLocation: location,
            members: members,
            monthlyRent: formData.rent || 0,
            rentPeriod: location == "offcampus" ? period : null,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Failed to submit the posting. Please try again.");
    }
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
            <option value="offcampus">Off-Campus</option>
            <option value="oncampus">On-Campus</option>
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
                  placeholder="First and Last Name"
                  aria-label= {`Name of Resident ${index + 1}`}
                  onChange={(e) => handleResidentChange(index, 'name', e.target.value)}
                />
                <select
                  value={resident.academicYear}
                  aria-label= {`Academic year of Resident ${index + 1}`}
                  onChange={(e) => handleResidentChange(index, 'academicYear', e.target.value)}
                >
                  <option value="freshman">Freshman</option>
                  <option value="sophomore">Sophomore</option>
                  <option value="junior">Junior</option>
                  <option value="senior">Senior</option>
                </select>
                <input
                  type="text"
                  value={resident.instagramHandle}
                  placeholder="Instagram Handle"
                  aria-label= {`Instagram Handle of Resident ${index + 1}`}
                  onChange={(e) => handleResidentChange(index, "instagramHandle", e.target.value)}
                />
                <input
                  type="text"
                  value={resident.email}
                  placeholder="Email"
                  aria-label= {`Email of Resident ${index + 1}`}
                  onChange={(e) => handleResidentChange(index, "email", e.target.value)}
                />
                <button type="button" aria-label= {`Remove resident ${index + 1}`} onClick={() => removeResident(index)} className={css.addButton}>Remove</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addResident} className={css.addButton}>Add More</button>
          <label htmlFor="admin-phone-number">Group Administrator Phone Number:</label>
          <input
            type="text"
            id="admin-phone-number"
            value={formData.adminPhoneNumber}
            onChange={(e) => setFormData({...formData, adminPhoneNumber: e.target.value})}
            placeholder="e.g, 123-456-7890"
          />
          <label htmlFor="admin-instagram-handle">Group Administrator Instagram Handle:</label>
          <input
            type="text"
            id="admin-instagram-handle"
            value={formData.adminInstagramHandle}
            onChange={(e) => setFormData({...formData, adminInstagramHandle: e.target.value})}
            placeholder="enter group administrator's Instagram profile username"
          />
          <label htmlFor="admin-email">Group Administrator Email:</label>
          <input
            type="text"
            id="admin-email"
            value={formData.adminEmail}
            onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
            placeholder="e.g, example@bc.edu"
          />
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

        {location === 'offcampus' ? (
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

        {/*Need to integrate image uploades using Firebase Storage */}
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
