import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";

const AuthenticationRoute = ({ component: Component, auth, ...rest }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading || isAuthenticated == null)
          return (
            <div className="spinner">
              <Spinner size={60} style={{}} />
            </div>
          );
        else if (isAuthenticated) {
          return <Redirect to="/" />;
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

export default AuthenticationRoute;
