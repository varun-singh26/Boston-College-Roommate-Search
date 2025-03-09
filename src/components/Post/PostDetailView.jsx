import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { db } from '../../config/firestore.jsx';
import { doc, getDoc } from "firebase/firestore";
import { useLocation } from 'react-router-dom';
import BackButton from '../Navigation/BackButton.jsx';
import updateStatus from './helperFunctions/updateStatus.js';
import fetchPingsNumber from './helperFunctions/fetchPingsNumber.js';
import PingInterestButton from '../Pings/PingInterestButton.jsx';
import css from "./styles/PostDetailView.module.css"




const PostDetailView = () => {
  const [posting, setPosting] = useState(null);
  const [adminDetails, setAdminDetails] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image in carousel

  // For changing/displaying status of posting
  const [currentStatus, setCurrentStatus] = useState("");
  const {currentUser} = useContext(AuthContext);  

  // Get the id of the posting from the URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  // For displaying the number of groups interested in this posting
  const [pingsCount, setPingsCount] = useState(0);

  console.log("posting:", posting);
  console.log("adminDetails:", adminDetails);

  // When component first mounts, fetch the posting details and the number of pings for this post
  useEffect(() => {
    const getPosting = async () => {
      const docRef = doc(db, "postings", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPosting({ id: docSnap.id, ...docSnap.data() });
      }
    };

    const callFetchPingsNumber = async () => {
      const count = await fetchPingsNumber(id);
      setPingsCount(count);
    };

    if (id) {
      getPosting();
      callFetchPingsNumber();
    }
  }, [id]); // Dependency array ensures that posting details and ping number are refetched if id changes


  // Fetch admin details only after `posting` is set
  useEffect(() => {
    const getAdminDetails = async (uid) => {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setAdminDetails(userSnap.data());
      }
    };

    if (posting?.adminContact?.uid) {
      getAdminDetails(posting.adminContact.uid);
    }
  }, [posting]); // This effect only runs when `posting` is updated

  
  console.log(posting)

  if (!posting) return <div>Loading...</div>;

  
  const images = posting.imageUrls || []; //List of image URLs

  // If posting is oncampus, automatically make image of dorm the first image
  if (posting.listingLocation === "oncampus" && posting.dorm) {
    const dormImage = `/assets/oncampus/${posting.dorm}.jpg`;
    if (!images.includes(dormImage)) {
      images.unshift(dormImage); // Prepend dorm image src if not already in the list
    }
  }

  const hasMultipleImages = images.length > 1;

  // Navigate through images in carousel
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }

 if (posting.listingLocation === "oncampus") {
    return (
        <main className={css.container}>
          <div className={css.backButton}>
            <BackButton />
          </div>
          <div className={css.detailView}>
            <div className={css.infoAndImage}>

              {/* Show the total number of groups interested in this posting */}
              <div className='pingCount'>
                <p> <strong>{pingsCount}</strong> other groups have expressed interest in this posting</p>
              </div>

              {/* Show either the dropdown (if admin) or just the status display */}
                <div className={css.statusContainer}>
                  {currentUser && currentUser.uid === posting.adminContact?.uid ? (
                    // If user is admin, show dropdown
                    <div className={css.statusDropdown}>
                      <h3>Set Posting Status:</h3>
                      <select
                        id="statusSelect"
                        value={currentStatus}
                        onChange={(e) => updateStatus(e.target.value, currentStatus, setCurrentStatus, posting.id)} // Update status on change
                        className="statusDropdown"
                      >
                        <option value="Unfulfilled">Unfulfilled</option>
                        <option value="Likely Fulfilled">Likely Fulfilled</option>
                        <option value="Fulfilled">Fulfilled</option>
                      </select>
                    </div>
                  ) : (
                    // Otherwise, just show the status text
                    <div className={css.statusDisplay}>
                      <h3>Posting Status:</h3>
                      <h3>{currentStatus ? currentStatus : posting.status}</h3> {/* Since we intialize currentStatus as "", we need to start by displaying the status field from the posting*/}
                                                                                {/* Once a value is selected for currentStatus (ie. currentStatus isn't null, we can display that value instead (although it will be the same 
                                                                                  as the status field of the posting.)) */}
                    </div>
                  )}
                </div>

              <div className={css.info}>
                <div className={css.location}>
                  <img src="../../assets/postings/location.png" alt="Location" />
                  <span>{posting.dorm}</span>
                </div>
              
                <div className={css.numPeople}>
                  <img src="../../assets/postings/group.png" alt="Group" />
                  <span>{posting.aimInteger} Total</span>
                </div>
              
                <div className={css.numPeople}>
                  <img src="../../assets/postings/bullseye.png" alt="Target" />
                  <span>Seeking {posting.curNumSeek} More</span>
                </div>
              </div>

              <div className={css.carousel}>
                {hasMultipleImages && (
                  <button className={css.carouselButton} onClick={handlePrevImage}>&#10094;</button>
                )}  
                <img className={css.postingImage} src={images[currentImageIndex]} alt={`Listing ${currentImageIndex + 1}`} />                                                            
                {hasMultipleImages && (
                  <button className={css.carouselButton} onClick={handleNextImage}>&#10095;</button>
                )} 
              </div>
            </div>

            <div className={css.admin}>
              <span>Contact Group Admin: <strong>{posting.adminContact.name}</strong></span>
              <div className={css.adminContact}>
                  <img src="../../assets/postings/email.png" alt="Email" />
                  <span>{posting.adminContact.email}</span>
              </div>
              <div className={css.adminContact}>
                <img src="../../assets/postings/instagram.png" alt="Instagram" />
                <span>{posting.adminContact.instagramHandle}</span>
              </div>
              {/* <div className={css.adminContact}>
                <img src="../../assets/postings/phone.png" alt="Phone" />
                <span>{posting.adminContact.phoneNumber}</span>
              </div> */}
              <PingInterestButton postID={posting.id} admin={adminDetails} />
            </div>
            <div className={css.members}>
              <span>Current Group Members ({posting.aimInteger - posting.curNumSeek}):</span>
              {posting.members.map((member, index) => (
                <div className={css.member} key={index}>
                  <span>{member.name}</span>
                  <span>{member.academicYear}</span>
                  <div className={css.adminContact}>
                      <img src="../../assets/postings/email.png" alt="Email"></img>
                      <span>{member.email}</span>
                  </div>
                  <div className={css.adminContact}>
                    <img src="../../assets/postings/instagram.png" alt="Instagram" />
                    {member.instagramHandle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      );  
  } else {
      return (
        <main className={css.container}>
          <div className={css.backButton}>
            <BackButton />
          </div>
            <div className={css.detailView}>
              <div className={css.infoAndImage}>

                {/* Show the total number of groups interested in this posting */}
                <div className='pingCount'>
                  <p> <strong>{pingsCount}</strong> other groups have expressed interest in this posting</p>
                </div>

                {/* Show either the dropdown (if admin) or just the status display */}
                <div className={css.statusContainer}>
                  {currentUser && currentUser.uid === posting.adminContact?.uid ? (
                    // If user is admin, show dropdown
                    <div className={css.statusDropdown}>
                      <h3>Set Posting Status:</h3>
                      <select
                        id="statusSelect"
                        value={currentStatus}
                        onChange={(e) => updateStatus(e.target.value, currentStatus, setCurrentStatus, posting.id)} // Update status on change
                        className="statusDropdown"
                      >
                        <option value="Unfulfilled">Unfulfilled</option>
                        <option value="Likely Fulfilled">Likely Fulfilled</option>
                        <option value="Fulfilled">Fulfilled</option>
                      </select>
                    </div>
                  ) : (
                    // Otherwise, just show the status text
                    <div className={css.statusDisplay}>
                      <h3>Posting Status:</h3>
                      <h3>{currentStatus ? currentStatus : posting.status}</h3> {/* Since we intialize currentStatus as "", we need to start by displaying the status field from the posting*/}
                                                                                {/* Once a value is selected for currentStatus (ie. currentStatus isn't null, we can display that value instead (although it will be the same 
                                                                                  as the status field of the posting.)) */}
                    </div>
                  )}
                </div>

                <div className={css.info}>
                    <div className={css.location}>
                        <img src="../../assets/postings/location.png" alt="Location" />
                        <span>{posting.address}</span>
                    </div>
                  <div className={css.numPeople}>
                      <img src="../../assets/postings/group.png" alt="Group" />
                      <span>{posting.aimInteger} Total</span>
                  </div>
                  <div className={css.numPeople}>
                      <img src="../../assets/postings/bullseye.png" alt="Target"></img>
                      <span>Seeking {posting.curNumSeek} More</span>
                  </div>
                  <div className={css.numPeople}>
                      <img src="../../assets/postings/dollar.png" alt="Target"></img>
                      <span>{posting.montlyRent}</span>
                  </div>
                </div>

                {/* image carousel */}
                <div className={css.carousel}>
                  {hasMultipleImages && (
                    <button className={css.carouselButton} onClick={handlePrevImage}>&#10094;</button>
                  )}  
                  <img className={css.postingImage} src={images[currentImageIndex]} alt={`Listing ${currentImageIndex + 1}`} />                                                            
                  {hasMultipleImages && (
                    <button className={css.carouselButton} onClick={handleNextImage}>&#10095;</button>
                  )} 
                </div>
              </div>

              <div className={css.admin}>
                <span>Contact Group Admin:</span>
                <div className={css.adminContact}>
                    <img src="../../assets/postings/email.png" alt="Email" />
                    <span>{posting.adminContact.email}</span>
                </div>
                <div className={css.adminContact}>
                  <img src="../../assets/postings/instagram.png" alt="Instagram" />
                  <span>{posting.adminContact.instagramHandle}</span>
                </div>
                <div className={css.adminContact}>
                  <img src="../../assets/postings/phone.png" alt="Phone" />
                  <span>{posting.adminContact.phoneNumber}</span>
                </div>
                <PingInterestButton postID={posting.id} admin={adminDetails} />
              </div>
              <div className={css.members}>
                <span>Current Group Members ({posting.aimInteger - posting.curNumSeek}):</span>
                {posting.members.map((member, index) => (
                  <div className={css.member} key={index}>
                    <span>{member.name}</span>
                    <span>{member.academicYear}</span>
                    <div className={css.memberEmail}>
                        <img src="../../assets/postings/email.png" alt="Email"></img>
                        <span>{member.email}</span>
                    </div>
                    <div className={css.memberIG}>
                      <img src="../../assets/postings/instagram.png" alt="Instagram" />
                      {member.instagramHandle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        );
    }
};

export default PostDetailView;
