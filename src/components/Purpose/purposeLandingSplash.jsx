import React from 'react';
import Title from './title.jsx';
import Explanation from './explanation.jsx';
import css from "../../styles/purpose.module.css"

const purposeLandingSplash = () => {

    return (

        <main className={css.purposeLandingSplashBlock}>
            <div className={css.titleBlock}>
                <Title />
            </div>
            <div className={css.explanationBlock}>
                <Explanation />
            </div>
        </main>
    );

};
export default purposeLandingSplash;