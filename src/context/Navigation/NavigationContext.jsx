import React, { createContext, useState, useEffect} from "react";
import { useLocation } from "react-router-dom";

// Create the context
export const NavigationContext = createContext();

const NavigationProvider = ({ children }) => {
    const location = useLocation();
    const [previousLocation, setPreviousLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(location.pathname + location.search); // set currentLocation to the path when the component mounts

    useEffect(() => {
        setPreviousLocation(currentLocation); // Store full path (including query params) as previousLocation
        setCurrentLocation(location.pathname + location.search); //Update currentLocation with full URL
    }, [location]);

    return (
        <NavigationContext.Provider value={{ previousLocation, currentLocation }}>
            {children}
        </NavigationContext.Provider>
    );
};

export default NavigationProvider;