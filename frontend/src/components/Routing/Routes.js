import React, { Fragment, useContext, useEffect, lazy } from "react";
import { Switch, useLocation, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthenticationRoute from "./AuthenticationRoute";
import { useTransition, animated, config } from "react-spring";
const Home = lazy(() => import("../pages/Home"));
const Account = lazy(() => import("../pages/Account"));
const NewPost = lazy(() => import("../pages/NewPost"));
const Login = lazy(() => import("../auth/Login"));
const Register = lazy(() => import("../auth/Register"));
const NotFound = lazy(() => import("../pages/NotFound"));
import AuthContext from "../../context/auth/AuthContext";
const User = lazy(() => import("../pages/User"));

const Routes = () => {
  const { loggedIn } = useContext(AuthContext);
  const location = useLocation();
  const transitions = useTransition(location, (location) => location.pathname, {
    from: {
      opacity: 0,
      transform: "scale(0.6) translateX(-100%)",
    },
    enter: {
      opacity: 1,
      transform: "scale(1) translateX(0%)",
    },
    leave: {
      opacity: 0,
      transform: "scale(0.6) translateX(70%)",
    },
    config: config.stiff,
  });

  useEffect(() => {
    loggedIn();
  }, []);

  return (
    <Fragment>
      {transitions.map(({ item, props, key }) => (
        <animated.div key={`${key}anim`} style={props} className="container">
          <Switch location={item}>
            <AuthenticationRoute exact path="/login" component={Login} />
            <AuthenticationRoute exact path="/register" component={Register} />

            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/add-post" component={NewPost} />
            <PrivateRoute exact path="/account" component={Account} />
            <PrivateRoute exact path="/user/:id" component={User} />
            <Route component={NotFound} />
          </Switch>
        </animated.div>
      ))}
    </Fragment>
  );
};

export default Routes;
