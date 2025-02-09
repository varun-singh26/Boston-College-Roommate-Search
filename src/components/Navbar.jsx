import React, { useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
//We want to use Link for internal links of our web app to avoid full page reloads when they are clicked (to preserve any contexts)
//Not having full page reloads means that css and javascript don't have to be rerendered when a Link is clicked
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import image from "../images/logos/heightsHousingVerticalMinimal.jpg"
import css from "../styles/Navbar.module.css";

const Navbar = () => {
  const location = useLocation(); // Provides access to the current location object

  const { userLoggedIn } = useAuth(); //render certain components based on if userLoggedIn is true

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const navbar = document.getElementById("nav");
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // Scrolling down
        navbar.classList.add(css.hidden);
      } else {
        // Scrolling up
        navbar.classList.remove(css.hidden);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array ensures this runs only on mount and unmount


    return (
        <header>
            <div id="nav" className={css.navContainer}>
                <nav className= {css.container}>
                    <div className={css.logoContainer}>
                        <Link to="/" className={css.logoLink}>
                            <img src={image} alt="Heights Housing Logo" className={css.logo}/>
                            {/* <span className= {css.goldLogo}>BC</span>
                            <span className= {css.whiteLogo}>RS</span> */}
                        </Link>
                    </div>
                    <div className={css.links}>
                        <p className={isActive("/") ? css.activeLink : ""}>
                            <Link to="/" className={css.homeLink}>Home</Link>
                        </p>
                        <p className={isActive("/postings") ? css.activeLink : ""}>
                            <Link to= "/postings" className={css.postingsLink}>Search Postings</Link>
                        </p>
                        <p className={isActive("/create-posting") ? css.activeLink : ""}>
                            <Link to= "/create-posting" className={css.postingsLink}>Create Posting</Link>
                        </p>
                        <p className={isActive("/our-purpose") ? css.activeLink : ""}>
                            <Link to= "/our-purpose" className={css.postingsLink}>Our Purpose</Link>
                        </p>

                        <p className={isActive("/contact-us") ? css.activeLink : ""}>
                            <Link to= "/contact-us" className={css.postingsLink}>Contact Us</Link>
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
                    {/* Render this or div or myProfile box depending on if userLoggedin is true */}
                    <div className= {css.profileContainer}>
                        {
                            userLoggedIn ? (
                                <>
                                    <Link to="/myProfile" className={css.profileLink}>My Profile</Link>
                                    <img
                                        src="https://cdn.glitch.global/c7d70598-61bb-4c55-ac66-58662df41931/Profile%20Icon.png?v=1732691728436"
                                        alt="Profile Icon"
                                        className={css.profileImage}
                                    />
                                </>
                            ) : (
                                <>
                                    <Link to="/signIn" className={css.profileLink}>Sign In</Link>
                                    <img
                                        src="https://cdn.glitch.global/c7d70598-61bb-4c55-ac66-58662df41931/Profile%20Icon.png?v=1732691728436"
                                        alt="Profile Icon"
                                        className={css.profileImage}
                                    />
                                </>
                            )
                        }
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;