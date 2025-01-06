import React from "react";
import { useNavigate } from "react-router-dom";
import OnCampusPost from "../Post/OnCampusPost.jsx";
import OffCampusPost from "../Post/OffCampusPost.jsx";

const FilteredPosts = ({filteredPostings}) => {
    const navigate = useNavigate();

    const handleShowMore = (id) => {
        navigate(`/detailView?id=${id}`)
    }

    return (
        <div className="posts-container">
          {/*Render each post with template*/}
          {filteredPostings.map((post) => (
            <div key={post.id}>
            {post.listingLocation === "oncampus" ? (
                <OnCampusPost post={post} onShowMoreClick={handleShowMore} />
            ) : (
                <OffCampusPost post={post} onShowMoreClick={handleShowMore} />
            )}
            </div>
          ))}
        </div>
    );
};

export default FilteredPosts;
