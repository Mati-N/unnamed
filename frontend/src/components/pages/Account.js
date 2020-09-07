import React, { useState, useContext, useEffect, lazy } from "react";
import { SELF_POSTS, SELF_USER } from "../../Queries";
import { useQuery } from "@apollo/client";
import { Waypoint } from "react-waypoint";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import AuthContext from "../../context/auth/AuthContext";
import AlertContext from "../../context/alert/AlertContext";
import { Link } from "react-router-dom";
const Posts = lazy(() => import("../post/Posts"));
import ForwardPointer from "../SVG/ForwardPointer.svg";
import LogoutSVG from "../SVG/Logout.svg";
import Edit from "../SVG/Edit.svg";

const Account = () => {
  const {
    loading: user_loading,
    data: user_data,
    error: user_error,
  } = useQuery(SELF_USER);
  const { loading, data, error, fetchMore } = useQuery(SELF_POSTS);
  const { doLogout: Logout, user } = useContext(AuthContext);
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
      variables: { cursor: data.selfPost.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        setSpin(true);
        console.log(fetchMoreResult);
        const newEdges = fetchMoreResult.selfPost.edges;
        const pageInfo = fetchMoreResult.selfPost.pageInfo;

        if (!previousResult.selfPost.pageInfo.hasNextPage) {
          setSpin(false);
          return previousResult;
        }

        return newEdges.length
          ? {
              selfPost: {
                __typename: previousResult.selfPost.__typename,
                edges: [...previousResult.selfPost.edges, ...newEdges],
                pageInfo,
              },
            }
          : previousResult;
      },
    });
  };

  const { selfPost: post } = data;
  return (
    <>
      <div className="account-info">
        <div className="account-info-top">
          <span className="username" style={{ display: "block" }}>
            {user_data.selfUser.username}
          </span>
        </div>
        <div className="info-mini">
          <span className="info">{user_data.selfUser.postCount} Posts</span>
          <span className="info">
            {user_data.selfUser.followerCount} Followers
          </span>
        </div>
        <ul className="options">
          <li className="option">
            <button
              style={{
                background: "none",
                border: "none",
              }}
              onClick={Logout}
            >
              <LogoutSVG className="svg" /> Logout
            </button>
          </li>
          <li className="option">
            <Edit className="svg" />
            <Link to="/password">Change Password</Link>
          </li>
          <li className="option">
            <Edit className="svg" />
            <Link to="/username">Change Username</Link>
          </li>
        </ul>
      </div>
      <div className="main">
        <Posts posts={post.edges} self={true} id={user} username="You" />
        <Waypoint
          onEnter={() => {
            more();
          }}
        >
          <div className="spinner">{spin && <Spinner size={40} />}</div>
        </Waypoint>
      </div>
    </>
  );
};

export default Account;
