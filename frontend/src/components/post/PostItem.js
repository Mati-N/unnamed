import React, { useState, useEffect, useRef } from "react";
import { useLazyQuery, useMutation, from } from "@apollo/client";
import { LIKED, LIKE } from "../../Queries";
import { Link } from "react-router-dom";
import Liked from "../../../static/frontend/SVG/like.svg";
import Heart from "../../../static/frontend/SVG/heart.svg";
import { useSpring, animated } from "react-spring";

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
        <>
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
          <div className="info-bottom">
            <span className="like">
              <Link to={`/post/${id}`}>
                <svg
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 128 128"
                  className="like-icon"
                >
                  <path
                    className="cls-1"
                    fill="#3b4551"
                    d="M112.97335,11.06168H15.02665c-7.454,0-13.99239,6.9757-13.99239,14.92612V84.28942c0,7.44484,6.01577,13.05865,13.99239,13.05865H61.35251l17.98582,18.20331a4.66276,4.66276,0,0,0,6.63636,0l17.987-18.20331h9.0117c7.97776,0,13.99239-5.61381,13.99239-13.05865V25.9878C126.96574,18.03738,120.42731,11.06168,112.97335,11.06168Zm4.66413,73.22773c0,2.75338-2.512,3.73039-4.66413,3.73039H102.0122A4.663,4.663,0,0,0,98.694,89.40675l-16.0375,16.23108L66.619,89.40675a4.66108,4.66108,0,0,0-3.31818-1.38694H15.02665c-2.15215,0-4.66413-.977-4.66413-3.73039V25.9878c0-2.77388,2.3537-5.59787,4.66413-5.59787h97.94671c2.30929,0,4.66413,2.824,4.66413,5.59787Z"
                  />
                  <path
                    className="cls-2"
                    fill="#2b77c0"
                    d="M89.65271,33.76515H38.34729a3.4981,3.4981,0,1,0,0,6.99619H89.65271a3.4981,3.4981,0,1,0,0-6.99619Z"
                  />
                  <path
                    className="cls-2"
                    fill="#2b77c0"
                    d="M89.65271,50.70678H38.34729a3.4981,3.4981,0,1,0,0,6.99619H89.65271a3.4981,3.4981,0,1,0,0-6.99619Z"
                  />
                  <path
                    className="cls-2"
                    fill="#2b77c0"
                    d="M89.65271,67.64841H38.34729a3.4981,3.4981,0,1,0,0,6.99619H89.65271a3.4981,3.4981,0,1,0,0-6.99619Z"
                  />
                </svg>
              </Link>
              {state.comments > 0 && state.comments}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default PostItem;
