import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationContext } from "../../context/Navigation/NavigationContext.jsx";
import css from "./BackButton.module.css"

const BackButton = () => {
    const navigate = useNavigate();
    const { previousLocation, currentLocation } = useContext(NavigationContext);

    //Print statements for debugging
    console.log("previous path:", previousLocation);
    console.log("current path:", currentLocation);


    return (
        <>
            {previousLocation && (
                <button 
                    className={css.backButton}
                    onClick={() => navigate(previousLocation)}
                >
                    ← Back
                </button>
            )}
        </>
    );
};

export default BackButton;