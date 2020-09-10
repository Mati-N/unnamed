import React from "react";
import { Link } from "react-router-dom";
import LogoutSVG from "../SVG/Logout.svg";
import Edit from "../SVG/Edit.svg";

const AccountInfo = ({ user_data, Logout }) => {
  return (
    <div className="account-info">
      <div className="account-info-top">
        <span className="username" style={{ display: "block" }}>
          {user_data.selfUser.username}
        </span>
      </div>
      <div className="info-mini">
        <span className="info">{user_data.selfUser.postCount} Posts</span>
        <span className="info">
          {user_data.selfUser.followerCount} Followers
        </span>
      </div>
      <ul className="options">
        <li className="option">
          <button
            style={{
              background: "none",
              border: "none",
            }}
            onClick={Logout}
          >
            <LogoutSVG className="svg" /> Logout
          </button>
        </li>
        <li className="option">
          <Edit className="svg" />
          <Link to="/password">Change Password</Link>
        </li>
        <li className="option">
          <Edit className="svg" />
          <Link to="/username">Change Username</Link>
        </li>
      </ul>
    </div>
  );
};

export default AccountInfo;
