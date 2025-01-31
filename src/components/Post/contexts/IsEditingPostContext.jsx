import React, {createContext, useState} from "react";

export const IsEditingPostContext = createContext();

//Provider Component
const IsEditingPostingsProvider = ({ children }) => {
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [IDEditingPost, setIDEditingPost] = useState(null);

    return (
        <IsEditingPostContext.Provider value = {{isEditingPost, setIsEditingPost, IDEditingPost, setIDEditingPost}} >
            {children}
        </IsEditingPostContext.Provider>
    );
};

export default IsEditingPostingsProvider