import React, { lazy } from "react";
const NotificationItem = lazy(() => import("../layout/NotificationItem"));

const NotificationList = ({ edges }) => {
  return (
    <div className="notifications">
      {edges.map(({ node }) => {
        return <NotificationItem node={node} key={node.id} />;
      })}
    </div>
  );
};

export default NotificationList;
