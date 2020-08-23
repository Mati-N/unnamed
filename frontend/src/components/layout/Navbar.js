import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";

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
          <div className="right">
            <li className="navItem">
              <Link to="/login" className="nav-link" onClick={hide}>
                Login
              </Link>
            </li>
            <li className="navItem">
              <Link className="nav-link" to="/register" onClick={hide}>
                Register
              </Link>
            </li>
          </div>
        )}
        {isAuthenticated && (
          <>
            <div className="left">
              <li className="navItem">
                <Link className="nav-link" to="/" onClick={hide}>
                  Home
                </Link>
              </li>
              <li className="navItem">
                <Link className="nav-link" to="/add-post" onClick={hide}>
                  New Post
                </Link>
              </li>
            </div>
            <div className="right">
              <li className="navItem">
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
              </li>

              <li className="navItem">
                <Link className="nav-link" to="/account" onClick={hide}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-settings"
                    width="45"
                    height="45"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="rgb(248, 248, 248)"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </Link>
              </li>
            </div>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
