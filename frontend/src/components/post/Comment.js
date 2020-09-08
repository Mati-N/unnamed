import React from "react";
import { Link } from "react-router-dom";

const Comment = ({ user: { username, id: user_id }, content, id }) => {
  return (
    <div className="comment card" id={`${id}c`}>
      <div className="post-top card-top">
        <div className="post-info-top">
          <Link to={`/user/${user_id}`} className="post-user">
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
