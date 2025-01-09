import React, { useContext, useState } from "react";
import { PostingsContext } from '../../context/PostingsContext.jsx';
import OnCampusPost from "../Post/OnCampusPost.jsx";
import OffCampusPost from "../Post/OffCampusPost.jsx";
import { useNavigate } from "react-router-dom";
import css from "../../styles/WelcomeToPostingsPageStyles/WelcomeToPostingsPage.module.css";

const AllPosts = () => {
        const { postings, setPostings } = useContext(PostingsContext);
        console.log(postings);
    
        const [postsToShow, setPostsToShow] = useState(2); // State to control number of posts shown
        const navigate = useNavigate();
    
        // Handler for "Show More"
        const handleShowMore = (id) => {
            navigate(`/detailView?id=${id}`);
        };

        const handleShowMorePosts = () => {
            setPostsToShow(prevPostsToShow => prevPostsToShow + 2); // Show 2 more posts
        };
    
    return (
        <div className={css.postings}>
            {postings.slice(0, postsToShow).map((post) => (
                <div key={post.id}>
                    {post.listingLocation === "oncampus" ? (
                        <OnCampusPost post={post} onShowMoreClick={handleShowMore} />
                    ) : (
                        <OffCampusPost post={post} onShowMoreClick={handleShowMore} />
                    )}
                </div>
            ))}
                {postsToShow < postings.length && (
            <button className={css.showMore} onClick={handleShowMorePosts}>
                SHOW MORE POSTINGS...
            </button>
            )}
        </div>
    )  
}

export default AllPosts;