import React, {useEffect, useContext, useState} from 'react';
import { AuthContext } from '../../context/authContext';
import updateStatus from './helperFunctions/updateStatus';
import fetchPingsNumber from './helperFunctions/fetchPingsNumber';
import css from "./styles/TopPost.module.css";

// Provide a default value for building props if it is not passed in
const Top = ({ building = "", status, postID, adminID }) => {
  const [currentStatus, setCurrentStatus] = useState(status || "Unfulfilled");
  const [pingsCount, setPingsCount] = useState(0);

  //destructure currentUser from AuthContext
  const {currentUser} = useContext(AuthContext);  

  // Fetch the number of pings for this post when component mounts
  useEffect(() => {
    if (!postID) return; // Ensure postID is valid
    const callFetchPingsNumber = async () => {
      const count = await fetchPingsNumber(postID);
      setPingsCount(count);
    };
    callFetchPingsNumber();
  }, [postID]); // Dependency array ensures it updates when postID changes


  return (
    <section className={css.top}>

    {/* Show either the dropdown (if admin) or just the status display */}
    <div className={css.statusContainer}>
      {currentUser && currentUser.uid === adminID ? (
        // If user is admin, show dropdown
        <div className={css.statusDropdown}>
          <h3>Set Status:</h3>
          <select
            id="statusSelect"
            value={currentStatus}
            onChange={(e) => updateStatus(e.target.value, currentStatus, setCurrentStatus, postID)} // Update status on change
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
          <p>Posting Status:</p>

          <h3>{currentStatus}</h3>
        </div>
      )}
    </div>

    <div className='pingCount'>
      <p> <strong>{pingsCount}</strong> other groups have expressed interest in this posting</p>
    </div>

    {/* Always show Building Image */}
    {building && (
      <div
        className={css.top}
        style={{
          backgroundImage: `url('/assets/oncampus/${building}.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
    )}
  </section>
  );
};

export default Top;