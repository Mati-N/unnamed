import React from "react";
import { useQuery } from "@apollo/client";
import { NOTIFICATION_NUMBER } from "../../Queries";
import Notifications from "../SVG/Notifications.svg";
import Settings from "../SVG/Settings.svg";
import { Link } from "react-router-dom";

const AuthenticatedNav = ({ location, hide }) => {
  const { loading, data } = useQuery(NOTIFICATION_NUMBER, {
    pollInterval: 600,
  });

  return (
    <>
      <li className="left">
        <span
          className={`navItem ${
            location.pathname == "/" || location.pathname == "/all"
              ? "active-navItem"
              : ""
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
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
          {!loading && data && data.notificationNumber > 0 && (
            <span className="badge">
              {!loading && data && data.notificationNumber}
            </span>
          )}
        </span>
      </li>
    </>
  );
};

export default AuthenticatedNav;
