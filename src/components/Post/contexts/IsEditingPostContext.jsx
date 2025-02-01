import React, {createContext, useState} from "react";

export const IsEditingPostContext = createContext();

//Provider Component
const IsEditingPostingsProvider = ({ children }) => {
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [IDEditingPost, setIDEditingPost] = useState(null);
    const [isDeletingPost, setIsDeletingPost] = useState(false);
    const [isChangingBookmarkStatus, setIsChangingBookmarkStatus] = useState(false);


    return (
        <IsEditingPostContext.Provider value = {{isEditingPost, setIsEditingPost, IDEditingPost, setIDEditingPost, isDeletingPost, setIsDeletingPost, isChangingBookmarkStatus, setIsChangingBookmarkStatus}} >
            {children}
        </IsEditingPostContext.Provider>
    );
};

export default IsEditingPostingsProvider