import React, { lazy } from "react";
const PostItem = lazy(() => import("./PostItem"));

const Posts = ({ posts, self, username, id }) => {
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
    </div>
  );
};

export default Posts;
