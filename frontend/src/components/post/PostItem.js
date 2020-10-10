import React, { useState, useEffect, useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import { LIKED, LIKE, CREATE_COMMENT, GET_POST } from "../../Queries";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import Avatar from "@material-ui/core/Avatar";
import FavoriteTwoToneIcon from "@material-ui/icons/FavoriteTwoTone";
import CommentTwoToneIcon from "@material-ui/icons/CommentTwoTone";
import Button from "@material-ui/core/Button";
import FavoriteIcon from "@material-ui/icons/Favorite";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1.1),
  },
}));

const PostItem = ({
  text,
  title,
  username,
  id,
  likeCount,
  createdAt,
  user_id,
  commentCount,
  show_comment,
  imagePath,
  liked,
}) => {
  const initialState = {
    done: false,
    hasMore: false,
    height: "32vh",
    loading: true,
    expand: false,
  };

  const classes = useStyles();
  const [comment, setComment] = useState("");
  const self = useRef(null);

  const [likePost] = useMutation(LIKE);
  const [addComment] = useMutation(CREATE_COMMENT);
  const [state, setState] = useState(initialState);

  const expandText = useSpring({
    to: {
      height: state.expand ? `${self.current.scrollHeight}px` : "230px",
    },
    from: {
      height: !state.expand ? "230px" : `${self.current.scrollHeight}px`,
    },
    duration: "0.9s",
  });

  useEffect(() => {
    const hasMore = self.current.scrollHeight > self.current.clientHeight;
    if (hasMore) {
      self.current.style.maxHeight = "none";
      self.current.style.height = "230px";
    }
    setState({
      ...state,
      hasMore,
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
    likePost({
      variables: { post_id: id },
      update: (cache, { data: { likePost } }) => {
        if (cache) {
          cache.writeFragment({
            id: `PostNode:${id}`,
            fragment: gql`
              fragment Post on PostNode {
                liked
                likeCount
              }
            `,
            data: {
              likeCount: likePost.post.likeCount,
              liked: likePost.post.liked,
            },
          });
        }
      },
    }).catch((error) => console.log(error));
  };

  const add_comment = (e) => {
    e.preventDefault();
    addComment({
      variables: { id, comment },
      update: (cache, { data }) => {
        if (cache) {
          cache.writeFragment({
            id: `PostNode:${id}`,
            fragment: gql`
              fragment Post on PostNode {
                commentCount
              }
            `,
            data: {
              commentCount: data.createComment.comment.post.commentCount,
            },
          });
          let { postComments } = cache.readQuery({
            query: GET_POST,
            variables: { id },
          });
          if (postComments) {
            const newData = {
              ...postComments,
              edges: [
                {
                  __typename: "CommentNodeConnection",
                  node: data.createComment.comment,
                },
                ...postComments.edges,
              ],
            };
            cache.writeQuery({
              query: GET_POST,
              variables: { id },
              data: {
                postComments: newData,
              },
            });
          }
        }
      },
    });
  };

  return (
    <div className="post card">
      <div className="post-top card-top">
        <div className="post-info-top">
          <Link to={`/user/${user_id}`} className="post-user">
            <Avatar
              alt={username}
              src={imagePath}
              variant="circle"
              style={{
                margin: "0.4em",
              }}
            >
              {username.substring(0, 1)}
            </Avatar>{" "}
            {username}{" "}
          </Link>
          <small className="post-time">
            {timeSince(new Date(createdAt))} ago{" "}
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
          <div className="info-bottom">
            <Button
              className={"w-auto d-block" + classes.button}
              variant="outlined"
              startIcon={
                liked ? (
                  <FavoriteIcon color="secondary" />
                ) : (
                  <FavoriteTwoToneIcon />
                )
              }
              onClick={(e) => {
                e.target.disabled = "true";
                like();
                e.target.disabled = "false";
              }}
            >
              {likeCount > 0 && likeCount}
            </Button>
            <Link to={`/post/${id}`}>
              <Button
                className={"w-auto d-block" + classes.button}
                variant="outlined"
                color="primary"
                startIcon={<CommentTwoToneIcon />}
              >
                {commentCount > 0 && commentCount}
              </Button>
            </Link>
          </div>

          {show_comment && (
            <span className="comment-form">
              <form onSubmit={add_comment} className="form-group comment-form">
                <input
                  className="form-control"
                  type="text"
                  id="comment"
                  name="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <button className="btn btn-teal" type="submit" id="btn">
                  Comment
                </button>
              </form>
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default PostItem;
