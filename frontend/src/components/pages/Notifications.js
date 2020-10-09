import React, { useState, lazy } from "react";
import { GET_NOTIFICATIONS } from "../../Queries";
import { useQuery } from "@apollo/client";
import { Waypoint } from "react-waypoint";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import NoData from "../SVG/NoData.svg";
import MarkunreadMailboxTwoToneIcon from "@material-ui/icons/MarkunreadMailboxTwoTone";
import Button from "@material-ui/core/Button";

const Offline = lazy(() => import("./Offline"));
const NotificationItem = lazy(() => import("../layout/NotificationItem"));

const Notifications = () => {
  const { loading, data, error, fetchMore, refetch } = useQuery(
    GET_NOTIFICATIONS,
    {
      pollInterval: 600,
    }
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
      <Button
        className="mx-auto d-block "
        style={{ minWidth: "25%" }}
        variant="contained"
        color="primary"
        startIcon={<MarkunreadMailboxTwoToneIcon />}
        onClick={() => readNotif()}
      >
        Read All
      </Button>
      {data.selfNotification.edges.length == 0 && (
        <div className="w-75 h-75 m-auto d-flex align-items-center justify-content-center flex-column">
          <NoData className="w-50 h-50" preserveAspectRatio />
        </div>
      )}
      <div className="notifications">
        {data.selfNotification.edges.map(({ node }) => {
          return <NotificationItem node={node} key={node.id} />;
        })}
      </div>
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
