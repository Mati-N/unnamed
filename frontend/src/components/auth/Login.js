import React, { useState, useContext } from "react";
import AuthContext from "../../context/auth/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const Auth = useContext(AuthContext);

  const onChange = (e) => {
    switch (e.target.name) {
      case "username":
        setUsername(e.target.value);
      case "password":
        setPassword(e.target.value);
      default:
        return;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    Auth.Login(username, password);
  };

  return (
    <form className="form-auth" onSubmit={onSubmit}>
      <p className="h2">Login</p>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          name="username"
          onChange={onChange}
          placeholder="Username"
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          name="password"
          onChange={onChange}
          placeholder="Password"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </form>
  );
}

export default Login;
