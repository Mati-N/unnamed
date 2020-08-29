import React, { lazy } from "react";
const PostItem = lazy(() => import("./PostItem"));

const Posts = ({ posts, self, id }) => {
  console.log(posts);
  return (
    <div>
      {posts.map(({ node }) => (
        <PostItem
          key={node.id}
          {...node}
          likes={node.likers.length}
          comments={node.commentSet.length}
          user_id={self ? id : node.user.id}
          username={self ? "You" : node.user.username}
        />
      ))}
    </div>
  );
};

export default Posts;
