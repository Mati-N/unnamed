import React, { lazy } from "react";
import { Waypoint } from "react-waypoint";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
const PostItem = lazy(() => import("./PostItem"));
const Box = lazy(() => import("../SVG/Box.svg"));

const Posts = ({ posts, self, username, id, more, spin, refetch }) => {
  return (
    <div className="posts">
      {posts.length == 0 && (
        <div className="empty-box-holder">
          <Box />
        </div>
      )}
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
        <div className="refetch-and-spinner">
          <button className="btn btn-teal" onClick={() => refetch()}>
            Refetch
          </button>
          {spin && (
            <div className="spinner">
              <Spinner size={40} />
            </div>
          )}
        </div>
      </Waypoint>
    </div>
  );
};

export default Posts;
