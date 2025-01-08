import React, { useEffect, useState } from 'react';
import { db } from '../../config/firestore.jsx';
import { doc, getDoc } from "firebase/firestore";
import { useLocation } from 'react-router-dom';
import css from "./styles/PostDetailView.module.css"

const PostDetailView = () => {
  const [posting, setPosting] = useState(null);
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

 if (posting.listingLocation === "oncampus") {
    return (
        <div className={css.detailView}>
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
                <img src="../../assets/postings/bullseye.png" alt="Target"></img>
                <span>Seeking {posting.curNumSeek} More</span>
            </div>
        </div>

        {/*This image is currently a placeholder to later be replaced with an image carousel*/}
        <img className={css.imageListing} src="../../assets/oncampus/Vanderslice.jpg" alt="Listing"></img>
        
          <div className={css.admin}>
            <span>Contact Lister:</span>
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
            <span>Current Group Members:</span>
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
      
    }
 else {
    return (
        <div className={css.detailView}>
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

        {/*This image is currently a placeholder to later be replaced with an image carousel*/}
        <img className={css.imageListing} src="../../assets/oncampus/Vanderslice.jpg" alt="Listing"></img>
        
          <div className={css.admin}>
            <span>Contact Lister:</span>
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
            <span>Current Group Members:</span>
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
