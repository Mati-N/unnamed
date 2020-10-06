import React, { useContext, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import AuthenticatedNav from "./AuthenticatedNav";

function Navbar() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navItems = useRef(null);
  const location = useLocation();
  const [state, setState] = useState({ displayed: false });

  if (loading || isAuthenticated == null) return "";

  const showMenu = () => {
    setState({ displayed: !state.displayed });
  };

  const hide = () => {
    if (state.displayed) {
      showMenu();
    }
  };

  return (
    <nav
      className="main=nav nav"
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
      }}
    >
      <div className="nav-top">
        <Link to="/" className="navbar-brand">
          UNNAMED
        </Link>
        <svg
          viewBox="0 0 100 80"
          width="40"
          height="40"
          className="fa fa-bars"
          id={state.displayed ? "fa" : ""}
          onClick={showMenu}
        >
          <rect
            className="line0"
            fill="white"
            width="100"
            height="17"
            id={state.displayed ? "line0" : " "}
            rx="0.25em"
          ></rect>
          <rect
            className="line1"
            fill="white"
            y="30"
            width="100"
            height="17"
            id={state.displayed ? "line1" : " "}
            rx="0.25em"
          ></rect>
          <rect
            className="line2"
            fill="white"
            y="60"
            width="100"
            height="17"
            id={state.displayed ? "line2" : " "}
            rx="0.25em"
          ></rect>
        </svg>
      </div>

      <ul
        className={"navbar-items"}
        id={state.displayed ? "navitems-block" : "navitems-none"}
        ref={navItems}
      >
        {!isAuthenticated && (
          <li className="right" id="right">
            <span
              className={`navItem ${
                location.pathname == "/login" ? "active-navItem" : ""
              }`}
            >
              <Link to="/login" className="nav-link" onClick={hide}>
                Login
              </Link>
            </span>
            <span
              className={`navItem ${
                location.pathname == "/register" ? "active-navItem" : ""
              }`}
            >
              <Link className="nav-link" to="/register" onClick={hide}>
                Register
              </Link>
            </span>
          </li>
        )}
        {isAuthenticated && (
          <AuthenticatedNav location={location} hide={hide} />
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
