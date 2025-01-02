import React from 'react';
import Splash from './Splash.jsx';
import PostingForm from './PostingForm.jsx';
import css from "../../styles/LandingSplash.module.css"

const LandingSplash = () => {
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