import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/auth/AuthContext";
import AlertContext from "../../context/alert/AlertContext";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";

function Register() {
  const [registerInfo, setRegisterInfo] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const Auth = useContext(AuthContext);
  const { setAlert, removeAlert } = useContext(AlertContext);

  useEffect(() => {
    removeAlert();
  }, []);

  const onChange = (e) => {
    let name = e.target.name;
    setRegisterInfo({ ...registerInfo, [name]: e.target.value });
    if (name === "username") {
      if (e.target.value.length < 1) {
        setAlert("Username too short", "warning");
        setDisabled(true);
      } else if (
        registerInfo.password.length > 8 &&
        e.target.value.length > 0
      ) {
        removeAlert();
        setDisabled(false);
      }
    } else if (name === "password")
      if (e.target.value.length < 8) {
        setAlert("Password too short", "warning");
        setDisabled(true);
      } else if (
        registerInfo.username.length > 0 &&
        e.target.value.length > 8
      ) {
        removeAlert();
        setDisabled(false);
      }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (registerInfo.username !== "") {
      Auth.Register(registerInfo.username, registerInfo.password);
    }
  };

  return (
    <div className="main">
      <form
        className="form-auth"
        method="post"
        onSubmit={() => {
          setLoading(true);
          onSubmit();
          setLoading(false);
        }}
      >
        <p className="h2">Register</p>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="username"
            onChange={onChange}
            placeholder="Username"
            value={registerInfo.username}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={onChange}
            placeholder="Password"
            value={registerInfo.password}
          />
        </div>
        {loading && (
          <Spinner
            size={35}
            style={{
              margin: "auto",
            }}
          />
        )}
        <button
          type="submit"
          className="btn btn-teal"
          disabled={disabled}
          style={{ display: loading ? "none" : "block" }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
