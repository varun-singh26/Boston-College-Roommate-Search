import React from 'react';
import Splash from './Splash.jsx';
import SearchBar from './SearchBar.jsx'; 
import css from "../../styles/LandingSplash.module.css"

const LandingSplash = () => {
  return (
    <div id="landing-splash">
      <div className="search-bar">
        <main className={css.container}>
          <Splash />
        </main>
      </div>
    </div>
  );
};

export default LandingSplash;