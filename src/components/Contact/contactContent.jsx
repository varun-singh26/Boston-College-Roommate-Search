import React from 'react';
import Form from './contactForm.jsx';
import css from '../../styles/Contact/contact.module.css';

const ContactContent = () => {

    return (
        <div className={css.formContainer}>
            <p className={css.title}>Contact Us</p>
            <p className={css.subtitle}>Any questions, concerns, or recommendations? Please reach out!</p>
            <Form />
        </div>
    );

};
export default ContactContent;