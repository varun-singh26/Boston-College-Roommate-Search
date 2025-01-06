import React from "react";
import TopPost from "./TopPost";
import BottomOffCampus from "./BottomOffCampus";

const OffCampusPost = ({ post, onShowMoreClick }) => {
    return (
      <div className="post">
        {/* <Top image={post.image} /> TODO: Add image field to documents*/}
        <BottomOffCampus
          members={post.members}
          curNumSeek={post.curNumSeek}
          address={post.address}
          totalGroupSize={post.aimInteger}
          id={post.id}
          listingLocation={post.listingLocation}
          onShowMoreClick={onShowMoreClick} 
        />
      </div>
    );
  };
  
  export default OffCampusPost;