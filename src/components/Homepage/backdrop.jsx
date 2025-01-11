import React, { useEffect } from 'react';
import css from "../../styles/Splash.module.css";

import stairsImage from '../../images/backdropImages/MillionDollarStairs.jpeg';
import garageImage from '../../images/backdropImages/ParkingGarage.jpeg';
import modLotImage from '../../images/backdropImages/ModLot.jpeg';
import mods from '../../images/backdropImages/Mods.jpeg';
import modsXVandy from '../../images/backdropImages/ModsxVandy.jpeg';
import gasson from '../../images/backdropImages/Gasson.jpeg';

const Backdrop = () => {
  useEffect(() => {
    const images = document.querySelectorAll(`.${css.backdropImage}`);
    let currentIndex = 0;

    function cycleImages() {
      images[currentIndex].classList.remove(css.active);
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add(css.active);
    }

    // Initialize the first image as active
    images[currentIndex].classList.add(css.active);
    const interval = setInterval(cycleImages, 7000);

    console.log(images[currentIndex].className);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="backdrop" className={css.backdrop}>
      <img className={css.backdropImage} src={stairsImage} alt="BC Million Dollar Stairs" />
      <img className={css.backdropImage} src={mods} alt="BC Mods" />
      <img className={css.backdropImage} src={modsXVandy} alt="BC Vandy View from Mods" />
      <img className={css.backdropImage} src={gasson} alt="BC Gasson Hall" />
    </div>
  );
};

export default Backdrop;
