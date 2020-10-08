import React from "react";
import NotFoundSvg from "../SVG/NotFound.svg";

const NotFound = () => {
  return (
    <div className="w-75 h-75 m-auto d-flex align-items-center justify-content-center flex-column">
      <soan style={{ fontSize: "1.5em" }} className="p-1">
        Page Not Found
      </soan>

      <NotFoundSvg width="90%" height="90%" preserveAspectRatio />
    </div>
  );
};

export default NotFound;
