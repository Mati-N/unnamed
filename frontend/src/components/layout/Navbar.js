import React, { useContext, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import Notifications from "../SVG/Notifications.svg";
import Settings from "../SVG/Settings.svg";

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
          <>
            <li className="left">
              <span
                className={`navItem ${
                  location.pathname == "/" ? "active-navItem" : ""
                }`}
              >
                <Link className="nav-link" to="/" onClick={hide}>
                  Home
                </Link>
              </span>
              <span
                className={`navItem ${
                  location.pathname == "/add-post" ? "active-navItem" : ""
                }`}
              >
                <Link className="nav-link" to="/add-post" onClick={hide}>
                  New Post
                </Link>
              </span>
            </li>
            <li className="right">
              <span className="navItem">
                <a
                  className="nav-link"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-arrow-up-circle"
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#fff"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <circle cx="12" cy="12" r="9" />
                    <line x1="12" y1="8" x2="8" y2="12" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="16" y1="12" x2="12" y2="8" />
                  </svg>
                </a>
              </span>
              <span
                className={`navItem ${
                  location.pathname == "/account" ? "active-navItem" : ""
                }`}
              >
                <Link className="nav-link" to="/account" onClick={hide}>
                  <Settings />
                </Link>
              </span>
              <span
                className={`navItem ${
                  location.pathname == "/notifications" ? "active-navItem" : ""
                }`}
              >
                <Link className="nav-link" to="/notifications" onClick={hide}>
                  <Notifications />
                </Link>
              </span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
