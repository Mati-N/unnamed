import React, { useContext, lazy, Suspense } from "react";
import { Switch, useLocation, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthenticationRoute from "./AuthenticationRoute";
import { useTransition, animated, config } from "react-spring";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import { ErrorBoundary } from "react-error-boundary";

const Error = lazy(() => import("../layout/Error"));
const Edit = lazy(() => import("../pages/Edit"));
const Post = lazy(() => import("../post/Post"));
const Home = lazy(() => import("../pages/Home"));
const FollowingPosts = lazy(() => import("../pages/FollowingPosts"));
const Account = lazy(() => import("../pages/Account"));
const NewPost = lazy(() => import("../pages/NewPost"));
const Login = lazy(() => import("../auth/Login"));
const Register = lazy(() => import("../auth/Register"));
const NotFound = lazy(() => import("../pages/NotFound"));
const User = lazy(() => import("../pages/User"));
const Notifications = lazy(() => import("../pages/Notifications"));

const Routes = () => {
  const location = useLocation();

  const transitions = useTransition(location, (location) => location.pathname, {
    from: {
      opacity: 0,
      transform: "translateX(100%)",
    },
    enter: {
      opacity: 1,
      transform: "translateX(0%)",
    },
    leave: {
      opacity: 0,
      transform: "translateX(-70%)",
    },
    duration: "0.1s",
    config: config.stiff,
  });

  return (
    <>
      {transitions.map(({ item, props, key }) => (
        <animated.div
          className="transition-page"
          key={`${key}anim`}
          style={props}
        >
          <div className="page">
            <ErrorBoundary FallbackComponent={Error}>
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
                <Switch location={item}>
                  <AuthenticationRoute exact path="/login" component={Login} />
                  <AuthenticationRoute
                    exact
                    path="/register"
                    component={Register}
                  />

                  <PrivateRoute exact path="/all" component={Home} />
                  <PrivateRoute exact path="/" component={FollowingPosts} />
                  <PrivateRoute exact path="/add-post" component={NewPost} />
                  <PrivateRoute exact path="/account" component={Account} />
                  <PrivateRoute exact path="/user/:id" component={User} />
                  <PrivateRoute exact path="/post/:id" component={Post} />

                  <PrivateRoute
                    exact
                    path="/notifications"
                    component={Notifications}
                  />
                  <PrivateRoute exact path="/edit" component={Edit} />
                  <Route component={NotFound} />
                </Switch>
              </Suspense>
            </ErrorBoundary>
          </div>
        </animated.div>
      ))}
    </>
  );
};

export default Routes;
