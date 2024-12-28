import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import css from "../styles/Navbar.module.css" 

const Navbar = () => {

    const location = useLocation(); //How does this work?
    const isActive = (path) => location.pathname === path; /*A function */

    //TODO: Why isn't isActive used within the Houding Calendar or Resources links?
    return (
        <header>
            <div id="nav" className={css.navContainer}>
                <nav className= {css.container}>
                    <h2 className= {css.bcrsHeader}>
                        <a href="/">
                            <span className= {css.goldLogo}>BC</span>
                            <span className= {css.whiteLogo}>RS</span>
                        </a>
                    </h2>
                    <div className={css.links}>
                        <p className={isActive("/") ? css.activeLink : ""}>
                            <a href ="/" className={css.homeLink}>Home</a>
                        </p>
                        <p className={isActive("/postings") ? css.activeLink : ""}>
                            <a href = "/postings" className={css.postingsLink}>Postings</a>
                        </p>

                        <p>
                            <a
                                href="https://www.bc.edu/bc-web/offices/studentaffairs/sites/residential-life/living-in-bc-housing/hall-openings-closings.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={css.housingCalendarLink}
                            >
                                Housing Calendar
                            </a>
                        </p>
                        <p>
                            <a
                                href="https://www.bc.edu/bc-web/offices/studentaffairs/sites/residential-life/living-in-bc-housing.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={css.resourcesLink}
                            >
                                Resources 
                            </a>
                        </p>
                    </div>
                    <div className= {css.signInContainer}>
                        <a href="/signin" className={css.signInLink}>Sign In</a>
                        <img
                            src="https://cdn.glitch.global/c7d70598-61bb-4c55-ac66-58662df41931/Profile%20Icon.png?v=1732691728436"
                            alt="Profile Icon"
                            className={css.signInImage}
                        />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;