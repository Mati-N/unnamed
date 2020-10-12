import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogoutSVG from "../SVG/Logout.svg";
import Edit from "../SVG/Edit.svg";
import Avatar from "@material-ui/core/Avatar";
import { authAtom } from "../../atoms";
import { LOGOUT_USER, LOGOUT_LOGGED_OUT } from "../../Queries";
import { useRecoilState } from "recoil";
import { useMutation } from "@apollo/client";

const AccountInfo = ({ user_data }) => {
  const [disabled, setDisabled] = useState(false);
  const [logoutLoggedOut] = useMutation(LOGOUT_LOGGED_OUT);
  const [logout] = useMutation(LOGOUT_USER);
  const [auth, setAuth] = useRecoilState(authAtom);

  const Logout = () => {
    Cookies.remove("token");
    Cookies.remove("refresh-token");
    Cookies.remove("USER-ID");
    logoutLoggedOut();
    setAuth((oldAuth) => ({
      ...oldAuth,
      isAuthenticated: false,
    }));
  };

  const doLogout = () => {
    const interval = setInterval(() => {
      logout({
        variables: {
          token: auth.refreshToken,
        },
      }).then((d) => {
        if (d.data.revokeToken.revoked) {
          Logout();
          props.client.clearStore();
          clearInterval(interval);
        }
      });
    }, 5000);
  };

  return (
    <div className="account-info">
      <div className="account-info-top">
        <Avatar
          alt={user_data.selfUser.username}
          src={user_data.selfUser.imagePath}
          variant="circle"
          style={{
            margin: "0.4em",
          }}
        >
          {user_data.selfUser.username.substring(0, 1)}
        </Avatar>
        <span className="username d-inline-block">
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
        <li
          className="option"
          onClick={() => {
            if (!disabled) {
              setDisabled(true);
              doLogout();
              setDisabled(false);
            }
          }}
          disabled={disabled}
        >
          <LogoutSVG className="svg" /> <a>Logout</a>
        </li>
        <li className="option">
          <Edit className="svg" />
          <Link to="/edit">Edit Account</Link>
        </li>
      </ul>
    </div>
  );
};

export default AccountInfo;
