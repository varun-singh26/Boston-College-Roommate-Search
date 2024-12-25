import React from 'react';
import css from "../../styles/Splash.module.css";

const Splash = () => {
  const handleOnCampusClick = () => {
    window.location.hash = '#on-campus';
  };

  const handleOffCampusClick = () => {
    window.location.hash = '#off-campus';
  };

  return (
    <div id="gassonHall" className= {css.container} aria-label="Image of Gasson Hall">
      <img
        src="https://cdn.glitch.global/da9cfe19-f6cb-435e-ae30-d04e66913eee/gassonHall.jpg?v=1731984555342"
        alt="Image of Gasson Hall"
      />
      <div className={css.buttonsContainer}>
        <button onClick={handleOnCampusClick} className={css.onCampus}>
          <img
            src="https://cdn.glitch.global/da9cfe19-f6cb-435e-ae30-d04e66913eee/Vector.png?v=1731997394045"
            alt="lodging clipart"
            className={css.img}
          />
          <p>On-Campus</p>
        </button>
        <button onClick={handleOffCampusClick} className={css.offCampus}>
          <img
            src="https://cdn.glitch.global/da9cfe19-f6cb-435e-ae30-d04e66913eee/VectorWhite.png?v=1732117853774"
            alt="lodging clipart"
            className={css.img}
          />
          <p>Off-Campus</p>
        </button>
      </div>
    </div>
  );
};

export default Splash;
