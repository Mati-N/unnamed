import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import {
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import NotificationIcon from "@material-ui/icons/Notifications";
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from "@material-ui/icons/Settings";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useQuery } from "@apollo/client";
import { NOTIFICATION_NUMBER } from "../../Queries";
import grey from "@material-ui/core/colors/grey";

const useStyles = makeStyles((theme) => ({
  root: {
    "&$selected": {
      color: "#3d9970",
    },
  },
  selected: {},
  mainRoot: {
    backgroundColor: grey[280],
  },
}));

function Navbar() {
  const { isAuthenticated, loading: auth_loading } = useContext(AuthContext);
  const location = useLocation();
  const classes = useStyles();

  const { loading, data, startPolling, stopPolling } = useQuery(
    NOTIFICATION_NUMBER,
    {
      pollInterval: 900,
    }
  );

  if (auth_loading || isAuthenticated == null) return "";

  return (
    <BottomNavigation
      value={location.pathname.replace("/", "").replace("all", "")}
      showLabels
      className="bottom-nav w-100"
      classes={{ root: classes.mainRoot }}
    >
      {!isAuthenticated && (
        <BottomNavigationAction
          component={Link}
          to="/login"
          label="Login"
          icon={<LockOpenIcon />}
          value="login"
          classes={{ root: classes.root, selected: classes.selected }}
        />
      )}
      {!isAuthenticated && (
        <BottomNavigationAction
          component={Link}
          to="/register"
          label="Register"
          value="register"
          icon={<ExitToAppIcon />}
          classes={{ root: classes.root, selected: classes.selected }}
        />
      )}
      {isAuthenticated && (
        <BottomNavigationAction
          component={Link}
          to="/"
          label="Home"
          value=""
          icon={<HomeIcon />}
          classes={{ root: classes.root, selected: classes.selected }}
        />
      )}
      {isAuthenticated && (
        <BottomNavigationAction
          label="Notifications"
          component={Link}
          to="/notifications"
          value="notifications"
          icon={
            <Badge
              badgeContent={!loading && data ? data.notificationNumber : 0}
              color="secondary"
              max={1000}
            >
              <NotificationIcon />
            </Badge>
          }
          classes={{ root: classes.root, selected: classes.selected }}
        />
      )}
      {isAuthenticated && (
        <BottomNavigationAction
          component={Link}
          to="/add-post"
          label="New Post"
          value="add-post"
          icon={<AddIcon />}
          classes={{ root: classes.root, selected: classes.selected }}
        />
      )}
      {isAuthenticated && (
        <BottomNavigationAction
          component={Link}
          to="/account"
          label="Settings"
          value="account"
          icon={<SettingsIcon />}
          classes={{ root: classes.root, selected: classes.selected }}
        />
      )}
    </BottomNavigation>
  );
}

export default Navbar;
