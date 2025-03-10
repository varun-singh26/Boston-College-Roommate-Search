import React from 'react';
import css from "../styles/Footer.module.css" 

const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className= {css.footerQuote}>
        <p>
          <strong>"Heights Housing has successfully matched 21 groups to-date."</strong>
        </p>
        <p> - Heights Housing Team
        </p>
      </div>
      <div className={css.footerDetails}>
        <div className={css.footerColumn}>
          <h4 className ={css.footerColumnH4}>CONTACT DETAILS</h4>
          <p className={css.footerColumnParagraph}> <a href="mailto:team@heightshousing.com"> <strong> team@heightshousing.com </strong> </a></p>
          <div className="social-icons">
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
          <h4 className={css.footerColumnH4}>ADDITIONAL RESOURCES</h4>
          <p className={css.footerColumnParagraph}><a href="https://www.bc.edu/bc-web/offices/studentaffairs/sites/residential-life/living-in-bc-housing/housing-assignments.html#room_selection_process_overview"> <strong>BC General Room Selection Timeline and Info </strong></a> </p>
          <p className={css.footerColumnParagraph}><a href="https://www.bc.edu/bc-web/offices/studentaffairs/sites/residential-life/living-in-bc-housing/bc-residence-halls.html"> <strong>BC Residence Hall Information </strong></a> </p>
        </div>
        {/* <div className={css.footerColumn}>
          <h4 className ={css.footerColumnH4}>OUR PARTNERS</h4> */}
          {/* Add partners once we acquire them*/}
          {/* <p className={css.footerColumnParagraph}></p>
          <p className={css.footerColumnParagraph}></p>
        </div> */}
      </div>
      <div className={css.footerBottoom}>
        <p>&copy; 2025 Heights Housing. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;