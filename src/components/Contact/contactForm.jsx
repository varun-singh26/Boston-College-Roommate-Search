import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import emailjs from 'emailjs-com';
import css from '../../styles/Contact/contactForm.module.css';

const ContactForm = () => {

    const {currentUser} = React.useContext(AuthContext);
    
    const {userRef, setUserRef} = React.useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                ...formData,
                name: currentUser.displayName,
                email: currentUser.email
            });
        }
    }, [currentUser]);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs.send(
            'service_hy9kivi',  // Replace with your EmailJS service ID
            'template_7uecw1s', // Replace with your EmailJS template ID
            formData,
            'iZVHg8kbHobm-ZXfx' // Replace with your EmailJS public key
        )
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            alert("Message sent successfully!");
        })
        .catch((err) => {
            console.error('FAILED...', err);
            alert("Failed to send message.");
        });

        setFormData({ name: '', email: '', message: '' }); // Clear form after submission
    };



    return (
        <form className={css.form} onSubmit={handleSubmit}>
            <div className={css.basicFields}>
                <input 
                type="text" 
                name="name"
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleChange}
                className={css.input}
                required
                />

                <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={formData.email}
                onChange={handleChange}
                className={css.input} 
                required/>

            </div>
            <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="What would you like to share with us?" 
            className={css.textArea} 
            required/>
            <button type="submit" className={css.submit}>Submit</button>
            <p className={css.message}>If you don't receive a response within 3 business days, please reach out again.</p>
        </form>
    );

};
export default ContactForm;