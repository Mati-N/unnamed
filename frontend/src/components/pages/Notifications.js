import React, { useEffect, useState, lazy } from "react";
import { GET_NOTIFICATIONS, READ_NOTIFICATION } from "../../Queries";
import { useMutation, useQuery } from "@apollo/client";
import { Waypoint } from "react-waypoint";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import NoData from "../SVG/NoData.svg";
import MarkunreadMailboxTwoToneIcon from "@material-ui/icons/MarkunreadMailboxTwoTone";
import Button from "@material-ui/core/Button";
const NotificationList = lazy(() => import("../layout/NotificationList"));

const Offline = lazy(() => import("./Offline"));

const Notifications = () => {
  const {
    loading,
    data,
    error,
    fetchMore,
    refetch,
  } = useQuery(GET_NOTIFICATIONS, {
    onError: (err) => console.log(err),
    errorPolicy: 'all'
  });

  const [readAllNotifications] = useMutation(READ_NOTIFICATION);
  const [spin, setSpin] = useState(true);

  useEffect(() => {
    const poller = setInterval(() => {
      refetch();
    }, 15000);

    return () => clearInterval(poller);
  }, [refetch]);

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
    if (!data?.selfNotification?.pageInfo?.hasNextPage) {
      setSpin(false);
      return;
    }

    fetchMore({
      query: GET_NOTIFICATIONS,
      variables: { cursor: data.selfNotification.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        setSpin(true);
        if (!fetchMoreResult) {
          return previousResult;
        }
        const newEdges = fetchMoreResult.selfNotification.edges || [];
        const pageInfo = fetchMoreResult.selfNotification.pageInfo;

        if (!newEdges.length) {
          setSpin(false);
          return previousResult;
        }

        return {
          selfNotification: {
            __typename: previousResult.selfNotification.__typename,
            edges: [...previousResult.selfNotification.edges, ...newEdges],
            pageInfo,
          },
        };
      },
    });
  };

  const readAll = () => {
    readAllNotifications({
      variables: { id: null },
    }).finally(() => {
      refetch();
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
        onClick={readAll}
      >
        Read All
      </Button>
      {data.selfNotification.edges.length == 0 && (
        <div className="w-75 h-75 m-auto d-flex align-items-center justify-content-center flex-column">
          <NoData className="w-50 h-50" />
        </div>
      )}
      <NotificationList edges={data.selfNotification.edges} />
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
