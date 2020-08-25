import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/auth/AuthContext";
import AlertContext from "../../context/alert/AlertContext";

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const Auth = useContext(AuthContext);
  const { setAlert, removeAlert } = useContext(AlertContext);
  useEffect(() => {
    removeAlert();
  }, []);

  const onChange = (e) => {
    let name = e.target.name;
    setLoginInfo({ ...loginInfo, [name]: e.target.value });
    if (name === "username") {
      if (e.target.value.length < 1) {
        setAlert("Username too short", "warning");
        setDisabled(true);
      } else if (loginInfo.password.length > 8 && e.target.value.length > 0) {
        removeAlert();
        setDisabled(false);
      }
    } else if (name === "password")
      if (e.target.value.length < 8) {
        setAlert("Password too short", "warning");
        setDisabled(true);
      } else if (loginInfo.username.length > 0 && e.target.value.length > 8) {
        removeAlert();
        setDisabled(false);
      }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    Auth.Login(loginInfo.username, loginInfo.password);
  };

  return (
    <div className="main">
      <form className="form-auth" method="post" onSubmit={onSubmit}>
        <p className="h2">Login</p>
        <div className="form-group">
          <label display="none" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            name="username"
            onChange={onChange}
            placeholder="Username"
            value={loginInfo.username}
          />
        </div>
        <div className="form-group">
          <label display="none" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={onChange}
            placeholder="Password"
            value={loginInfo.password}
          />
        </div>
        <button type="submit" className="btn btn-teal" disabled={disabled}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
