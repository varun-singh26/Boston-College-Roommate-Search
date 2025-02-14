import React, {createContext, useState, useContext, useEffect} from "react";
import { useLocation } from "react-router-dom";
import GetPostings from "../helperFunctions/GetPostings.jsx"; 
import { IsEditingPostContext } from "../components/Post/contexts/IsEditingPostContext.jsx";


//NOTE: if the context changes frequently, it can trigger unecessary re-renders across the components subscribing to it.
//Create Context
export const PostingsContext = createContext();


//Provider Component
const PostingsProvider = ({ children }) => {

    const location = useLocation();
    const [postings, setPostings] = useState([]);
    const {isEditingPost, isDeletingPost} = useContext(IsEditingPostContext); //Destructure from IsEditingPostContext



    useEffect(() => {
        const updatePostings = async () => {
            const newestPostings = await GetPostings();
            setPostings(newestPostings);
        };
        updatePostings();
    }, [location.pathname, isEditingPost, isDeletingPost]); //refetches data and updates postings whenever url path changes, or isEditingPost or isDeletingPost changes

    return (
        <PostingsContext.Provider value = {{postings, setPostings}} >
            {children}
        </PostingsContext.Provider>
    );
};

export default PostingsProvider;