import React from "react";
import { Link } from "react-router-dom";

const Comment = ({ user: { username, id }, content }) => {
  return (
    <div className="comment card">
      <div className="post-top card-top">
        <div className="post-info-top">
          <Link to={`user/${id}`} className="post-user">
            {" "}
            {username}{" "}
          </Link>
        </div>
        <pre className="comment-content">{content}</pre>
      </div>
    </div>
  );
};

export default Comment;
