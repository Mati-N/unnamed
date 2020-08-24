import React, { useState, useContext, useEffect } from "react";
import { SELF_POSTS, SELF_USER } from "../../Queries";
import { useQuery } from "@apollo/client";
import PostItem from "../post/PostItem";
import { Waypoint } from "react-waypoint";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import AuthContext from "../../context/auth/AuthContext";
import AlertContext from "../../context/alert/AlertContext";
import { Link } from "react-router-dom";

const Account = () => {
  const {
    loading: user_loading,
    data: user_data,
    error: user_error,
  } = useQuery(SELF_USER);
  const { loading, data, error, fetchMore } = useQuery(SELF_POSTS);
  const { Logout } = useContext(AuthContext);
  const { removeAlert } = useContext(AlertContext);
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    removeAlert();
  }, []);

  if (loading || !data || user_loading)
    return (
      <div className="spinner">
        <Spinner
          size={50}
          style={{
            margin: "auto",
          }}
        />
      </div>
    );

  if (error || user_error) return `${error}`;

  const more = () => {
    fetchMore({
      query: SELF_POSTS,
      variables: { cursor: data.post.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        setSpin(true);
        const newEdges = fetchMoreResult.post.edges;
        const pageInfo = fetchMoreResult.post.pageInfo;

        if (!previousResult.post.pageInfo.hasNextPage) {
          setSpin(false);
          return previousResult;
        }

        return newEdges.length
          ? {
              post: {
                __typename: previousResult.post.__typename,
                edges: [...previousResult.post.edges, ...newEdges],
                pageInfo,
              },
            }
          : previousResult;
      },
    });
  };

  const { post } = data;
  return (
    <div className="main">
      <div className="account-info">
        <div className="account-info-top">
          <span className="username" style={{ display: "block" }}>
            {user_data.user.username}
          </span>
        </div>
        <div className="info-mini">
          <span className="info">
            Posts
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-chevron-right"
              width="34"
              height="34"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#607D8B"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <polyline points="9 6 15 12 9 18" />
            </svg>{" "}
            {user_data.user.posts.edges.length}
          </span>
          <span className="info">
            Followers
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-chevron-right"
              width="34"
              height="34"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#607D8B"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <polyline points="9 6 15 12 9 18" />
            </svg>{" "}
            {user_data.user.followers.edges.length}
          </span>
        </div>
        <div className="options-container">
          <ul className="options">
            <li className="option">
              <button
                style={{
                  background: "none",
                  border: "none",
                }}
                onClick={Logout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-logout"
                  width="45"
                  height="45"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="#607D8B"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                  <path d="M7 12h14l-3 -3m0 6l3 -3" />
                </svg>{" "}
                Logout
              </button>
            </li>
            <li className="option">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-pencil"
                width="45"
                height="45"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="#607D8B"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
                <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
              </svg>
              <Link to="/password">Change Password</Link>
            </li>
            <li className="option">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-pencil"
                width="45"
                height="45"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="#607D8B"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
                <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
              </svg>
              <Link to="/username">Change Username</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="main">
        {post.edges.map(({ node }) => (
          <PostItem
            key={`${node.id}k`}
            {...node}
            likes={node.likers.length}
            comments={node.commentSet.length}
            user_id={user_data.user.id}
            username="You"
          />
        ))}
        <Waypoint
          onEnter={() => {
            more();
          }}
        >
          <div className="spinner">{spin && <Spinner size={40} />}</div>
        </Waypoint>
      </div>
    </div>
  );
};

export default Account;
