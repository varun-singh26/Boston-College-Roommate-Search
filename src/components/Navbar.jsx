import React, { useState } from "react";
import css from "../styles/Navbar.module.css" 

const Navbar = () => {
    const [menuActive, setMenuActive] = useState(false);

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    return (
        <header>
            <div id="nav">
                <nav className= {css.container}>
                    <img
                        src="https://cdn.glitch.global/35a90707-afbf-469e-b877-030bdb0009b4/mobile-navigation-bar-menu-responsive-ui-512%20copy.png?v=1732911149726"
                        alt="Menu Icon"
                        className= {css.menuIcon}
                        onClick={toggleMenu}
                    />
                    <h2 className= {css.bcrsHeader}>
                        <a href="index.html#gassonhall">
                            <span className= {css.goldLogo}>BC</span>
                            <span className= {css.whiteLogo}>RS</span>
                        </a>
                    </h2>
                    <div className={menuActive ? css.linksMenuActive : css.links}>
                        <p><a href="index.html#gassonhall">Home</a></p>
                        <p><a href="?page=listings">Listings</a></p>
                        <p><a href="?page=about">About</a></p>
                        <p>
                            <a
                                href="https://www.bc.edu/bc-web/offices/studentaffairs/sites/residential-life/living-in-bc-housing/hall-openings-closings.html"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Housing Calendar
                            </a>
                        </p>
                        <p>
                            <a
                                href="https://www.bc.edu/bc-web/offices/studentaffairs/sites/residential-life/living-in-bc-housing.html"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Resources
                            </a>
                        </p>
                        <p><a href="index.html#post">Contact</a></p>
                    </div>
                    <div className= {css.signInContainer}>
                        <a href="?page=signin" className={css.signInLink}>Sign In</a>
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