import React, { lazy } from "react";
import Comment from "./Comment";

const Comments = ({ comments }) => {
  return (
    <>
      {comments.map(({ node }) => (
        <>
          <Comment {...node} />
        </>
      ))}
    </>
  );
};

export default Comments;
