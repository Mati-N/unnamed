import React from "react";

function Error({ error, componentStack, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p
        style={{
          width: "40%",
          margin: "auto",
          padding: "8vh",
          fontSize: "5em ",
        }}
      >
        Something went wrong
      </p>
      {/*
      <pre>{componentStack}</pre>
      <button className="btn-teal btn" onClick={resetErrorBoundary}>
        Try again
      </button>
      */}
    </div>
  );
}

export default Error;
