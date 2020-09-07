import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import Notifications from "../SVG/Notifications.svg";
import Settings from "../SVG/Settings.svg";

function Navbar() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navItems = useRef(null);
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
      className="nav"
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
            <span className="navItem">
              <Link to="/login" className="nav-link" onClick={hide}>
                Login
              </Link>
            </span>
            <span className="navItem">
              <Link className="nav-link" to="/register" onClick={hide}>
                Register
              </Link>
            </span>
          </li>
        )}
        {isAuthenticated && (
          <>
            <li className="left">
              <span className="navItem">
                <Link className="nav-link" to="/" onClick={hide}>
                  Home
                </Link>
              </span>
              <span className="navItem">
                <Link className="nav-link" to="/add-post" onClick={hide}>
                  New Post
                </Link>
              </span>
            </li>
            <li className="right">
              <span className="navItem">
                <button
                  className="to-up"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-chevron-up"
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="rgb(248, 248, 248)"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={hide}
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <polyline points="6 15 12 9 18 15" />
                  </svg>
                </button>
              </span>
              <span className="navItem">
                <Link className="nav-link" to="/account" onClick={hide}>
                  <Settings />
                </Link>
              </span>
              <span className="navItem">
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
