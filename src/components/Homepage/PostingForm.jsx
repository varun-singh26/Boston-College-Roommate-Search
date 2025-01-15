import React, { useState, useEffect } from 'react';
import css from "../../styles/Homepage/Form.module.css"
import {db} from "../../config/firestore";
import {collection, addDoc} from "firebase/firestore";

const PostingForm = () => {
  const debugMode = true;
  const [location, setLocation] = useState('offcampus');
  const [residents, setResidents] = useState([
    { name: '', academicYear: '', gender: '', instagramHandle: '', email: '', isAdmin: true},
  ]);
  const [postingFormData, setPostingFormData] = useState({
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
    console.log("posting formdata: ", postingFormData);
    console.log("residents: ", residents);
    console.log("location (offcampus is default): ", location);
  }

  // Handle location toggle effect
  //clears unecessary fields of formData when location changes
  useEffect(() => {
    if (location === 'offcampus') {
      setPostingFormData((prev) => ({ ...prev, dorm: '' }));
    } else {
      setPostingFormData((prev) => ({ ...prev, address: '', rent: '', utilities: '', startDate: '', endDate: '' }));
    }
  }, [location]);

  // Add a new resident row
  
  const addResident = () => {
    setResidents((prev) => [
      ...prev,
      { name: '', academicYear: '', gender: '', instagramHandle: '', email: '', admin: false },
    ]);
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

    if (!(postingFormData.numSeek > 0)) {
        errors.push("Please specify the number of roomates you're looking to attract to your posting (must be at least one)");
    }

    if (location == "offcampus" && (!postingFormData.address || !postingFormData.rent || !postingFormData.startDate || !postingFormData.endDate)) {
        errors.push("Please fill all off-campus fields!");
    }

    if (location == "oncampus" && !postingFormData.dorm) {
        errors.push("Please select a dorm!");
    }

    if (!postingFormData.adminEmail || !postingFormData.adminPhoneNumber) {
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
    console.log({ location, residents, postingFormData });

    //If form isn't valid, don't submit to cloud firestore
    if (!validateForm()) {
        return;
    }

    // If form is valid, continue execution and add posting to postings collection in cloud firestore
    const period = {
        start: {
            month: new Date(postingFormData.startDate).getMonth() + 1, //Months are zero-indexed
            day: new Date(postingFormData.startDate).getDate(),
            year: new Date(postingFormData.startDate).getFullYear()
        },
        end: {
            month: new Date(postingFormData.endDate).getMonth() + 1,
            day: new Date(postingFormData.endDate).getDate(),
            year: new Date(postingFormData.endDate).getFullYear()
        }
    };
    const members = residents.map((resident) => ({
        name: resident.name,
        academicYear: resident.academicYear,
        gender: resident.gender,
        instagramHandle: resident.instagramHandle,
        email: resident.email
    }));
    console.log("Members: ", residents);
    const adminContactInfo = {
        email: postingFormData.adminEmail,
        instagramHandle: postingFormData.adminInstagramHandle,
        phoneNumber: postingFormData.adminPhoneNumber
    }
    try {
        const docRef = await addDoc(collection(db, "postings"), {
            address: postingFormData.address || "",
            adminContact: adminContactInfo,
            aimInteger: residents.length + parseInt(postingFormData.numSeek,10),
            curGroupSize: residents.length,
            curNumSeek: parseInt(postingFormData.numSeek, 10),
            dorm: location == "oncampus" ? postingFormData.dorm : null,
            listingLocation: location,
            members: members,
            monthlyRent: postingFormData.rent || 0,
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
        <h2 className={css.headerText}> Can't find the right housing group using our search?</h2>  
        <h2> Make your own <span className={css.keyword}>Posting</span> and have potential roommates find you: </h2>
      </header>  
      <div className={css.formHolder}>
      <form className={css.postForm} onSubmit={handleSubmit}>
        <div className={`${css.formGroup} ${css.formLocationSelector}`}>
          <label htmlFor="location">Location:</label>
          <select id="location" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="oncampus">On-Campus</option>
            <option value="offcampus">Off-Campus</option>
          </select>
        </div>


        <div className={css.formGroup2}>
  <div className={css.residentsContainer}>
    <label>Group Administrator:</label>
    {residents.length === 0 ? (
      <div className={css.residentRowAdmin}>
        <input
          type="text"
          value={postingFormData.adminName || ''}
          placeholder="First and Last Name"
          aria-label="Admin Name"
          onChange={(e) => setPostingFormData({ ...postingFormData, adminName: e.target.value })}
          required
        />
        <select
          value={postingFormData.adminAcademicYear || ''}
          aria-label="Admin Academic Year"
          onChange={(e) => setPostingFormData({ ...postingFormData, adminAcademicYear: e.target.value })}
          required
        >
          <option value="" disabled hidden>
            Select One
          </option>
          <option value="freshman">Freshman</option>
          <option value="sophomore">Sophomore</option>
          <option value="junior">Junior</option>
          <option value="senior">Senior</option>
        </select>

        <select
          value={postingFormData.adminGender || ''}
          aria-label="Admin Gender"
          onChange={(e) => setPostingFormData({ ...postingFormData, adminGender: e.target.value })}
          required
        >
          <option value="" disabled hidden>
            Select One
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {postingFormData.adminGender === 'other' && (
          <input
            type="text"
            value={postingFormData.customGender || ''}
            placeholder="Specify Gender"
            onChange={(e) => setPostingFormData({ ...postingFormData, customGender: e.target.value })}
            required
          />
        )}

        <input
          type="text"
          value={postingFormData.adminInstagramHandle || ''}
          placeholder="Instagram Handle"
          aria-label="Admin Instagram Handle"
          onChange={(e) => setPostingFormData({ ...postingFormData, adminInstagramHandle: e.target.value })}
        />

        <input
          type="text"
          value={postingFormData.adminEmail || ''}
          placeholder="Email"
          aria-label="Admin Email"
          onChange={(e) => setPostingFormData({ ...postingFormData, adminEmail: e.target.value })}
          required
        />

        <input
          type="text"
          id="admin-phone-number"
          value={postingFormData.adminPhoneNumber || ''}
          onChange={(e) => setPostingFormData({ ...postingFormData, adminPhoneNumber: e.target.value })}
          placeholder="Phone Number (e.g., 001-123-456-7890)"
        />
      </div>
    ) : (
      <>
        {residents.length > 0 && (
          <div className={css.residentRowAdmin}>
            <input
              type="text"
              value={residents[0].name}
              placeholder="First and Last Name"
              aria-label="Admin Name"
              onChange={(e) => handleResidentChange(0, 'name', e.target.value)}
              required
            />
            <select
              value={residents[0].academicYear}
              aria-label="Admin Academic Year"
              onChange={(e) => handleResidentChange(0, 'academicYear', e.target.value)}
              required
            >
              <option value="" disabled hidden>
                Select One
              </option>
              <option value="freshman">Freshman</option>
              <option value="sophomore">Sophomore</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
            </select>

            <select
              value={residents[0].gender}
              aria-label="Admin Gender"
              onChange={(e) => handleResidentChange(0, 'gender', e.target.value)}
              required
            >
              <option value="" disabled hidden>
                Select One
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {residents[0].gender === 'other' && (
              <input
                type="text"
                value={residents[0].customGender || ''}
                placeholder="Specify Gender"
                onChange={(e) => handleResidentChange(0, 'customGender', e.target.value)}
                required
              />
            )}

            <input
              type="text"
              value={residents[0].email || ''}
              placeholder="BC Email"
              aria-label="Admin Email"
              onChange={(e) => handleResidentChange(0, 'email', e.target.value)}
              required
            />

            <input
              type="text"
              value={residents[0].instagramHandle || ''}
              placeholder="Instagram Handle"
              aria-label="Admin Instagram Handle"
              onChange={(e) => handleResidentChange(0, 'instagramHandle', e.target.value)}
            />

            <input
              type="text"
              id="admin-phone-number"
              value={postingFormData.adminPhoneNumber || ''}
              onChange={(e) => setPostingFormData({ ...postingFormData, adminPhoneNumber: e.target.value })}
              placeholder="Phone Number (e.g., 001-123-456-7890)"
            />
          </div>
        )}
      </>
    )}

    <label>Additional Members:</label>
    {residents.slice(1).map((resident, index) => (
      <div key={`member-${index}`} className={css.residentRow}>
        <input
          type="text"
          value={resident.name}
          placeholder="First and Last Name"
          aria-label={`Name of Resident ${index + 1}`}
          onChange={(e) => handleResidentChange(index + 1, 'name', e.target.value)}
          required
        />
        <select
          value={resident.academicYear}
          aria-label={`Academic year of Resident ${index + 1}`}
          onChange={(e) => handleResidentChange(index + 1, 'academicYear', e.target.value)}
          required
        >
          <option value="" disabled hidden>
            Select One
          </option>
          <option value="freshman">Freshman</option>
          <option value="sophomore">Sophomore</option>
          <option value="junior">Junior</option>
          <option value="senior">Senior</option>
        </select>

        <select
          value={resident.gender}
          aria-label={`Gender of Resident ${index + 1}`}
          onChange={(e) => {
            const value = e.target.value;
            handleResidentChange(index + 1, 'gender', value);
            if (value !== 'other') {
              handleResidentChange(index + 1, 'customGender', ''); // Clear custom input
            }
          }}
          required
        >
          <option value="" disabled hidden>
            Select One
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {resident.gender === 'other' && (
          <input
            type="text"
            value={resident.customGender || ''}
            placeholder="Specify Gender"
            onChange={(e) => handleResidentChange(index + 1, 'customGender', e.target.value)}
            required
          />
        )}

        <input
          type="text"
          value={resident.email || ''}
          placeholder="BC Email"
          aria-label={`Email of Resident ${index + 1}`}
          onChange={(e) => handleResidentChange(index + 1, 'email', e.target.value)}
          required
        />

        <input
          type="text"
          value={resident.instagramHandle || ''}
          placeholder="Instagram Handle"
          aria-label={`Instagram Handle of Resident ${index + 1}`}
          onChange={(e) => handleResidentChange(index + 1, 'instagramHandle', e.target.value)}
        />

        <button type="button" onClick={() => removeResident(index + 1)} className={css.removeButton}>
          Remove
        </button>
      </div>
    ))}

    <button type="button" onClick={addResident} className={css.addButton}>
      Add More
    </button>
  </div>
</div>




          {/* <label htmlFor="admin-phone-number">Group Administrator Phone Number:</label>
          <input
            type="text"
            id="admin-phone-number"
            value={postingFormData.adminPhoneNumber}
            onChange={(e) => setPostingFormData({...postingFormData, adminPhoneNumber: e.target.value})}
            placeholder="e.g, 123-456-7890"
          />
          <label htmlFor="admin-instagram-handle">Group Administrator Instagram Handle:</label>
          <input
            type="text"
            id="admin-instagram-handle"
            value={postingFormData.adminInstagramHandle}
            onChange={(e) => setPostingFormData({...postingFormData, adminInstagramHandle: e.target.value})}
            placeholder="enter group administrator's Instagram profile username"
          />
          <label htmlFor="admin-email">Group Administrator Email:</label>
          <input
            type="text"
            id="admin-email"
            value={postingFormData.adminEmail}
            onChange={(e) => setPostingFormData({...postingFormData, adminEmail: e.target.value})}
            placeholder="e.g, example@bc.edu"
          /> */}

        <div className={css.formGroup3}>

        <div className={css.formGroup}>
          <label htmlFor="looking-for">How many more roomates do you need?:</label>
          <input
            type="number"
            id="looking-for"
            value={postingFormData.numSeek}
            onChange={(e) => setPostingFormData({ ...postingFormData, numSeek: e.target.value })}
            placeholder="e.g., 7"
          />
        </div>

        {location === 'offcampus' ? (
          <>
            <div className={css.formGroup}>
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                value={postingFormData.address}
                onChange={(e) => setPostingFormData({ ...postingFormData, address: e.target.value })}
                placeholder="e.g., 140 Commonwealth Ave, Chestnut Hill, MA 02467"
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="rent">Monthly Rent:</label>
              <input
                type="number"
                id="rent"
                value={postingFormData.rent}
                onChange={(e) => setPostingFormData({ ...postingFormData, rent: e.target.value })}
                placeholder="e.g., 1500"
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="utilities">Utilities:</label>
              <select
                id="utilities"
                value={postingFormData.utilities}
                onChange={(e) => setPostingFormData({ ...postingFormData, utilities: e.target.value })}
              >
                <option value="included">Included</option>
                <option value="not-included">Not Included</option>
              </select>
            </div>

            <div className={css.formGroup}>
              <label htmlFor="start-date" className={css.startDate}>Start Date:</label>
              <input
                type="date"
                id="start-date"
                value={postingFormData.startDate}
                onChange={(e) => setPostingFormData({ ...postingFormData, startDate: e.target.value })}
              />

              <label htmlFor="end-date" className={css.endDate}>End Date:</label>
              <input
                type="date"
                id="end-date"
                value={postingFormData.endDate}
                onChange={(e) => setPostingFormData({ ...postingFormData, endDate: e.target.value })}
              />
            </div>
          </>
        ) : (
          <div className={css.formGroup}>
            <label htmlFor="dorm">Preferred Dorm:</label>
            <select
              id="dorm"
              value={postingFormData.dorm}
              onChange={(e) => setPostingFormData({ ...postingFormData, dorm: e.target.value })}
            >
              <option value="">Select One</option>
              <option value="Gabelli">Gabelli Hall</option>
              <option value="Ignacio">Ignacio Hall</option>
              <option value="Modulars">The Mods</option>
              <option value="Ninety-St-Thomas-More">Ninety St. Thomas More Hall</option>
              <option value="Reservoir">2000 Commonwealth Avenue</option>
              <option value="Rubenstein">Rubenstein Hall</option>
              <option value="Stayer">Stayer Hall</option>
              <option value="Thomas-More">Thomas More Apartments</option>
              <option value="Vanderslice">Vanderslice Hall</option>
              <option value="Voute">Voute Hall</option>
              <option value="Walsh">Walsh Hall</option>
              <option value="66">66 Commonwealth Avenue</option> {/*Need images of 66*/}
              <option value="Roncalli">Roncalli Hall</option> {/*Need images of Roncalli*/}
              <option value="Welch">Welch Hall</option> {/*Need images of Welch*/}
            </select>
          </div>
        )}

        {/*Need to integrate image uploades using Firebase Storage */}
        <div className={css.formGroup}>
          <label htmlFor="upload-images">Upload Images:</label>
          <input type="file" id="upload-images" multiple />
        </div>
      </div>

        <button type="submit" className={css.submitButton}>Submit</button>
      </form>
    </div>
    </div>
  );
};

export default PostingForm;
