import React, { useState } from "react";
import TopPost from "./TopPost";
import BottomOffCampus from "./BottomOffCampus";
import css from "./styles/Post.module.css"

const OffCampusPost = ({ post, onShowMoreClick}) => {
    //By default isEditing takes the value false, unless otherwise specified

    return (
      <div className={css.post}>
        <TopPost 
          status={post.status || ""} // Defaults to empty string if undefined
          postID={post.id}
          adminID={post.adminContact?.uid}
        />
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