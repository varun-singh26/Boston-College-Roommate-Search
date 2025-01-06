import React from "react";
import Top from "./TopPost";
import BottomOnCampus from "./BottomOnCampus";

const OnCampusPost = ({post, onShowMoreClick}) => {
    return (
        <div className="post">
            <BottomOnCampus
                members={post.members}
                curNumSeek={post.curNumSeek}
                dorm={post.dorm}
                totalGroupSize={post.aimInteger}
                id={post.id}
                listingLocation={post.listingLocation}
                onShowMoreClick={onShowMoreClick}
            />  {/*Pass a ref to BottomOnCampus */}
        </div>
    );
};

export default OnCampusPost;
