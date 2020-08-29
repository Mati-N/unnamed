import React, { useState, useEffect, useRef, lazy } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { LIKED, LIKE } from "../../Queries";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";

const Liked = lazy(() => import("../SVG/Like.svg"));
const Heart = lazy(() => import("../SVG/Heart.svg"));
const Comments = lazy(() => import("../SVG/Comments.svg"));

const PostItem = ({
  text,
  title,
  username,
  id,
  likes,
  creation,
  user_id,
  comments,
}) => {
  const initialState = {
    done: false,
    likes,
    hasMore: false,
    height: "32vh",
    loading: false,
    comments,
    expand: false,
  };
  const [liked] = useLazyQuery(LIKED, {
    variables: { post_id: id },
    onCompleted: (data) => {
      setState({ ...state, liked: data.liked });
    },
  });

  const [hovered, setHovered] = useState(false);
  const self = useRef(null);

  const [likePost] = useMutation(LIKE);
  const [state, setState] = useState(initialState);

  const expandText = useSpring({
    to: {
      maxHeight: state.expand ? `${self.current.scrollHeight}px` : "230px",
      height: state.expand ? `${self.current.scrollHeight}px` : "230px",
    },
    from: {
      maxHeight: !state.expand ? "230px" : `${self.current.scrollHeight}px`,
      height: !state.expand ? "230px" : `${self.current.scrollHeight}px`,
    },
    duration: "1s",
  });

  useEffect(() => {
    liked();
    setState({
      ...state,
      hasMore: self.current.scrollHeight > self.current.clientHeight,
      loading: false,
    });
  }, []);

  const timeSince = (date) => {
    let seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
      const flr = Math.floor(interval);
      return Math.floor(interval) + (flr === 1 ? " year" : " years");
    }

    interval = seconds / 2592000;
    if (interval > 1) {
      const flr = Math.floor(interval);
      return flr + (flr === 1 ? " month" : " months");
    }

    interval = seconds / 86400;
    if (interval > 1) {
      const flr = Math.floor(interval);
      return Math.floor(flr) + (flr === 1 ? " day" : " days");
    }

    interval = seconds / 3600;
    if (interval > 1) {
      const flr = Math.floor(interval);
      return flr + (flr === 1 ? " hour" : " hours");
    }

    interval = seconds / 60;
    if (interval > 1) {
      const flr = Math.floor(interval);
      return flr + (flr == 1 ? " minute" : " minutes");
    }
    return "Seconds";
  };

  const like = () => {
    likePost({ variables: { post_id: id } })
      .catch((error) => console.log(error))
      .then(({ data: { likePost } }) => {
        setState({
          ...state,
          liked: !state.liked,
          likes: likePost.post.likers.length,
        });
      });
  };

  return (
    <div className="post card">
      <div className="post-top card-top">
        <div className="post-info-top">
          <Link to={`user/${user_id}`} className="post-user">
            {" "}
            {username}{" "}
          </Link>
          <small className="post-time">
            {timeSince(new Date(creation))} ago{" "}
          </small>
        </div>
        <h5 className="post-title">{title}</h5>
      </div>
      <animated.pre
        ref={self}
        className={`post-text`}
        style={state.hasMore ? expandText : {}}
      >
        {text}
        {state.hasMore && (
          <button
            className="more"
            onClick={() => {
              setState({ ...state, expand: !state.expand });
            }}
          >
            {state.expand ? "less" : "more"}
          </button>
        )}
      </animated.pre>
      {!state.loading && (
        <div className="info-bottom">
          <span
            className="like"
            onClick={() => {
              like();
            }}
            onMouseOver={() => setHovered(true)}
            onMouseOut={() => setHovered(false)}
          >
            {!hovered ? (
              state.liked ? (
                <Liked className="like-icon" />
              ) : (
                <Heart className="like-icon" />
              )
            ) : !state.liked ? (
              <Liked className="like-icon" />
            ) : (
              <Heart className="like-icon" />
            )}
            {state.likes > 0 && state.likes}
          </span>
          <span className="like">
            <Link to={`/post/${id}`} className="like-icon">
              <Comments />
            </Link>
            {state.comments > 0 && state.comments}
          </span>
          {/*<span>
            <form className="cfrm"  method="post">
              <div className="form-group comment-form">
                <input class="form-control" type="text" id="comment" name="text" />
                  <button class="btn btn-outline-primary" type="submit" id="btn" disabled>Comment</button>
                </div>
            </form>
          </span>*/}
        </div>
      )}
    </div>
  );
};

export default PostItem;
