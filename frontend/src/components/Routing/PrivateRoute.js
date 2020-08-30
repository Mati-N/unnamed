import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading || isAuthenticated == null)
          return (
            <div className="spinner">
              <Spinner size={68} />
            </div>
          );
        else if (!isAuthenticated) {
          return <Redirect to="/login" />;
        } else {
          return (
            <div className="main">
              <Component {...props} />
            </div>
          );
        }
      }}
    />
  );
};

export default PrivateRoute;
