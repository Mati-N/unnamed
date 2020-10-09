import React, { useState, lazy } from "react";
import { GET_NOTIFICATIONS, READ_NOTIFICATION } from "../../Queries";
import { useQuery, useMutation } from "@apollo/client";
import { Waypoint } from "react-waypoint";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import { Link } from "react-router-dom";
import MarkunreadMailboxTwoToneIcon from "@material-ui/icons/MarkunreadMailboxTwoTone";
import Button from "@material-ui/core/Button";

const Offline = lazy(() => import("./Offline"));
const Box = lazy(() => import("../SVG/Box.svg"));

const Notifications = () => {
  const { loading, data, error, fetchMore, refetch } = useQuery(
    GET_NOTIFICATIONS,
    {
      pollInterval: 600,
    }
  );
  const [readNotif] = useMutation(READ_NOTIFICATION);
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
      <Button
        className="mx-auto w-25"
        variant="outlined"
        color="secondary"
        startIcon={<MarkunreadMailboxTwoToneIcon />}
        onClick={() => readNotif()}
      >
        Read All
      </Button>
      {data.selfNotification.edges.length == 0 && (
        <div className="w-75 h-75 m-auto d-flex align-items-center justify-content-center flex-column">
          <NoData width="90%" height="90%" preserveAspectRatio />
        </div>
      )}
      {data.selfNotification.edges.map(({ node }) => {
        {
          switch (node.category) {
            case "new_follow":
              return (
                <div
                  key={node.id}
                  className={`notification ${node.read && "notification-read"}`}
                >
                  <Link
                    to={`user/${node.sender.id}`}
                    onClick={() =>
                      node.read
                        ? false
                        : readNotif({ variables: { id: node.id } })
                    }
                  >
                    {node.sender.username}
                  </Link>{" "}
                  Followed You!
                </div>
              );
            case "new_like":
              return (
                <div
                  key={node.id}
                  className={`notification ${node.read && "notification-read"}`}
                >
                  <Link
                    to={`user/${node.sender.id}`}
                    onClick={() =>
                      node.read
                        ? false
                        : readNotif({ variables: { id: node.id } })
                    }
                  >
                    {node.sender.username}
                  </Link>{" "}
                  Liked your post{" "}
                  <Link
                    className="notification-post"
                    to={`post/${node.post.id}`}
                    onClick={() =>
                      node.read
                        ? false
                        : readNotif({ variables: { id: node.id } })
                    }
                  >
                    {node.post.title}
                  </Link>
                </div>
              );
            case "new_comment":
              return (
                <div
                  key={node.id}
                  className={`notification ${node.read && "notification-read"}`}
                >
                  <Link
                    to={`user/${node.sender.id}`}
                    onClick={() =>
                      node.read
                        ? false
                        : readNotif({ variables: { id: node.id } })
                    }
                  >
                    {node.sender.username}
                  </Link>{" "}
                  Commented on your post "
                  <Link
                    className="notification-post"
                    to={`post/${node.comment.post.id}`}
                    className="notification-post-comment"
                    onClick={() =>
                      node.read
                        ? false
                        : readNotif({ variables: { id: node.id } })
                    }
                  >
                    {node.comment.post.title}
                  </Link>
                  "
                  <Link
                    className="notification-post"
                    to={`post/${node.comment.post.id}/#${node.comment.id}c`}
                    onClick={() =>
                      node.read
                        ? false
                        : readNotif({ variables: { id: node.id } })
                    }
                  >
                    {node.comment.content.substr(0, 60)}
                  </Link>
                </div>
              );
          }
        }
      })}
      <Waypoint onEnter={more}>
        <div className="refetch-and-spinner">
          <button className="btn btn-teal" onClick={() => refetch()}>
            Refetch
          </button>
          {spin && (
            <div className="spinner">
              <Spinner size={40} />
            </div>
          )}
        </div>
      </Waypoint>
    </>
  );
};

export default Notifications;
