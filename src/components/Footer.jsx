import React from 'react';
import css from "../styles/Footer.module.css" 

const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className= {css.footerQuote}>
        <p>
          "The best thing about having a roommate is always having someone to blame when food goes missing." - Anonymous BC Senior
        </p>
      </div>
      <div className={css.footerDetails}>
        <div className={css.footerColumn}>
          <h4 className ={css.footerColumnH4}>CONTACT DETAILS</h4>
          <p className={css.footerColumnParagraph}><strong>Tel:</strong> +1 800-000-0000</p>
          <p className={css.footerColumnParagraph}><strong>Mov:</strong> +1 800-000-0000</p>
          <p className={css.footerColumnParagraph}><strong>E-mail:</strong> bcrs@bc.edu</p>
          <div className="social-icons">
            <a href="#" className={css.socialIconLinks}>
              <img
                src="https://cdn.glitch.global/c7d70598-61bb-4c55-ac66-58662df41931/Facebook_icon_2013.svg.png?v=1732317204022"
                alt="Facebook"
                className={css.socialIconImages}
              />
            </a>
            <a href="#" className={css.socialIconLinks}>
              <img
                src="https://cdn.glitch.global/c7d70598-61bb-4c55-ac66-58662df41931/Instagram_logo_2016.svg.webp?v=1732317202177"
                alt="Instagram"
                className={css.socialIconImages}
              />
            </a>
          </div>
        </div>
        <div className={css.footerColumn}>
          <h4 className={css.footerColumnH4}>MENU</h4>
          <p className={css.footerColumnParagraph}>Home</p>
          <p className={css.footerColumnParagraph}>Listings</p>
          <p className={css.footerColumnParagraph}>BC Housing Calendar</p>
          <p className={css.footerColumnParagraph}>Resources</p>
        </div>
        <div className={css.footerColumn}>
          <h4 className ={css.footerColumnH4}>OUR PARTNERS</h4>
          <p className={css.footerColumnParagraph}>Division of Student Affairs</p>
          <p className={css.footerColumnParagraph}>Office of Residential Life</p>
        </div>
      </div>
      <div className={css.footerBottoom}>
        <p>&copy; 2024 Boston College Roommate Search. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;