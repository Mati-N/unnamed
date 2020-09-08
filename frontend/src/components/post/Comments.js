import React, { lazy } from "react";
import Comment from "./Comment";

const Comments = ({ comments }) => {
  return (
    <>
      {comments.map(({ node }) => (
        <>
          <Comment key={`com${node.id}`} id={`${node.id}c`} {...node} />
        </>
      ))}
    </>
  );
};

export default Comments;
