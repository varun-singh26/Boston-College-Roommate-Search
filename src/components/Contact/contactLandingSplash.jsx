import React from 'react';
import ContactContent from './contactContent.jsx';
import css from '../../styles/Contact/contact.module.css';

const contactLandingSplash = () => {

    return (

        <div className={css.contactLandingSplashBlock}>
            <ContactContent />
        </div>
    );

};
export default contactLandingSplash;