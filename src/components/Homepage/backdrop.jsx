import React, { useEffect } from 'react';
import css from "../../styles/Splash.module.css";

import stairsImage from '../../images/backdropImages/MillionDollarStairs.jpeg';
import garageImage from '../../images/backdropImages/ParkingGarage.jpeg';
import modLotImage from '../../images/backdropImages/ModLot.jpeg';
import mods from '../../images/backdropImages/Mods.jpeg';
import modsXVandy from '../../images/backdropImages/ModsxVandy.jpeg';
import gasson from '../../images/backdropImages/Gasson.jpeg';
import linden from '../../images/backdropImages/Linden_Lane.jpeg';
import stayer from '../../images/backdropImages/Stayer_Fall.jpeg';
import gassonSpring from '../../images/backdropImages/Gasson_Spring.jpeg';
import ninety from "../../images/backdropImages/90.jpeg";
import Gasson_Quad from "../../images/backdropImages/Gasson_Quad.jpeg";
import Mods_Sunset from "../../images/backdropImages/Mods_Sunset.jpeg";
import Ruby from "../../images/backdropImages/Ruby.jpeg";

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
      <img className={css.backdropImage} src={linden} alt="BC Linden Lane" />
      <img className={css.backdropImage} src={gassonSpring} alt="BC Gasson Hall in Spring" />
      <img className={css.backdropImage} src={Gasson_Quad} alt="BC Gasson Quad" />
      <img className={css.backdropImage} src={Ruby} alt="BC Ruby Hall" />
    </div>
  );
};

export default Backdrop;
