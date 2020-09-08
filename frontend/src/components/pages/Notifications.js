import React, { useState, lazy } from "react";
import { GET_NOTIFICATIONS } from "../../Queries";
import { useQuery } from "@apollo/client";
import { Waypoint } from "react-waypoint";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
const Offline = lazy(() => import("./Offline"));
import { Link } from "react-router-dom";

const Notifications = () => {
  const { loading, data, error, fetchMore, refetch } = useQuery(
    GET_NOTIFICATIONS
  );
  const [spin, setSpin] = useState(true);

  if (loading || !data)
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

  if (error) {
    return (
      <>
        <Offline />
        <button className="btn btn-teal" onClick={refetch}>
          Refresh
        </button>
      </>
    );
  }

  const more = () => {
    fetchMore({
      query: GET_NOTIFICATIONS,
      variables: { cursor: data.selfNotification.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        setSpin(true);
        if (!previousResult.selfNotification.pageInfo.hasNextPage) {
          setSpin(false);
          return previousResult;
        }
        const newEdges = fetchMoreResult.selfNotification.edges;
        const pageInfo = fetchMoreResult.selfNotification.pageInfo;

        return newEdges.length
          ? {
              selfNotification: {
                __typename: previousResult.selfNotification.__typename,
                edges: [...previousResult.selfNotification.edges, ...newEdges],
                pageInfo,
              },
            }
          : previousResult;
      },
    });
  };

  return (
    <>
      {data.selfNotification.edges.map(({ node }) => {
        {
          switch (node.category) {
            case "new_follow":
              return (
                <div key={node.id} className="notification">
                  <Link to={`user/${node.sender.id}`}>
                    {node.sender.username}
                  </Link>{" "}
                  Followed You!
                </div>
              );
            case "new_like":
              return (
                <div key={node.id} className="notification">
                  <Link to={`user/${node.sender.id}`}>
                    {node.sender.username}
                  </Link>{" "}
                  Liked your post{" "}
                  <Link
                    className="notification-post"
                    to={`post/${node.post.id}`}
                  >
                    {node.post.title}
                  </Link>
                </div>
              );
            case "new_comment":
              return (
                <div key={node.id} className="notification">
                  <Link to={`user/${node.sender.id}`}>
                    {node.sender.username}
                  </Link>{" "}
                  Commented on your post{" "}
                  <Link
                    className="notification-post"
                    to={`post/${node.comment.post.id}`}
                    className="notification-post-comment"
                  >
                    {node.comment.post.title}
                  </Link>
                  <Link
                    className="notification-post"
                    to={`post/${node.post.id}/#${node.comment.id}`}
                  >
                    {node.comment.title.substr(0, 60)}
                  </Link>
                </div>
              );
          }
        }
      })}
      <Waypoint onEnter={more}>
        <div className="spinner">{spin && <Spinner size={40} />}</div>
      </Waypoint>
    </>
  );
};

export default Notifications;
