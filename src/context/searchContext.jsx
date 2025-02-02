import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

const SearchProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        "classYear": "",
        "housingAim": 0,
        "numberPeopleInGroup": 0,
        "preferredDorm": "",
        "gender": "",
        // "preferredStreet": "",
        "sublet": ""
    });

    const [listingLocation, setListingLocation] = useState("");

    //Children are all components that have access to the [Search] context which includes the formData var, listingLocation var, and their respective setters.
    //In our case, the children are all the components of our App, from top to bottom.
    return (
        <SearchContext.Provider value={{ formData, setFormData, listingLocation, setListingLocation}} >
            {children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;