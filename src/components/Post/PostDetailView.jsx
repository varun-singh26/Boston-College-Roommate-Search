import React, { useEffect, useState } from 'react';
import { db } from '../../config/firestore.jsx';
import { doc, getDoc } from "firebase/firestore";
import { useLocation } from 'react-router-dom';
import css from "./styles/PostDetailView.module.css"

const PostDetailView = () => {
  const [posting, setPosting] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image in carousel
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  useEffect(() => {
    const getPosting = async () => {
      const docRef = doc(db, "postings", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPosting({ id: docSnap.id, ...docSnap.data() });
      }
    };

    if (id) {
      getPosting();
    }
  }, [id]);

  console.log(posting)

  if (!posting) return <div>Loading...</div>;

  const images = posting.imageUrls || []; //List of image URLs
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
        <div className={css.detailView}>
          <div className={css.infoAndImage}>
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

            {/* image carousel */}
            <div className={css.imageCarousel}>
              {hasMultipleImages && (
                <button className={css.carouselButton} onClick={handlePrevImage}>&#10094;</button>
              )} {/* &#10094 = HTML entity for left-pointing angle bracket*/}
              <img className={css.postingImage} src={images[currentImageIndex]} alt={`Listing ${currentImageIndex + 1}`} />
              {hasMultipleImages && (
                <button className={css.carouselButton} onClick={handleNextImage}>&#10095;</button>
              )} {/* &#10094 = HTML entity for right-pointing angle bracket*/}
            </div>
          </div>

          <div className={css.admin}>
            <span>Contact Group Admin:</span>
            <div className={css.adminContact}>
                <img src="../../assets/postings/email.png" alt="Email" />
                <span>{posting.adminContact.email}</span>
                {posting.adminContact.phoneNumber && <span> {posting.adminContact.phoneNumber} </span>}
                {posting.adminContact.instagramHandle && <span> {posting.adminContact.instagramHandle} </span>}
            </div>
            <div className={css.adminContact}>
              <img src="../../assets/postings/instagram.png" alt="Instagram" />
              <span>{posting.adminContact.instagramHandle}</span>
            </div>
            <div className={css.adminContact}>
              <img src="../../assets/postings/phone.png" alt="Phone" />
              <span>{posting.adminContact.phoneNumber}</span>
            </div>
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
      );
      
  } else {
      return (
          <div className={css.detailView}>
            <div className={css.infoAndImage}>
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
              <div className={css.imageCarousel}>
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
        );
    }
};

export default PostDetailView;
