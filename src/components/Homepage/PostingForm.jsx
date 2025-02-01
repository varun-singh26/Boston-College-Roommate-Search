import React, { useContext, useState, useEffect } from 'react';
import { IsEditingPostContext } from '../Post/contexts/IsEditingPostContext';
import { AuthContext } from "../../context/authContext/index";
import {db} from "../../config/firestore";
import {collection, addDoc, updateDoc, doc, arrayUnion, getDoc} from "firebase/firestore";
import { Link } from 'react-router-dom';
import { uploadFile } from "../../config/storageUpload.js";
import css from "../../styles/Homepage/Form.module.css"

//unless provided by parent component, id prop is null and onClose prop is null
const PostingForm = ({id = null, onClose = null}) => {

  //destructure isEditingPostContext
  const {setIsEditingPost} = useContext(IsEditingPostContext);

  //destructure currentUser, userLoggedIn from AuthContext
  const {currentUser, userLoggedIn} = useContext(AuthContext);

  //create a reference to the document of the current signed-in user
  const [userRef, setUserRef] = useState(null);

  const debugMode = true;

  const [errorMessage, setErrorMessage] = useState("");
  const [location, setLocation] = useState('offcampus');
  const [files, setFiles] = useState([]);
  const [residents, setResidents] = useState([
    { name: '', academicYear: '', gender: '', customGender: '', instagramHandle: '', email: '', isAdmin: true},
  ]);
  const [postingFormData, setPostingFormData] = useState({
    sublet: false,
    numSeek: '',
    dorm: '',
    address: '',
    rent: '',
    utilities: 'included',
    startDate: '',
    endDate: '',
    adminName: '',
    adminAcademicYear: '',
    adminPhoneNumber: '',
    adminInstagramHandle: '',
    adminEmail: '',
    adminuid: ''
  });

  //additional state variables
  //state for posting document reference
  const [postingRefState, setPostingRefState] = useState(null);
  //state for posting document
  const [postingDocState, setPostingDocState] = useState(null);


  //If id provided, fill in posting form data with values from existing posting (post modification) 
  //If id isn't provided, Check if a user is signed in. If so extract username, email, userID and add to the posting form data (post creation)

  useEffect(() => {

    const fillInFormWithExistingPostInformation = async (id) => {
      const postingRef = doc(db, "postings", id) //assign reference
      const postingDoc = await getDoc(postingRef) //fetch document
      console.log("postingDoc:", postingDoc); //debugging

      //Callback function within a callback:
      //(When modifying an already existing post), Extract Firestore date and convert it back to an ISO date string (in order to display date in UI
      // and ensure period field of posting can be updated properly (if necessary) )
      const firestoreDateToString = (dateObj) => {
        if (!dateObj || typeof dateObj !== "object") return ""; // Handle missing or invalid date (ie. oncampus posting )
        const { day, month, year } = dateObj; //destructure dateObj
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`; //explicitly convert dateObj to ISO date string
      };

      // Update state with existing post information
      setPostingRefState(postingRef);
      setPostingDocState(postingDoc);
      setLocation(postingDoc.data()?.listingLocation ?? "offcampus")


      //Don't want to CREATE a new Document in cloud firestore. Instead just want to update an existing document.
      //Keep form UI in sync with existing posting information
      setPostingFormData((prev) => ({
        ...prev,
        adminName: postingDoc.data()?.adminContact.name ?? "",
        adminAcademicYear: postingDoc.data()?.adminContact.academicYear ?? "",
        adminPhoneNumber: postingDoc.data()?.adminContact.phoneNumber ?? "",
        adminInstagramHandle: postingDoc.data()?.adminContact.instagramHandle ?? "",
        adminEmail: postingDoc.data()?.adminContact.email ?? "",
        adminuid: postingDoc.data()?.adminContact.uid ?? "",

        address: postingDoc.data()?.address ?? "",
        dorm: postingDoc.data()?.dorm ?? "",
        rent: postingDoc.data()?.monthlyRent ?? 0,
        utilities: postingDoc.data()?.utilities ?? "included",

        startDate: firestoreDateToString(postingDoc.data()?.rentPeriod?.start), //Convert object to ISO string
        endDate: firestoreDateToString(postingDoc.data()?.rentPeriod?.end),

        sublet: postingDoc.data()?.sublet ?? "",
        numSeek: postingDoc.data()?.curNumSeek
      }));

      //update residents with existing information
      setResidents(postingDoc.data()?.members ?? [
        { name: '', academicYear: '', gender: '', customGender: '', instagramHandle: '', email: '', isAdmin: true},
      ]);
    };

     if (currentUser) { //only allow posting modification if currentUser is loggedIn
      if (id != null) { //id has been provided to component, so fetch existing posting ref (using id) and render Posting Form with existing information (Want to update a posting)
        fillInFormWithExistingPostInformation(id);
      } 
     }
  }, [id]) //This useEffect runs everytime the id of the posting being edited (from IDEditingPostContext) changes. Will this work as expected?

  //New posting creation
  useEffect(() => {
    if (currentUser) {
      if (id == null) {
        setPostingFormData((prev) => ({  
          ...prev, 
          adminName: currentUser.displayName ?? "",
          adminPhoneNumber: currentUser.phoneNumber ?? "",
          adminEmail: currentUser.email ?? "",
          adminuid: currentUser.uid,
          startDate: new Date().toISOString().split('T')[0], //Default to today's date
          endDate: '',
        }));
        setResidents((prev) => {
          const updatedResidents = [...prev];
          updatedResidents[0].name = currentUser.displayName ?? "";
          updatedResidents[0].email = currentUser.email ?? "";
          return updatedResidents;
        });
      }
      
      //update the userRef
      setUserRef(doc(db, "users", currentUser.uid));
    }
  }, [currentUser]); //This useEffect runs everytime the value of currentUser (from the auth Context) changes

  //print statements for debugging (when in debug mode)
  if (debugMode) {
    console.log("userRef (doc): ", userRef);
    console.log("posting formdata: ", postingFormData);
    console.log("posting doc: ", postingDocState);
    console.log("residents: ", residents);
    console.log("location (offcampus is default): ", location);
  }

  // Function to safely convert "YYYY-MM-DD" string to Firestore date object
  const convertToFirestoreDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split("-");
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10),
    };
  };
  
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
        prevResidents.filter((_, index) => index !== indexToRemove)
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

    //Ensure that offcampus postings proved an end date and a start date, and that the end date is indeed after the start date.
    if (postingFormData.listingLocation === "offcampus" && (!postingFormData.startDate || !postingFormData.endDate)) {
      errors.push("Please select both start and end dates.");
    } else {
      const start = new Date(postingFormData.startDate); //Why do we cast the startDate (which is an ISO formatted string) as a Date object?
      const end = new Date(postingFormData.endDate);
      if (end < start) {
        errors.push("End date cannot be before start date.");
      }
    }

    //Check to ensure posting has at least one current member (which would be the group admin). If not, form is invalid
    if (residents.length === 0 || residents[0].name === "") { //will short circuit
        errors.push("Please add at least one current member to your posting");
    }

    if (!(postingFormData.numSeek > 0)) {
        errors.push("Please specify the number of roomates you're looking to attract to your posting (must be at least one)");
    }

    if (location === "offcampus" && (!postingFormData.address || !postingFormData.rent || !postingFormData.startDate || !postingFormData.endDate)) {
        errors.push("Please fill all off-campus fields!");
    }

    if (location === "oncampus" && !postingFormData.dorm) {
        errors.push("Please select a dorm!");
    }

    if (!postingFormData.adminEmail && !postingFormData.adminPhoneNumber) {
        errors.push("Please provide either admin phone number or email (or both)");
    }



    if (errors.length > 0) {
        alert(errors.join("\n"));
        return false
    }

    return true;
  };


  const uploadFiles = async (files) => {
    for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i]); // Ensure async behavior
    }
  };

  // Handle form submission to cloud firestore:
  //if id != null, DON'T want to CREATE a new Document in cloud firestore. Instead just want to update an existing document.
  //if id == null, DO want to CREATE a new Document in cloud firestore.
  const handleSubmit = async(e) => {
    e.preventDefault();

    setErrorMessage(""); //clear previous error message, if any

    //if user isn't signed in, set the error message and stop executing the handleSubmit function
    if (!userLoggedIn) {
      setErrorMessage("You must be have an account to submit a posting for others to view and reach out to. Sign-in or create a new account with us");
      return; //This just exits from the handleSubmit function but not from the PostingForm component
    }

    console.log({ location, residents, postingFormData });

    //If form isn't valid, don't submit to cloud firestore
    if (!validateForm()) {
        return;
    }

    // If form is valid, continue execution and add posting to postings collection in cloud firestore
    //More robust and less error prone method of extracting month, day, and year from startDate and endDate fields
    const period = {
      start: convertToFirestoreDate(postingFormData.startDate),
      end: convertToFirestoreDate(postingFormData.endDate),
    };
    
    const members = residents.map((resident) => ({
        name: resident.name,
        academicYear: resident.academicYear,
        gender: resident.gender,
        instagramHandle: resident.instagramHandle,
        email: resident.email
    }));
    console.log("Residents: ", residents);
    console.log("Members: ", members);

    const adminContactInfo = {
        name: postingFormData.adminName,
        email: postingFormData.adminEmail,
        academicYear: postingFormData.adminAcademicYear,
        instagramHandle: postingFormData.adminInstagramHandle,
        phoneNumber: postingFormData.adminPhoneNumber,
        uid: postingFormData.adminuid
    }

    // Upload images to firebase storage
    console.log("Uploading files:", files);
    await uploadFiles(files);

    //TODO: 

    //If id != null, update the fields of the existing posting doc:
    if (id != null) {
      try {
        //using existing postingRefState
        await updateDoc(postingRefState, {
          address: location === "offcampus" ? postingFormData.address : null,
          adminContact: adminContactInfo, 
          aimInteger: residents.length + parseInt(postingFormData.numSeek, 10),
          curGroupSize: residents.length,
          curNumSeek: parseInt(postingFormData.numSeek, 10),
          dorm: location === "oncampus" ? postingFormData.dorm : null,
          listingLocation: location,
          members: members,
          monthlyRent: postingFormData.rent || 0,
          rentPeriod: location === "offcampus" ? period : null,
          utilities: postingFormData.utilities
        });
        console.log("Reference in postings collection with the following ID has been updated: ", postingRefState.id);
        console.log("Document in postings collection with the following ID has been updated: ", postingDocState.id);
      } catch (error) {
        console.error("Error updating document: ", error);
        alert(`Failed to update the posting with ID: ${postingDocState.id}. Pleae try again.`);
      }
      finally { //always setIsEditing to false after document update (to close PostingForm component in MyProfile.jsx)
        setIsEditingPost(false);
      }
    };
    
    //If id == null, create a new posting doc:
    if (id == null) {

      try { 
        //creating a new reference to the "postings" collection
        const postingDocRef = await addDoc(collection(db, "postings"), {
            address: location === "offcampus" ? postingFormData.address : null,
            adminContact: adminContactInfo,
            aimInteger: residents.length + parseInt(postingFormData.numSeek, 10),
            curGroupSize: residents.length,
            curNumSeek: parseInt(postingFormData.numSeek, 10),
            dorm: location === "oncampus" ? postingFormData.dorm : null,
            listingLocation: location,
            members: members,
            monthlyRent: postingFormData.rent || 0,
            rentPeriod: location === "offcampus" ? period : null,
            utilities: postingFormData.utilities
        });
        console.log("Document written with ID: ", postingDocRef.id);

        //Also want to update the administeredPostings field of the corresponding user doc in the "users" collection
        try {
          await updateDoc(userRef, {
            administeredPostings: arrayUnion(postingDocRef.id) //a firestore method that adds a value to an array field. If value already exists in array, Firestore ensures its not added again.
          });
          console.log("posting", postingDocRef);
          console.log("Added to administeredPostings array of user", userRef);
        } catch (err) {
          console.error("Error updating administeredPostings field of corresponding user (group admin) doc");
          //As of now, the posting will still occur even if the administeredPostings field of corresponding user (group admin) doc isn't updated
        }
      } catch (error) {
          console.error("Error adding document: ", error);
          alert("Failed to submit the posting. Please try again.");
      }
    }
  };

  return (
    <div className={css.container}>
      <header className={css.headerTextContainer}>
        <h2 className={css.headerText}> Can't find the right housing group using our search?</h2>  
        <h2> Make your own <span className={css.keyword}>Posting</span> and have potential roommates find you: </h2>
      </header>
      {!currentUser &&
        <h2 className={css.warning}>Make sure to <Link to="/signIn" className={css.warningLink}>sign-in</Link> before completing the form to save your posting.</h2>
      }  
      <div className={css.formHolder}>
        <form className={css.postForm} onSubmit={handleSubmit}>
          <div className={`${css.formGroup} ${css.formLocationSelector}`}>
            <label htmlFor="location">Location:</label>
            <select id="location" value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="oncampus">On-Campus</option>
              <option value="offcampus">Off-Campus</option>
            </select>

            {location === 'offcampus' && (
            <div className={css.subletGroup}>
                  <label>Are you hoping to find sublets/subtenants with this posting?</label>
                  <input type="checkbox" id="sublet" name="sublet" className={css.subletCheckbox} />
            </div>
            )}

          </div>

          <div className={css.formGroup2}>
            <div className={css.residentsContainer}>
              <label>Group Administrator:</label>
              <>
                {residents.length > 0 && (
                  <div className={css.residentRowAdmin}>
                    <div className={css.requiredInputAdmin}>
                      <input
                        type="text"
                        value={postingFormData.adminName} //Always tied to the state variable
                        placeholder="Full Name"
                        aria-label="Admin Name"
                        readOnly = {userLoggedIn} //Editable only if no user is signed in
                        onChange={(e) => !userLoggedIn && setPostingFormData({...postingFormData, adminName: e.target.value} )}
                        required
                      />
                      <div className={css.requiredAdmin}>*</div>
                    </div>
                    <div className={css.requiredInputAdmin}>
                      <select
                        value={postingFormData.adminAcademicYear}
                        aria-label="Admin Academic Year"
                        onChange={(e) => setPostingFormData({...postingFormData, adminAcademicYear: e.target.value} )}
                        required
                      >
                        <option value="" disabled hidden>
                          Current Year 
                        </option>
                        <option value="freshman">Freshman</option>
                        <option value="sophomore">Sophomore</option>
                        <option value="junior">Junior</option>
                        <option value="senior">Senior</option>
                      </select>
                      <div className={css.requiredAdmin}>*</div>
                    </div>
                    <div className={css.requiredInputAdmin}>
                      <select
                        value={residents[0].gender}
                        aria-label="Admin Gender"
                        onChange={(e) => handleResidentChange(0, 'gender', e.target.value)}
                        required
                      >
                        <option value="" disabled hidden>
                          Gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {residents[0].gender === 'other' && (
                        <input
                          type="text"
                          value={residents[0].customGender}
                          placeholder="Specify Gender"
                          onChange={(e) => handleResidentChange(0, 'customGender', e.target.value)}
                          required
                        />
                      )}
                      <div className={css.requiredAdmin}>*</div>
                    </div>
                    <div className={css.requiredInputAdmin}>
                      <input
                        type="text"
                        value={postingFormData.adminEmail} //Always tied to the state variable
                        placeholder="BC Email"
                        aria-label="Admin Email"
                        readOnly = {userLoggedIn} //Editable only if no user is signed in
                        onChange={(e) => !userLoggedIn && setPostingFormData({...postingFormData, adminEmail: e.target.value} )}
                        required
                      />
                      <div className={css.requiredAdmin}>*</div>
                    </div>
                    <input
                      type="text"
                      value={postingFormData.adminInstagramHandle}
                      placeholder="Instagram Handle"
                      aria-label="Admin Instagram Handle"
                      onChange={(e) => setPostingFormData({...postingFormData, adminInstagramHandle: e.target.value} )}
                    />
                    <input
                      type="text"
                      id="admin-phone-number"
                      value={postingFormData.adminPhoneNumber}
                      onChange={(e) => setPostingFormData({ ...postingFormData, adminPhoneNumber: e.target.value })}
                      placeholder="Phone Number"
                    />
                  </div>
                )}
              </>
              <label>Additional Group Members:</label>
              {residents.slice(1).map((resident, index) => (
                <div key={`member-${index}`} className={css.residentRow}>
                  
                  <div className={css.requiredInput}>
                    <input
                      type="text"
                      value={resident.name}
                      placeholder="Full Name"
                      aria-label={`Name of Resident ${index + 1}`}
                      onChange={(e) => handleResidentChange(index + 1, 'name', e.target.value)}
                      required
                    />
                    <div className={css.required}>*</div>
                  </div>

                  <div className={css.requiredInput}>
                    <select
                      value={resident.academicYear}
                      aria-label={`Academic year of Resident ${index + 1}`}
                      onChange={(e) => handleResidentChange(index + 1, 'academicYear', e.target.value)}
                      required
                    >
                      <option value="" disabled hidden>
                        Current Year
                      </option>
                      <option value="freshman">Freshman</option>
                      <option value="sophomore">Sophomore</option>
                      <option value="junior">Junior</option>
                      <option value="senior">Senior</option>
                    </select>
                    <div  className={css.required}>*</div>
                  </div>

                  <div className={`${css.requiredInput} ${css.requiredGenderInput}`}>
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
                        Gender
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
                    <div className={css.required}>*</div>
                  </div>
                  <div className={css.requiredInput}>
                    <input
                      type="text"
                      value={resident.email || ''}
                      placeholder="BC Email"
                      aria-label={`Email of Resident ${index + 1}`}
                      onChange={(e) => handleResidentChange(index + 1, 'email', e.target.value)}
                      required
                    />
                    <div className={css.required}>*</div>
                  </div>
                  <input
                    type="text"
                    value={resident.instagramHandle}
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
          <div className={css.formGroup3}>
            <div className={css.formGroup}>
              <label htmlFor="looking-for">How many more roomates do you need?:<span className={css.required}>*</span></label>
              <input
                type="number"
                id="looking-for"
                value={postingFormData.numSeek}
                onChange={(e) => setPostingFormData({ ...postingFormData, numSeek: e.target.value })}
                placeholder="e.g. 7"
                required
              />
            </div>
            {location === 'offcampus' ? (
              <>
                <div className={css.formGroup}>
                  <label htmlFor="address">Street Address:</label>
                  <input
                    type="text"
                    id="address"
                    value={postingFormData.address}
                    onChange={(e) => setPostingFormData({ ...postingFormData, address: e.target.value })}
                    placeholder="e.g. Foster Street"
                  />
                </div>

                <div className={css.formGroup}>
                  <label htmlFor="rent">Monthly Rent:</label>
                  <input
                    type="number"
                    id="rent"
                    value={postingFormData.rent}
                    onChange={(e) => setPostingFormData({ ...postingFormData, rent: e.target.value })}
                    placeholder="e.g. 1500"
                  />
                </div>
                <div className={css.formGroup}>
                  <label htmlFor="utilities">Utilities:</label>
                  <select
                    id="utilities"
                    value={postingFormData.utilities}
                    onChange={(e) => setPostingFormData({ ...postingFormData, utilities: e.target.value })}
                  >
                    <option value="" disabled hidden>Select One</option>
                    <option value="included">Included</option>
                    <option value="not-included">Not Included</option>
                  </select>
                </div>
                <div className={`${css.formGroup} ${css.dateGroup}`}>
                  <div className={css.dateGroupFields}>
                    <label htmlFor="start-date" className={css.startDate}>Start Date:</label>
                    <input
                      type="date"
                      id="start-date"
                      value={postingFormData.startDate}
                      onChange={(e) => setPostingFormData({ ...postingFormData, startDate: e.target.value })}
                    />
                  </div>
                  <div className={css.dateGroupFields}>
                    <label htmlFor="end-date" className={css.endDate}>End Date:</label>
                    <input
                      type="date"
                      id="end-date"
                      value={postingFormData.endDate}
                      onChange={(e) => setPostingFormData({ ...postingFormData, endDate: e.target.value })}
                    />
                  </div>
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
              <input type="file" id="upload-images" multiple onChange={(e) => setFiles(e.target.files)}/>
            </div>
          </div>
          <button type="submit" className={css.submitButton}>Submit</button>
        </form>
        {errorMessage && <h2 className={css.errorMessage}>{errorMessage}</h2>} {/* render not signed-in error message here, if necessary. TODO: make this look nicer */}
      </div>
    </div>
  );
};

export default PostingForm;
