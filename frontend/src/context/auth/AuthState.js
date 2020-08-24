import React, {
  useReducer,
  useEffect,
  useContext
} from "react";
import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import {
  LOGIN,
  LOGOUT,
  SET_LOADING
} from "../types";
import {
  useMutation,
  useLazyQuery
} from "@apollo/client";
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

const AuthState = (props) => {
  const initialState = {
    isAuthenticated: null,
    loading: true,
    logout: false,
    token: localStorage.getItem("TOKEN"),
    refreshToken: localStorage.getItem("REFRESH_TOKEN"),
    user: localStorage.getItem("USER"),
  };

  const {
    setAlert,
    removeAlert
  } = useContext(AlertContext);
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  const [addUser] = useMutation(ADD_USER);
  const [login] = useMutation(LOGIN_USER);
  const [logout] = useMutation(LOGOUT_USER);
  const [revoke] = useMutation(REVOKE_TOKEN);
  const [verify] = useMutation(VERIFY_TOKEN);
  const [refresh] = useMutation(REFRESH_TOKEN);

  const loggedIn = () => {
    if (localStorage.getItem("TOKEN") == null) {
      dispatch({
        type: LOGOUT
      });
      dispatch({
        type: SET_LOADING
      });
      return;
    }
    verify({
      variables: {
        token: state.token
      }
    }).then(({
      data
    }) => {
      if (data.verifyToken != null) {
        refresh({
          variables: {
            token: state.refreshToken
          }
        }).then((d) => {
          if (d.data.refreshToken !== null) {
            localStorage.setItem("TOKEN", d.data.refreshToken.token);
            localStorage.setItem(
              "REFRESH_TOKEN",
              d.data.refreshToken.refreshToken
            );
            dispatch({
              type: LOGIN
            });
          } else {
            dispatch({
              type: LOGOUT
            });
          }
        });
      } else {
        dispatch({
          type: LOGOUT
        });
      }
    });
    dispatch({
      type: SET_LOADING
    });
  };

  useEffect(() => {
    loggedIn();
  }, []);

  const Login = (username, password) => {
    login({
        variables: {
          username: username,
          password: password
        },
      })
      .catch((error) => setAlert(error.message, "danger"))
      .then((d) => {
        if (d) {
          if (d.data.tokenAuth !== null) {
            localStorage.setItem("TOKEN", d.data.tokenAuth.token);
            localStorage.setItem("REFRESH_TOKEN", d.data.tokenAuth.refreshToken);
            localStorage.setItem("USER", d.data.tokenAuth.user.id);
            dispatch({
              type: LOGIN,
            });
          }
        }
      });
  };

  const Register = (username, password) => {
    removeAlert();
    addUser({
        variables: {
          username: username,
          password: password
        },
      })
      .catch((error) => `${error}`)
      .then((d) => {
        if (d.data.createUser.ok) {
          Login(username, password);
          return true;
        } else {
          setAlert(d.data.createUser.message, "danger");
          return false;
        }
      });
  };

  const Logout = () => {
    revoke({
      variables: {
        token: state.refreshToken
      }
    });
    logout();
    setAlert("Logged out!", "primary");
    dispatch({
      type: LOGOUT,
    });
  };

  return ( <
    AuthContext.Provider value = {
      {
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        Login,
        Register,
        Logout,
        loggedIn,
        user: state.user,
      }
    } > {
      props.children
    } <
    /AuthContext.Provider>
  );
};

export default AuthState;