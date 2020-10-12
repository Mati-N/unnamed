import React, { useContext, Suspense } from "react";
import { Route, Redirect } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../atoms";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  const { isAuthenticated } = useRecoilValue(authAtom);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated === null)
          return (
            <div className="spinner">
              <Spinner size={68} />
            </div>
          );
        else if (!isAuthenticated) {
          return <Redirect to="/login" />;
        } else {
          return (
            <Suspense
              fallback={
                <div className="spinner">
                  <Spinner
                    size={50}
                    style={{
                      margin: "auto",
                    }}
                  />
                </div>
              }
            >
              <Component {...props} />
            </Suspense>
          );
        }
      }}
    />
  );
};

export default PrivateRoute;
