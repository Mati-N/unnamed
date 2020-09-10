import React, { useState, useContext } from "react";
import AlertContext from "../../context/alert/AlertContext";
import { UPDATE_USER } from "../../Queries";
import { useMutation } from "@apollo/client";
import { Redirect } from "react-router-dom";

const CustomizeAccount = () => {
  const [state, setState] = useState({
    password: "",
    newUsername: "",
  });
  const [disabled, setDisabled] = useState(true);
  const [doCustomize] = useMutation(UPDATE_USER);
  const { setAlert, removeAlert } = useContext(AlertContext);
  const onChange = (e) => {
    const name = e.target.name;
    setState({ ...state, [e.target.name]: e.target.value }, Verify(name, e));
  };

  const Verify = (name, e) => {
    switch (name) {
      case "password":
        if (e.target.value.length < 8) {
          setAlert("Password too short", "warning");
          setDisabled(true);
        } else if (
          state.newUsername.length != 0 &&
          e.target.value.length >= 8
        ) {
          removeAlert();
          setDisabled(false);
        } else {
          removeAlert();
        }
        break;
      case "newUsername":
        if (e.target.value.length == 0) {
          setAlert("New Username too short", "warning");
          setDisabled(true);
        } else if (state.password.length >= 8 && e.target.value.length != 0) {
          removeAlert();
          setDisabled(false);
        } else {
          removeAlert();
        }
        break;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (state.password != "") {
      doCustomize({
        variables: { username: state.newUsername, password: state.password },
      }).then((d) => {
        if (d) {
          if (!d.data.updateUser.ok) {
            setAlert(d.data.updateUser.message, "danger");
          } else {
            setState({ ...state, changed: true });
            setAlert("Username changed :}", "primary");
          }
        }
      });
    }
  };

  if (state.changed) return <Redirect to="/" />;

  return (
    <form className="form-auth" method="post" onSubmit={onSubmit}>
      <p className="h2">Change Username</p>
      <div className="form-group">
        <label className="label-hide" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          name="password"
          onChange={onChange}
          placeholder="Password"
          value={state.password}
          id="password"
        />
      </div>
      <div className="form-group">
        <label className="label-hide" htmlFor="newPassword">
          New Username
        </label>
        <input
          type="text"
          className="form-control"
          name="newUsername"
          onChange={onChange}
          placeholder="New Username"
          value={state.newUsername}
          id="newUsername"
        />
      </div>
      <button type="submit" className="btn btn-teal" disabled={disabled}>
        Change
      </button>
    </form>
  );
};

export default CustomizeAccount;
