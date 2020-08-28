import React from "react";

const Comment = ({ id, username, content, creation }) => {
  return (
    <div className="comment card">
      <div className="post-top card-top">
        <div className="post-info-top">
          <Link to={`user/${id}`} className="post-user">
            {" "}
            {username}{" "}
          </Link>
          <small className="post-time">
            {timeSince(new Date(creation))} ago{" "}
          </small>
        </div>
        <pre className="comment-content">{content}</pre>
      </div>
    </div>
  );
};

export default Comment;
