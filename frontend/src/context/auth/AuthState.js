import React, { useReducer, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import { LOGIN, LOGOUT, SET_LOADING } from "../types";
import { useMutation } from "@apollo/client";
import {
  ADD_USER,
  LOGIN_USER,
  LOGOUT_USER,
  VERIFY_TOKEN,
  REFRESH_TOKEN,
  LOGOUT_LOGGED_OUT,
} from "../../Queries";
import AlertContext from "../alert/AlertContext";
import Cookies from "js-cookie";

const AuthState = (props) => {
  const initialState = {
    isAuthenticated: null,
    loading: true,
    logout: false,
    token: Cookies.get("token"),
    refreshToken: Cookies.get("refresh-token"),
    user: Cookies.get("USER-ID"),
  };

  const { setAlert, removeAlert } = useContext(AlertContext);
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  const [addUser] = useMutation(ADD_USER);
  const [login] = useMutation(LOGIN_USER);
  const [logout] = useMutation(LOGOUT_USER);
  const [verify] = useMutation(VERIFY_TOKEN);
  const [refresh] = useMutation(REFRESH_TOKEN);
  const [logoutLoggedOut] = useMutation(LOGOUT_LOGGED_OUT);

  const loggedIn = () => {
    if (state.token == null) {
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
          logoutLoggedOut();
        })
        .then((d) => {
          if (d) {
            const { data } = d;
            if (data) {
              if (data.verifyToken !== null) {
                refresh({
                  variables: {
                    token: state.refreshToken,
                  },
                })
                  .catch((e) => {
                    dispatch({
                      type: LOGOUT,
                    });
                    logoutLoggedOut();
                  })

                  .then((d) => {
                    if (d) {
                      if (d.data.refreshToken !== null) {
                        dispatch({
                          type: LOGIN,
                          payload: d.data.refreshToken,
                          refresh: true,
                        });
                      } else {
                        dispatch({
                          type: LOGOUT,
                        });
                        logoutLoggedOut();
                      }
                    }
                  });
              }
            }
          }
        });

      dispatch({
        type: SET_LOADING,
      });
    } catch {}
  };

  useEffect(() => {
    loggedIn();
  }, []);

  const doLogin = (username, password) => {
    login({
      variables: {
        username,
        password,
      },
    })
      .catch((error) => setAlert(error.message, "warning"))
      .then((d) => {
        if (d) {
          if (d.data.tokenAuth !== null) {
            removeAlert();
            dispatch({
              type: LOGIN,
              payload: d.data.tokenAuth,
              refresh: false,
            });
          }
        }
      });
  };

  const doRegister = (username, password, image) => {
    removeAlert();
    addUser({
      variables: {
        username,
        password,
        image,
      },
    })
      .catch((error) => `${error}`)
      .then((d) => {
        if (d.data) {
          if (d.data.createUser.ok) {
            doLogin(username, password);
            return true;
          } else {
            setAlert(d.data.createUser.message, "warning");
            return false;
          }
        }
      });
  };

  const doLogout = () => {
    const interval = setInterval(() => {
      logout({
        variables: {
          token: state.refreshToken,
        },
      }).then((d) => {
        if (d.data.revokeToken.revoked) {
          console.log(d);
          logoutLoggedOut();
          dispatch({
            type: LOGOUT,
          });
          props.client.clearStore();
          clearInterval(interval);
        }
      });
    }, 5000);
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
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
