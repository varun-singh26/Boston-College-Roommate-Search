import React from 'react';
import Stairs from '../../images/backdropImages/MillionDollarStairs.jpeg';
import GassonSring from "../../images/backdropImages/Gasson_Spring.jpeg";
import css from "../../styles/purpose.module.css";

const Title = () => {

    return (
        <div className={css.backdropContainer}>
            <img id="backdropImageTop" className={css.backdropImage} src={GassonSring} alt="BC Gasson Hall in Spring" />
            <p className={css.overlayText}>Welcome to Heights Housing!</p>
        </div>
    );
};

export default Title;