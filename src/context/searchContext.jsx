import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

//why is formData constant?
const SearchProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        "class-year": 0,
        "housing-aim": 0,
        "number-of-people-in-search-group": 0,
        "preferred-dorm": ""
    });

    const [listingLocation, setListingLocation] = useState("");

    //TODO: How does the below code work?
    return (
        <SearchContext.Provider value={{ formData, setFormData, listingLocation, setListingLocation}} >
            {children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;