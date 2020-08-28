import React, { lazy } from "react";
const PostItem = lazy(() => import("./PostItem"));

const Posts = ({ posts }) => {
  return (
    <div>
      {posts.map(({ node }) => (
        <PostItem
          key={node.id}
          {...node}
          likes={node.likers.length}
          comments={node.commentSet.length}
          user_id={node.user.id}
          username={node.user.username}
        />
      ))}
    </div>
  );
};

export default Posts;
