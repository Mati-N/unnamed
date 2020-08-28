import React from "react";

function Error({ error, componentStack, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{componentStack}</pre>
      <button className="btn-teal btn" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
}

export default Error;
