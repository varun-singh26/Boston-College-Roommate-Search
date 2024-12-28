import React, {createContext, useState} from "react";

//NOTE: if the context changes frequently, it can trigger unecessary re-renders across the components subscribing to it.
//Create Context
export const FilteredPostingsContext = createContext();

//Provider Component
const FilteredPostingsProvider = ({ children }) => {
    const [filteredPostings, setFilteredPostings] = useState([]); //initally filteredPostings is empty

    return (
        <FilteredPostingsContext.Provider value = {{ filteredPostings, setFilteredPostings}} >
            {children}
        </FilteredPostingsContext.Provider>
    );
};

export default FilteredPostingsProvider