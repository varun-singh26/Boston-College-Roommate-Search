import React from 'react';
import PostingForm from '../Homepage/PostingForm';
import css from "../../styles/Homepage/Form.module.css"

const createPostingLandingSplash = () => {

    return (
        <main className={css.customPostContainer}>
            <div className={css.customPagePostingFormContainer}>
                <PostingForm />
            </div>
        </main>
    );

};
export default createPostingLandingSplash;