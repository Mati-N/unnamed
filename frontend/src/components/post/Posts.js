import React, { lazy } from "react";
// import { Waypoint } from "react-waypoint"; // Waypoint removed as pagination is simplified
import { ImpulseSpinner as Spinner } from "react-spinners-kit"; // Spinner might still be used by parent
import NoData from "../SVG/NoData.svg";
const PostItem = lazy(() => import("./PostItem"));

// Props related to old pagination (more, spin, refetch) might be unused or need re-evaluation by parent.
// For now, this component will just render the 'posts' it receives.
const Posts = ({
  posts, // Expected to be an array of post objects: [ { id, title, user: { profile_image ... } ... } ]
  self, // To determine if the post belongs to the logged-in user
  username, // Logged-in user's username (if self is true)
  id, // Logged-in user's ID (if self is true)
  imagePath, // Logged-in user's profile_image (if self is true) - naming should be profile_image ideally from parent
  // spin, // Spinner state might be controlled by parent based on loading new 'posts' array
  // refetch, // Refetching mechanism would be handled by parent
}) => {
  if (!posts) { // Guard against undefined or null posts prop
    return (
      <div className="spinner-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}> {/* Or some other loading/error state */}
        <Spinner size={50} />
      </div>
    );
  }

  return (
    <div className="posts">
      {posts.length === 0 && (
        <div className="w-75 h-75 m-auto d-flex align-items-center justify-content-center flex-column">
          <NoData className="w-50 h-50" preserveAspectRatio />
          <p>No posts found.</p> {/* Added a message for clarity */}
        </div>
      )}
      {/* Updated mapping: directly map over 'posts' */}
      {posts.map((post) => ( 
        <PostItem
          key={`${post.id}p`} 
          {...post} // Spread the post object
          user_id={self ? id : post.user.id}
          username={self ? username : post.user.username}
          show_comment={false} 
          // Use profile_image from post.user.
          // The 'imagePath' prop for 'self' posts should ideally be 'profile_image' from the parent.
          imagePath={self ? imagePath : post.user.profile_image}
        />
      ))}
      {/* Waypoint and refetch button removed as pagination is simplified.
          Loading more data will be handled by the parent component if necessary. */}
    </div>
  );
};

export default Posts;
