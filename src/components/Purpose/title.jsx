import React from 'react';
import Stairs from '../../images/backdropImages/MillionDollarStairs.jpeg';
import css from "../../styles/purpose.module.css";

const Title = () => {

    return (
        <div className={css.backdropContainer}>
            <img className={css.backdropImage} src={Stairs} alt="BC Million Dollar Stairs" />
            <p className={css.overlayText}>Who is BCRS?</p>
        </div>
    );
};

export default Title;