import React from 'react';
import PostingForm from '../Homepage/PostingForm';
import css from "../../styles/Homepage/Form.module.css"

const createPostingLandingSplash = () => {

    return (
        <div className={css.customPagePostingFormContainer}>
            <PostingForm />
        </div>
    );

};
export default createPostingLandingSplash;