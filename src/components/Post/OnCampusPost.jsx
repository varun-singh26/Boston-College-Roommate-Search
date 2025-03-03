import React from "react";
import Top from "./TopPost";
import BottomOnCampus from "./BottomOnCampus";
import css from "./styles/Post.module.css"

const OnCampusPost = ({post, onShowMoreClick}) => {
    return (
        <div className={css.post}>
            <Top 
                building={post.dorm}
                status={post.status || ""} // Defaults to empty string if undefined
                postID={post.id}
                adminID={post.adminContact?.uid}
            />
            <BottomOnCampus
                members={post.members}
                curNumSeek={post.curNumSeek}
                dorm={post.dorm}
                totalGroupSize={post.aimInteger}
                id={post.id}
                listingLocation={post.listingLocation}
                onShowMoreClick={onShowMoreClick}
            /> 
        </div>
    );
};

export default OnCampusPost;
