import React, { useContext, useState, useEffect } from 'react';
import { IsEditingPostContext } from '../Post/contexts/IsEditingPostContext.jsx';
import { AuthContext } from "../../context/authContext/index";
import {db} from "../../config/firestore.jsx";
import {collection, addDoc, setDoc, updateDoc, doc, arrayUnion, getDoc} from "firebase/firestore";
import { Link } from 'react-router-dom';
import { uploadFiles } from "../../config/storageUpload.js";
import css from "../../styles/Homepage/Form.module.css"
import Swal from 'sweetalert2'; //library for alert messages

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
  const [location, setLocation] = useState('oncampus');
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
    rentType: '',
    utilities: '',
    startDate: '',
    endDate: '',
    adminName: '',
    adminAcademicYear: '',
    adminPhoneNumber: '',
    adminInstagramHandle: '',
    adminEmail: '',
    adminuid: '',
    status: 'Unfulfilled',
    imageUrls: []
  });

  //additional state variables
  //state for posting document reference
  const [postingRefState, setPostingRefState] = useState(null);
  //state for posting document
  const [postingDocState, setPostingDocState] = useState(null);

  console.log("id of post being edited: ", id );


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
      setLocation(postingDoc.data()?.listingLocation ?? "oncampus")


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
        rentType: postingDoc.data()?.rentType ?? "",
        utilities: postingDoc.data()?.utilities ?? "",

        startDate: firestoreDateToString(postingDoc.data()?.rentPeriod?.start), //Convert object to ISO string
        endDate: firestoreDateToString(postingDoc.data()?.rentPeriod?.end),

        sublet: postingDoc.data()?.sublet ?? "",
        numSeek: postingDoc.data()?.curNumSeek,

        status: postingDoc.data()?.status ?? "Unfulfilled",

        imageUrls: postingDoc.data()?.imageUrls ?? [] //retrieve post image URLs, if any
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
      //Auto-fill admin fields of posting form with user information (if user is signed in)
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
    console.log("location (oncampus is default): ", location);
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

    if (location === "offcampus" && (!postingFormData.startDate || !postingFormData.endDate)) {
        errors.push("Please specify the start and end dates for the rental/sublet!");
    }

    if (location === "oncampus" && !postingFormData.dorm) {
        errors.push("Please select a target dorm!");
    }

    if (!postingFormData.adminEmail && !postingFormData.adminPhoneNumber) {
        errors.push("Please provide either admin phone number or email (or both)!");
    }

    if (postingFormData.rent && !postingFormData.rentType) {
        errors.push("Please specify whether the rent indicated is the total group or per person rent!");
    }


    
    if (errors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        html: errors.join("<br>"),
        confirmButtonText: "OK",
      });
      return false;
    }
    return true;
  };
  

  // Creates Array from uploaded FileList, and sets Files
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(newFiles); // Ensure that we only store new file objects, not URLs
  
  };

  // Handle form submission to cloud firestore:
  const handleSubmit = async(e) => {
    e.preventDefault();

    setErrorMessage(""); //clear previous error message, if any

    //if user isn't signed in, use SweetAlert to display error message. Stop executing the handleSubmit function
    if (!userLoggedIn) {
      Swal.fire({
        icon: "error",
        title: "Not Signed In",
        text: "You must be signed in to submit a posting.",
        confirmButtonText: "OK",
      });
      //setErrorMessage("You must be have an account to submit a posting for others to view and reach out to. Sign-in or create a new account with us");
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
        gender: residents[0].gender,
        instagramHandle: postingFormData.adminInstagramHandle,
        phoneNumber: postingFormData.adminPhoneNumber,
        uid: postingFormData.adminuid
    }

    //ChatGPT suggestion:
    // ** Use passed ID, or Generate Posting ID for New Listings**
    let postingId = id ? id : doc(collection(db, "postings")).id;

    console.log("Uploading files:", files);
    const uploadedImageUrls = await uploadFiles(files, postingId); //Upload ony new files to storage

    // **Merge existing image URLs with the new ones**
    const updatedImageUrls = [...postingFormData.imageUrls, ...uploadedImageUrls];

    // **Store Data in Firestore**
    const postingData = {
      address: location === "offcampus" ? postingFormData.address : null,
      adminContact: adminContactInfo,
      aimInteger: residents.length + parseInt(postingFormData.numSeek, 10),
      curGroupSize: residents.length,
      curNumSeek: parseInt(postingFormData.numSeek, 10),
      dorm: location === "oncampus" ? postingFormData.dorm : null,
      listingLocation: location,
      members: members,
      monthlyRent: postingFormData.rent || null,
      rentPeriod: location === "offcampus" ? period : null,
      utilities: postingFormData.utilities,
      status: postingFormData.status,
      imageUrls: updatedImageUrls, // Store both new & existing image URLs in Firestore
    };

    try {
      // Show Loading Alert while Firestore operation executes
      Swal.fire({
        title: "Uploading..",
        text: "Please wait while we save your posting information.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Showing loading animation
        },
      });

      if (id) {
        setIsEditingPost(true); //not functionally necessary, but sets the state variable to true

        // **Update Existing Posting**
        await updateDoc(postingRefState, postingData);
        console.log("Updated posting:", postingRefState.id);

        // ✅ Update SweetAlert to Success After Completion
        Swal.fire({
          icon: "success",
          title: "Posting Updated!",
          text: "Your posting has been successfully updated and can be viewed or edited in your profile page.",
          confirmButtonColor: "#501315", //Maroon button color
          confirmButtonText: "OK"
        })
      } else {
        // **Create New Posting**
        const postingDocRef = doc(db, "postings", postingId);
        await setDoc(postingDocRef, postingData);
        console.log("Created new posting with ID:", postingDocRef.id);

        // **Update User's Administered Postings**
        await updateDoc(userRef, {
          administeredPostings: arrayUnion(postingId)
        });
        console.log(`Added posting to user's (uid: ${userRef.id}) administered postings`);

        // ✅ Update SweetAlert to Success After Completion
        Swal.fire({
          icon: "success",
          title: "Posting Submitted!",
          text: "Your posting has been successfully submitted and can be viewed or edited in your profile page.",
          confirmButtonColor: "#501315", //Maroon button color
          confirmButtonText: "OK"
        });
      }

    } catch (error) {
      console.error("Error saving posting:", error);

      // ❌ Update SweetAlert to Error Message
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "An error occurred while uploading your posting information. Please try again.",
        confirmButtonColor: "#501315", //Maroon button color
        confirmButtonText: "OK",
      });
    }
    finally { //runs immediately after try block finishes (success or error), even while the alert is visible.
      setIsEditingPost(false);  //Indicates that post modification has completed (to close PostingForm component in MyProfile page or Postings page)
    }

  }

  const handleCancel = () => {
    // If cancel button is clicked, the PostingForm component isn't rendered anymore in the 
    // corresponding component
    setIsEditingPost(false);
  }

  if (document.getElementById("rent") != null) {
   document.getElementById("rent").addEventListener("blur", function() {
    if (this.value.trim() !== "") {
      this.value = this.value.replace(/\D/g, "");
      this.value = `$${this.value}`;
    }
  });
    document.getElementById("rent").addEventListener("focus", function() {
      if (this.value.trim() !== "" && this.value.startsWith("$")) {
        this.value = this.value.slice(1);
      }
    });
  };

  const utilities = document.getElementById("utilities");
  if (utilities && utilities.value === "Select One") {
      utilities.value = "";
  }
  
  return (
    <div className={css.container}>
      {/* Only render the posting from header if we're on the homepage */}
      {!id && <header className={css.headerTextContainer}>
        <h2 className={css.headerText}> Can't find the right housing group using our search?</h2>  
        <h2> Make your own <span className={css.keyword}>Posting</span> and have potential roommates find you: </h2>
      </header>}
      {!currentUser &&
        <h2 className={css.warning}>Make sure to <Link to="/signIn" className={css.warningLink}>sign-in</Link> before completing the form to save your posting.</h2>
      }  
      <div className={css.formHolder}>
        <form className={css.postForm} onSubmit={handleSubmit}>
          {/* Only render cancel button if not on home page*/}
          {id != null && <button className="cancel" onClick={handleCancel}>Cancel</button>}
          <div className={`${css.formGroup} ${css.formLocationSelector}`}>
            <label htmlFor="location">Location:</label>
            <select id="location" value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="oncampus">On-Campus</option>
              <option value="offcampus">Off-Campus</option>
            </select>

            <div className={css.requiredExplanation}>
              <div className={css.requiredAdmin}>*</div>
              <div>- Indicates a required input field</div>
            </div>

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
                    <div className={`${css.requiredInputAdmin} ${css.requiredAcademicYear}`}>
                      <select
                        value={postingFormData.adminAcademicYear}
                        aria-label="Admin Academic Year"
                        onChange={(e) => setPostingFormData({...postingFormData, adminAcademicYear: e.target.value} )}
                        required
                      >
                        <option value="" disabled hidden>
                          Rising...
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
                          className={css.otherGender}
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
                    {/* Remove admin phone number field (For now)
                    <input
                      type="text"
                      id="admin-phone-number"
                      value={postingFormData.adminPhoneNumber}
                      onChange={(e) => setPostingFormData({ ...postingFormData, adminPhoneNumber: e.target.value })}
                      placeholder="Phone Number"
                    /> 
                      */}
                  </div>
                )}
              </>
              <label>Additional Group Members:</label>
              {residents.slice(1).map((resident, index) => (
                <div key={`member-${index}`} className={css.residentRow}>
                  
                  <div className={css.requiredInput}>
                    <input
                      type="text"
                      id="name"
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
                      id="academicYear"
                      value={resident.academicYear}
                      aria-label={`Academic year of Resident ${index + 1}`}
                      onChange={(e) => handleResidentChange(index + 1, 'academicYear', e.target.value)}
                      required
                    >
                      <option value="" disabled hidden>
                        Rising...
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
                      id="gender"
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
                        id="customGender"
                        value={resident.customGender || ''}
                        placeholder="Specify Gender"
                        onChange={(e) => handleResidentChange(index + 1, 'customGender', e.target.value)}
                        required
                      />
                    )}
                    <div className={css.required}>*</div>
                  </div>
                  {/* Email isn't a required input field for group members (but is for admin)*/}
                  {/*<div className={css.requiredInput}> */}
                    <input
                      type="text"
                      id="email"
                      value={resident.email || ''}
                      placeholder="BC Email"
                      aria-label={`Email of Resident ${index + 1}`}
                      onChange={(e) => handleResidentChange(index + 1, 'email', e.target.value)}
                      /*required*/
                    />
                    {/*<div className={css.required}>*</div> */}
                  {/*</div> */}
                  <input
                    type="text"
                    id="instagramHandle"
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
                  <label htmlFor="address">Street Address:<span className={css.required}></span></label>
                  <input
                    type="text"
                    id="address"
                    value={postingFormData.address}
                    onChange={(e) => setPostingFormData({ ...postingFormData, address: e.target.value })}
                    placeholder="e.g. Foster Street"
                  />
                </div>

                <div className={`${css.formGroup} ${css.rentGroup}`}>
                  <label htmlFor="rent">Monthly Rent:<span className={css.required}></span></label>
                  <div className={css.rentInputGroup}>
                  <input
                    type="text"
                    id="rent"
                    value={postingFormData.rent}
                    onChange={(e) => setPostingFormData({ ...postingFormData, rent: e.target.value })}
                    placeholder="e.g. 1500"
                  />
                    <select
                      id="rentType"
                      value={postingFormData.rentType}
                      onChange={(e) => setPostingFormData({ ...postingFormData, rentType: e.target.value })}
                    >
                      <option value="" disabled hidden>Select One</option>
                      <option value="total">Total</option>
                      <option value="per_person">Per Person</option>
                  </select>
                  </div>
                </div>

                <div className={css.formGroup}>
                  <label htmlFor="utilities">Utilities:<span className={css.required}></span></label>
                  <select
                    id="utilities"
                    value={postingFormData.utilities}
                    onChange={(e) => setPostingFormData({ ...postingFormData, utilities: e.target.value })}
                  >
                    <option value="">Select One</option>
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
            <div className={`${css.formGroup} ${css.uploadGroup}`}>
              <div className={css.uploadLabelContainer}>
              <label htmlFor="upload-images" className={css.uploadLabel}>
                Upload Images: 
              </label>
              <label htmlFor="upload-images" className={css.uploadSubLabel}>
                Upload a group image, or something that represents your group! (JPG or PNG only)
              </label>
              </div>
              <input type="file" id="upload-images" multiple onChange={handleFileChange}/>
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
