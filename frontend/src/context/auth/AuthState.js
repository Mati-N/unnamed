import React, { useReducer } from "react";
import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import { LOGIN } from "../types";
import { useMutation } from "@apollo/client";
import { ADD_USER, LOGIN_USER } from "../Queries";

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("TOKEN"),
    isAuthenticated: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);
  const [addUser, { data }] = useMutation(ADD_USER);
  const [login] = useMutation(LOGIN_USER);

  const Login = (username, password) => {
    login({
      variables: { username: username, password: password },
    }).then((d) => {
      if (d.data.tokenAuth !== null) {
        dispatch({
          type: LOGIN,
        });
        localStorage.setItem("TOKEN", d.data.tokenAuth.token);
      }
    });
  };

  const Register = (username, password) => {
    addUser({
      variables: { username: username, password: password },
    })
      .catch((error) => {
        console.log(error);
      })
      .then((d) => {
        if (d.data.createUser.ok) {
          login({
            variables: { username: username, password: password },
          }).then((d) => {
            localStorage.setItem("TOKEN", d.data.tokenAuth.token);
          });
          dispatch({
            type: LOGIN,
          });
        }
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        Login,
        Register,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
