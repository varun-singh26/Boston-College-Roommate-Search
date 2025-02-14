import React, { useContext, useState } from "react";
import { PostingsContext } from '../../context/PostingsContext.jsx';
import { SearchContext } from '../../context/searchContext.jsx';
import { IsEditingPostContext } from "../Post/contexts/IsEditingPostContext.jsx";
import { useNavigate } from "react-router-dom";
import OnCampusPost from "../Post/OnCampusPost.jsx";
import OffCampusPost from "../Post/OffCampusPost.jsx";
import PostingForm from "../Homepage/PostingForm.jsx";
import css from "../../styles/WelcomeToPostingsPageStyles/WelcomeToPostingsPage.module.css";

const AllPosts = () => {
    const { formData, setFormData, listingLocation, setListingLocation } = useContext(SearchContext);
    const { postings, setPostings } = useContext(PostingsContext);
    const {isEditingPost, IDEditingPost} = useContext(IsEditingPostContext); //Destructure from IsEditingPostContext

    console.log(postings);
  
    console.log("listing location: ", listingLocation);
  
    const navigate = useNavigate();
  
    // Handler for "Show More"
    const handleShowMore = (id) => {
        navigate(`/detailView?id=${id}`);
    };

    // Filter posts based on listingLocation
    const filteredPosts = postings.filter(post => post.listingLocation === listingLocation);

    return (
        <div className={css.postings}>
            {isEditingPost ? <PostingForm id={IDEditingPost}/> :
                filteredPosts.map((post) => (
                    <div key={post.id}>
                        {post.listingLocation === "oncampus" ? (
                            <OnCampusPost post={post} onShowMoreClick={handleShowMore} />
                        ) : (
                            <OffCampusPost post={post} onShowMoreClick={handleShowMore} />
                        )}
                    </div>
                ))
            }
        </div>
    );  
}

export default AllPosts;
