import React from 'react';
import Title from './title.jsx';
import Explanation from './explanation.jsx';
import css from "../../styles/purpose.module.css"

const purposeLandingSplash = () => {

    return (

        <main className={CSS.purposeLandingSplashBlock}>
            <div className={CSS.titleBlock}>
                <Title />
            </div>
            <div className={CSS.explanationBlock}>
                <Explanation />
            </div>
        </main>
    );

};
export default purposeLandingSplash;