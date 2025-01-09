import React, { useState } from "react";
import { useLocation } from "react-router-dom";
//We want to use Link for internal links of our web app to avoid full page reloads when they are clicked (to preserve any contexts)
//Not having full page reloads means that css and javascript don't have to be rerendered when a Link is clicked
import { Link } from "react-router-dom";
import css from "../styles/Navbar.module.css" 

const Navbar = () => {

    const location = useLocation(); //provides access to the current location object (ie. location.pathname, location.search)
                                    //useLocation dynamically updates whenever the route changes (which changes when the path changes)
                                    //Allows us to update this component based on the current route
    const isActive = (path) => location.pathname === path; 

    return (
        <header>
            <div id="nav" className={css.navContainer}>
                <nav className= {css.container}>
                    <h2 className= {css.bcrsHeader}>
                        <Link to="/">
                            <span className= {css.goldLogo}>BC</span>
                            <span className= {css.whiteLogo}>RS</span>
                        </Link>
                    </h2>
                    <div className={css.links}>
                        <p className={isActive("/") ? css.activeLink : ""}>
                            <Link to="/" className={css.homeLink}>Home</Link>
                        </p>
                        <p className={isActive("/postings") ? css.activeLink : ""}>
                            <Link to= "/welcomeToPostings" className={css.postingsLink}>Postings</Link>
                        </p>

                        {/* <p>
                            <a
                                href="https://www.bc.edu/bc-web/offices/studentaffairs/sites/residential-life/living-in-bc-housing/hall-openings-closings.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={css.housingCalendarLink}
                            >
                                Housing Calendar
                            </a>
                        </p> */}
                        {/* <p>
                            <a
                                href="https://www.bc.edu/bc-web/offices/studentaffairs/sites/residential-life/living-in-bc-housing.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={css.resourcesLink}
                            >
                                Resources 
                            </a>
                        </p> */}
                    </div>
                    <div className= {css.signInContainer}>
                        <Link to="/signIn" className={css.signInLink}>Sign In / Make an Account</Link>
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