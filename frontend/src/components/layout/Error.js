import React from "react";
import ServerDown from "../SVG/ServerDown.svg";

function Error({ error, componentStack, resetErrorBoundary }) {
  return (
    <div className="w-75 h-75 m-auto d-flex align-items-center justify-content-center flex-column">
      <span style={{ fontSize: "1.5em" }} className="p-1">
        Something Went Wrong
      </span>

      <ServerDown width="90%" height="90%" preserveAspectRatio />
    </div>
  );
}

export default Error;
