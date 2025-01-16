import React from 'react';
import Title from './title.jsx';
import Explanation from './explanation.jsx';

const purposeLandingSplash = () => {

    return (

        <div className={CSS.purposeLandingSplashBlock}>
            <div className={CSS.titleBlock}>
                <Title />
            </div>
            <div className={CSS.explanationBlock}>
                <Explanation />
            </div>
        </div>
    );

};
export default purposeLandingSplash;