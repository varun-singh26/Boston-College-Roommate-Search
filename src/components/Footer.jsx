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
          <div className={css.contactContainer}>
          <img
            src="/images/logos/gmail_svg.svg"
            alt="Gmail Logo"
            className={css.socialIconImages}
            />
          <p className={css.footerColumnParagraph}> 
            <a href="mailto:team@heightshousing.com" target="_blank" rel="noreferrer"> 
              <strong> team@heightshousing.com </strong> 
            </a>
          </p>
          </div>
          <div className={css.contactContainer}>
          <img
                    src="/images/logos/Instagram_logo_2016.svg.webp"
                    alt="Instagram Logo"
                    className={css.socialIconImages}
                  />
            <p className={css.footerColumnParagraph}>
                <a href="https://www.instagram.com/heightshousing/" target="_blank" rel="noreferrer"> 
                  <strong> @heightshousing </strong> 
                </a>
            </p>
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