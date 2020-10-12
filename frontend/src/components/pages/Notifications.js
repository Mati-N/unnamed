import React, { useState, lazy } from "react";
import { GET_NOTIFICATIONS, NOTIFICATION_SUB } from "../../Queries";
import { useQuery, useSubscription } from "@apollo/client";
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
    subscribeToMore,
  } = useQuery(GET_NOTIFICATIONS, {
    onError: (err) => console.log(err),
    errorPolicy: 'all'
  });

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

  const subscribeToNewNotifications = () => {
    subscribeToMore({
      document: NOTIFICATION_SUB,
      onError: ({ response, graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
          );
        }
        
          console.log(graphQLErrors)
          console.log(response)
        if (networkError) { console.log(`[Network error]: ${networkError}`) };
      },
      updateQuery: (prev, { subscriptionData }) => {
        console.log(prev, subscriptionData);
        if (!subscriptionData.data) return prev;
        /*const newNotificationItem = subscriptionData.data.notificationCreated;
        return Object.assign({}, prev, {

        })*/
      },
      errorPolicy: 'all'
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
          <NoData className="w-50 h-50" />
        </div>
      )}
      <NotificationList
        subscribeToNewNotifications={subscribeToNewNotifications}
        edges={data.selfNotification.edges}
      />
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
