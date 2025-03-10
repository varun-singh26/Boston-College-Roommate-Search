import React, { useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
//We want to use Link for internal links of our web app to avoid full page reloads when they are clicked (to preserve any contexts)
//Not having full page reloads means that css and javascript don't have to be rerendered when a Link is clicked
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext/index.jsx";
import image1 from "../../images/logos/heightsHousingVerticalMinimal.jpg"
import image2 from "../../images/logos/heightsHousingHorizontalSmall.jpg"
import image3 from "../../images/logos/heightsHousingVertical.jpg"
import menu from "./menu_icon.svg";
import menuHover from "./menu_icon_hover.svg";
import css from "./Navbar.module.css";

const Navbar = () => {
  const location = useLocation(); // Provides access to the current location object

  const { userLoggedIn } = useAuth(); //render certain components based on if userLoggedIn is true

  console.log("Navbar - userLoggedIn: ", userLoggedIn);

  const isActive = (path) => location.pathname === path;

  const [hoverLogo, setHoverLogo] = useState(false);

  const [hoverMenu, setHoverMenu] = useState(false);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 950); // Initialize correctly

  const [isDropDown, setIsDropDown] = useState(() => window.innerWidth < 886);

  const isNotChrome = !/Chrome/.test(navigator.userAgent) || /Edg|OPR|Brave/.test(navigator.userAgent);
  const isMobileOrTablet = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Toggle image manually on touch (for mobile users)
  const handleTouch = () => {
    setHoverLogo((prev) => !prev); // Toggle the hover state on touch
    setHoverMenu((prev) => !prev); // Toggle the hover state on touch
  };

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

    const handleResize = () => {
        setIsMobile(() => window.innerWidth < 950); // ✅ Fix: Functional update ensures state updates correctly
        setIsDropDown(() => window.innerWidth < 886);
      };

    const handleTouchOutside = (event) => {
        if (!event.target.closest(`.${css.logoContainer}`)) {
          setHoverLogo(false); // Reset the hover state when tapping outside
          setHoverMenu(false); // Reset the hover state when tapping outside
        }
      };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    document.addEventListener("touchstart", handleTouchOutside);

    return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("touchstart", handleTouchOutside);
      };

  }, []); // Empty dependency array ensures this runs only on mount and unmount

    if (!isDropDown) {
        return (
            <header>
                <div id="nav" className={css.navContainer}>
                    <nav className= {css.container}>
                        <div className={css.logoContainer}
                        onMouseEnter={() => setHoverLogo(true)} // Change image on hover
                        onMouseLeave={() => setHoverLogo(false)} // Revert image when mouse leaves
                        onTouchStart={handleTouch} // Mobile touch support
                        >
                            <Link to="/" className={css.logoLink}>
                                <img src={hoverLogo ? image3 : image1} // Switch images dynamically
                                alt="Heights Housing Logo" 
                                className={css.logo}
                                />
                            </Link>
                        </div>

                        <div className={`${css.links} ${css.navLinks}`}>
                            <p className={isActive("/") ? css.activeLink : ""}>
                                <Link to="/" className={css.homeLink}>Home</Link>
                            </p>
                            {isMobile && <p className={css.bar}>|</p>}
                            <p className={isActive("/postings") ? css.activeLink : ""}>
                                <Link to= "/postings" className={css.postingsLink}>Search Postings</Link>
                            </p>
                            {isMobile && <p className={css.bar}>|</p>}
                            <p className={isActive("/create-posting") ? css.activeLink : ""}>
                                <Link to= "/create-posting" className={css.postingsLink}>Create Posting</Link>
                            </p>
                            {isMobile && <p className={css.bar}>|</p>}
                            <p className={isActive("/our-purpose") ? css.activeLink : ""}>
                                <Link to= "/our-purpose" className={css.postingsLink}>Our Purpose</Link>
                            </p>
                            {isMobile && <p className={css.bar}>|</p>}
                            <p className={isActive("/contact-us") ? css.activeLink : ""}>
                                <Link to= "/contact-us" className={css.postingsLink}>Contact Us</Link>
                            </p>
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
    } else {
        return (
            <header>
                <div id="nav" className={css.navContainer}>
                    <nav className= {css.dropDownContainer}>
                        <div className={`${css.logoContainer} ${css.logoContainerDropDown}`}
                        onMouseEnter={() => setHoverLogo(true)} // Change image on hover
                        onMouseLeave={() => setHoverLogo(false)} // Revert image when mouse leaves
                        onTouchStart={handleTouch} // Mobile touch support
                        >
                            <Link to="/" className={css.logoLink}>
                                <img src={hoverLogo ? image3 : image1} // Switch images dynamically
                                alt="Heights Housing Logo" 
                                className={css.logo}
                                />
                            </Link>
                        </div>

                        <div className={css.dropDown}
                            onMouseEnter={() => setHoverMenu(true)} // Change image on hover
                            onMouseLeave={() => setHoverMenu(false)}
                            onTouchStart={handleTouch}
                        >
                            {/* <img className={css.menuIcon} src={menu} alt="Menu Icon" /> */}
                            <div className={css.menuIconContainer}
                            onMouseEnter={() => setHoverMenu(true)} // Change image on hover
                            onMouseLeave={() => setHoverMenu(false)} // Revert image when mouse leaves
                            onTouchStart={handleTouch} // Mobile touch support
                            >
                                <img src={hoverMenu ? menuHover : menu} // Switch images dynamically
                                alt="Menu Icon" 
                                className={css.menuIcon}
                                />
                            </div>
                            <div className={css.dropDownContent}
                                onMouseEnter={() => setHoverMenu(true)} // Change image on hover
                                onMouseLeave={() => setHoverMenu(false)}
                                onTouchStart={handleTouch}
                            >
                                <div className={`${css.linksDropDown} ${css.links}`}>
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

                                    <div className= {css.profileContainerDropDown}>
                                        {
                                            userLoggedIn ? (
                                                <div className={css.profileLinkDropDown}>
                                                    <Link to="/myProfile" className={css.profileLink}>My Profile</Link>
                                                    <img
                                                        src="https://cdn.glitch.global/c7d70598-61bb-4c55-ac66-58662df41931/Profile%20Icon.png?v=1732691728436"
                                                        alt="Profile Icon"
                                                        className={css.profileImage}
                                                    />
                                                </div>
                                            ) : (
                                                <div className={css.profileLinkDropDown}>
                                                     <Link to="/signIn" className={css.profileLink}>Sign In</Link>
                                                    <img
                                                        src="https://cdn.glitch.global/c7d70598-61bb-4c55-ac66-58662df41931/Profile%20Icon.png?v=1732691728436"
                                                        alt="Profile Icon"
                                                        className={css.profileImage}
                                                    />
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        );
    };
};

export default Navbar;