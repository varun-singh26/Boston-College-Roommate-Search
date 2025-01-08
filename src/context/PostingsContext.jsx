import React, {createContext, useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import GetPostings from "../helperFunctions/GetPostings.jsx"; 
import {collection, getDocs, doc} from "firebase/firestore";


//NOTE: if the context changes frequently, it can trigger unecessary re-renders across the components subscribing to it.
//Create Context
export const PostingsContext = createContext();

//Provider Component
const PostingsProvider = ({ children }) => {

    const location = useLocation();
    const [postings, setPostings] = useState([]);

    useEffect(() => {
        const updatePostings = async () => {
            const newestPostings = await GetPostings();
            setPostings(newestPostings);
        };
        updatePostings();
    }, [location.pathname]); //Updates postings whenever url path changes

    return (
        <PostingsContext.Provider value = {{postings, setPostings}} >
            {children}
        </PostingsContext.Provider>
    );
};

export default PostingsProvider;