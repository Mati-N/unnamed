import React, { useReducer, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import { LOGIN, LOGOUT, SET_LOADING } from "../types";
import { useMutation, useLazyQuery } from "@apollo/client";
import {
  ADD_USER,
  LOGIN_USER,
  IS_LOGGED_IN,
  LOGOUT_USER,
  VERIFY_TOKEN,
  REFRESH_TOKEN,
  REVOKE_TOKEN,
} from "../../Queries";
import AlertContext from "../alert/AlertContext";
import Cookies from "js-cookie";

const AuthState = (props) => {
  const initialState = {
    isAuthenticated: null,
    loading: true,
    logout: false,
    token: Cookies.get("JWT"),
    refreshToken: Cookies.get("JWT-refresh-token"),
    user: localStorage.getItem("USER"),
  };

  const { setAlert, removeAlert } = useContext(AlertContext);
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  const [addUser] = useMutation(ADD_USER);
  const [login] = useMutation(LOGIN_USER);
  const [logout] = useMutation(LOGOUT_USER);
  const [revoke] = useMutation(REVOKE_TOKEN);
  const [verify] = useMutation(VERIFY_TOKEN);
  const [refresh] = useMutation(REFRESH_TOKEN);

  const loggedIn = () => {
    if (state.token === null) {
      console.log(Cookies.get("JWT"));
      dispatch({
        type: LOGOUT,
      });
      dispatch({
        type: SET_LOADING,
      });
      return;
    }
    try {
      verify({
        variables: {
          token: state.token,
        },
      })
        .catch((error) => {
          doLogout();
        })
        .then((d) => {
          if (d) {
            const { data } = d;
            if (data) {
              if (data.verifyToken != null) {
                refresh({
                  variables: {
                    token: state.refreshToken,
                  },
                }).then((d) => {
                  if (d.data.refreshToken !== null) {
                    dispatch({
                      type: LOGIN,
                    });
                  } else {
                    dispatch({
                      type: LOGOUT,
                    });
                  }
                });
              } else {
                dispatch({
                  type: LOGOUT,
                });
              }
            }
          }
        });
      dispatch({
        type: SET_LOADING,
      });
    } catch {
      doLogout();
    }
  };

  useEffect(() => {
    loggedIn();
  }, []);

  const doLogin = (username, password) => {
    login({
      variables: {
        username: username,
        password: password,
      },
    })
      .catch((error) => setAlert(error.message, "danger"))
      .then((d) => {
        if (d) {
          if (d.data.tokenAuth !== null) {
            dispatch({
              type: LOGIN,
            });
          }
        }
      });
  };

  const doRegister = (username, password) => {
    removeAlert();
    addUser({
      variables: {
        username: username,
        password: password,
      },
    })
      .catch((error) => `${error}`)
      .then((d) => {
        if (d.data) {
          if (d.data.createUser.ok) {
            doLogin(username, password);
            return true;
          } else {
            setAlert(d.data.createUser.message, "danger");
            return false;
          }
        }
      });
  };

  const doLogout = () => {
    try {
      if (state.refreshToken) {
        revoke({
          variables: {
            token: state.refreshToken,
          },
        });
      }
      logout();
      setAlert("Logged out!", "primary");

      dispatch({
        type: LOGOUT,
      });
    } catch {
      dispatch({ type: LOGOUT });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        doLogin,
        doRegister,
        doLogout,
        loggedIn,
        user: state.user,
      }}
    >
      {" "}
      {props.children}{" "}
    </AuthContext.Provider>
  );
};

export default AuthState;
