import React, { Fragment, useContext, useEffect } from "react";
import { Switch, useLocation, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthenticationRoute from "./AuthenticationRoute";
import { useTransition, animated, config } from "react-spring";
import Home from "../pages/Home";
import Account from "../pages/Account";
import NewPost from "../pages/NewPost";
import Login from "../auth/Login";
import Register from "../auth/Register";
import NotFound from "../pages/NotFound";
import AuthContext from "../../context/auth/AuthContext";
import User from "../pages/User";

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
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/add-post" component={NewPost} />
            <PrivateRoute exact path="/account" component={Account} />
            <AuthenticationRoute exact path="/register" component={Register} />
            <PrivateRoute exact path="/user/:id" component={User} />
            <Route component={NotFound} />
          </Switch>
        </animated.div>
      ))}
    </Fragment>
  );
};

export default Routes;
