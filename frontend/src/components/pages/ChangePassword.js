import React, { useState, useContext } from "react";
import AlertContext from "../../context/alert/AlertContext";
import { UPDATE_USER } from "../../Queries";
import { useMutation } from "@apollo/client";
import { Redirect } from "react-router-dom";

const CustomizeAccount = () => {
  const [state, setState] = useState({
    password: "",
    newPassword: "",
    disabled: false,
    change: true,
  });
  const doCustomize = useMutation(UPDATE_USER);
  const { setAlert, removeAlert } = useContext(AlertContext);
  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    doCustomize({
      variables: { newPassword: state.newPassword, password: state.password },
    }).then(({ data }) => {
      if (data) {
        if (!d.data.updateUser.ok) {
          setAlert(d.data.updateUser.message, "danger");
        } else {
          setState({ ...state, changed: true });
        }
      }
    });
  };

  if (state.changed) return <Redirect to="/" />;

  return (
    <form className="form-auth" method="post" onSubmit={onSubmit}>
      <p className="h2">Change Password</p>
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
          New Password
        </label>
        <input
          type="password"
          className="form-control"
          name="newPassword"
          onChange={onChange}
          placeholder="New Password"
          value={state.newPassword}
          id="newPassword"
        />
      </div>
      <button type="submit" className="btn btn-teal" disabled={state.disabled}>
        Change
      </button>
    </form>
  );
};

export default CustomizeAccount;
