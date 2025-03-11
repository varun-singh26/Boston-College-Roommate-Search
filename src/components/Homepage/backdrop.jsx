import React, { useEffect } from 'react';
import css from "../../styles/Splash.module.css";

// import stairsImage from '../../../public/images/backdropImages/MillionDollarStairs.jpeg';
// import garageImage from '../../../public/images/backdropImages/Garage.jpeg';
// import modLotImage from '../../../public/images/backdropImages/ModLot.jpeg';
// import mods from '../../../public/images/backdropImages/Mods.jpeg';
// import modsXVandy from '../../../public/images/backdropImages/ModsXVandy.jpeg';
// import gasson from '../../../public/images/backdropImages/Gasson.jpeg';
// import linden from '../../../public/images/backdropImages/Linden_Lane.jpeg';
// import stayer from '../../../public/images/backdropImages/Stayer_Fall.jpeg';
// import gassonSpring from '../../../public/images/backdropImages/Gasson_Spring.jpeg';
// import ninety from "../../../public/images/backdropImages/Ninety.jpeg";
// import Gasson_Quad from "../../../public/images/backdropImages/Gasson_Quad.jpeg";
// import Mods_Sunset from "../../../public/images/backdropImages/Mods_Sunset.jpeg";
// import Ruby from "../../../public/images/backdropImages/Ruby.jpeg";

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
      <img className={css.backdropImage} src="/images/backdropImages/MillionDollarStairs.jpeg" alt="BC Million Dollar Stairs" />
      <img className={css.backdropImage} src="/images/backdropImages/Mods.jpeg" alt="BC Mods" />
      <img className={css.backdropImage} src="/images/backdropImages/ModsxVandy.jpeg" alt="BC Vandy View from Mods" />
      <img className={css.backdropImage} src="/images/backdropImages/Linden_Lane.jpeg" alt="BC Linden Lane" />
      <img className={css.backdropImage} src="/images/backdropImages/Gasson_Spring.jpeg" alt="BC Gasson Hall in Spring" />
      <img className={css.backdropImage} src="/images/backdropImages/Gasson_Quad.jpeg" alt="BC Gasson Quad" />
      <img className={css.backdropImage} src="/images/backdropImages/Ruby.jpeg" alt="BC Ruby Hall" />
    </div>
  );
};

export default Backdrop;
