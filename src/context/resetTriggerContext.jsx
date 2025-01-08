import React, {createContext, useState } from "react";

export const ResetTriggerContext = createContext();

const ResetTriggerProvider = ({ children }) => {
    const [resetTrigger, setResetTrigger] = useState(1); //Start with any value

    const toggleResetTrigger = () => {
        setResetTrigger((prev) => prev * -1 ); //Toggle between 1 and -1 
    };

    return (
        <ResetTriggerContext.Provider value={{ resetTrigger, toggleResetTrigger}}>
            {children}
        </ResetTriggerContext.Provider>
    );
};

export default ResetTriggerProvider