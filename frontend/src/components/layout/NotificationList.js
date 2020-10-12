import React, { useEffect, lazy } from "react";
const NotificationItem = lazy(() => import("../layout/NotificationItem"));

const NotificationList = ({ subscribeToNewNotifications, edges }) => {
  useEffect(() => {
    subscribeToNewNotifications();
  }, []);

  return (
    <div className="notifications">
      {edges.map(({ node }) => {
        return <NotificationItem node={node} key={node.id} />;
      })}
    </div>
  );
};

export default NotificationList;
