import React from 'react';
import ContactContent from './contactContent.jsx';
import css from '../../styles/Contact/contact.module.css';

const contactLandingSplash = () => {

    return (

        <main className={css.contactLandingSplashBlock}>
            <ContactContent />
        </main>
    );

};
export default contactLandingSplash;