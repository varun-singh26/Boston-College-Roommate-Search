import React, { useContext } from "react";
import { SearchContext } from '../../context/searchContext.jsx';
import { IsEditingPostContext } from "../Post/contexts/IsEditingPostContext.jsx";
import { useNavigate } from "react-router-dom";
import OnCampusPost from "../Post/OnCampusPost.jsx";
import OffCampusPost from "../Post/OffCampusPost.jsx";
import PostingForm from "../Homepage/PostingForm.jsx";
import css from "./styles/FilteredPosts.module.css";

const FilteredPosts = ({ filteredPostings }) => {
    const { listingLocation, formData } = useContext(SearchContext);  // Access form data and listingLocation from context
    const {isEditingPost, IDEditingPost} = useContext(IsEditingPostContext); //Destructure from IsEditingPostContext


    const DEBUG_MODE = false;
    if (DEBUG_MODE) {
        console.log("is editing post:", isEditingPost);
        console.log("ID editing post:", IDEditingPost);
    }

    const navigate = useNavigate();

    const handleShowMore = (id) => {
        navigate(`/detailView?id=${id}`);
    };

    // Apply filtering logic based on form data
    const filteredPosts = filteredPostings.filter((post) => {
        //print statements for debugging
        //console.log("checking the following post:", post);

        // First filter based on listingLocation (oncampus or offcampus)

        if (post.listingLocation !== listingLocation) return false;

        // Now filter based on formData (e.g., housingAim, numberPeopleInGroup)
        let isMatch = true;

        if (formData.housingAim !== 0 && formData.housingAim !== post.aimInteger) {
            isMatch = false;
        }

        if (formData.numberPeopleInGroup !== 0 && formData.numberPeopleInGroup !== post.curNumSeek) {
            isMatch = false;
        }

        if (formData.preferredDorm && (formData.preferredDorm).trim().toLowerCase() !== (post.dorm?.trim().toLowerCase() || "")) {
            isMatch = false;
        }

        if (formData.gender && (formData.gender).trim().toLowerCase() !== (post.adminContact?.gender?.trim().toLowerCase() || "")) {
            isMatch = false;
        }

        if (formData.classYear && (formData.classYear).trim().toLowerCase() !== (post.adminContact?.academicYear?.trim().toLowerCase() || "")) {
            isMatch = false;
        }

        return isMatch;
    });

    return (
        <div className={css["posts-container"]}>
          {/* If post modification button is clicked, render posting form. If not, render the filtered posts */}
          {isEditingPost ? <PostingForm id={IDEditingPost}/> :
            filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                    <div key={post.id}>
                        {post.listingLocation === "oncampus" ? (
                            <OnCampusPost post={post} onShowMoreClick={handleShowMore} />
                        ) : (
                            <OffCampusPost post={post} onShowMoreClick={handleShowMore} />
                        )}
                    </div>
                ))
              ) : (
                <p>No posts match your criteria. Reset to see all posts matching your listing preference.</p>
            )
          }
        </div>
    );
};

export default FilteredPosts;