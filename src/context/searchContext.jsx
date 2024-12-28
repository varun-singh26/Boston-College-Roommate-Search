import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

const SearchProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        "class-year": 0,
        "housing-aim": 0,
        "number-of-people-in-search-group": 0,
        "preferred-dorm": ""
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