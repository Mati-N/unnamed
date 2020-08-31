import React, { useContext, Suspense } from "react";
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
            <div className="main">
              <div className="spinner">
                <Spinner size={60} style={{}} />
              </div>
            </div>
          );
        else if (isAuthenticated) {
          return <Redirect to="/" />;
        } else {
          return (
            <div className="main">
              <Suspense
                fallback={
                  <div className="main">
                    <div className="spinner">
                      <Spinner
                        size={50}
                        style={{
                          margin: "auto",
                        }}
                      />
                    </div>
                  </div>
                }
              >
                <Component {...props} />
              </Suspense>
            </div>
          );
        }
      }}
    />
  );
};

export default AuthenticationRoute;
