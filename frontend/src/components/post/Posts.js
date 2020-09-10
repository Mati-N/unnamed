import React, { lazy } from "react";
import { Waypoint } from "react-waypoint";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
const PostItem = lazy(() => import("./PostItem"));

const Posts = ({ posts, self, username, id, more, spin }) => {
  return (
    <div>
      {posts.map(({ node }) => (
        <PostItem
          key={`${node.id}p`}
          {...node}
          user_id={self ? id : node.user.id}
          username={self ? username : node.user.username}
          show_comment={false}
        />
      ))}
      <Waypoint onEnter={more}>
        <div className="spinner">{spin && <Spinner size={40} />}</div>
      </Waypoint>
    </div>
  );
};

export default Posts;
