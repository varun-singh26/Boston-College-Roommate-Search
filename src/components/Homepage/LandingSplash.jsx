import React, {useEffect} from 'react';
import Splash from './Splash.jsx';
import PostingForm from './PostingForm.jsx';
import css from "../../styles/LandingSplash.module.css"
import Swal from 'sweetalert2';

const LandingSplash = () => {
  const isMobile = window.innerWidth < 2000;
  //426

  useEffect(() => {
    if (isMobile) {
      Swal.fire({
        title: 'Mobile Warning',
        text: 'This website is not optimized for mobile devices. Please use a desktop or laptop for the best experience.',
        icon: 'warning',
        confirmButtonText: 'I wish to continue anyway'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("User wishes to continue on mobile");
        }
      });
    }
  })

  return (
    <div id="landing-splash">
      <div className="search-bar">
        <main className={css.container}>
          <Splash />
          <PostingForm />
        </main>
      </div>
    </div>
  );
};

export default LandingSplash;