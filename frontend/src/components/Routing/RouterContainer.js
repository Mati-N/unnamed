import React, { useEffect, lazy } from "react";
import { HashRouter as Router } from "react-router-dom";
import { VERIFY_TOKEN, REFRESH_TOKEN, LOGOUT_LOGGED_OUT } from "../../Queries";
import { useMutation } from "@apollo/client";
import { useRecoilState } from "recoil";
import { authAtom } from "../../atoms";
import Cookies from "js-cookie";

const Navbar = lazy(() => import("../layout/Navbar"));
const Alert = lazy(() => import("../layout/Alert"));
const Routes = lazy(() => import("./Routes"));
const Footer = lazy(() => import("../layout/Footer"));

const RouterContainer = () => {
  const [auth, setAuth] = useRecoilState(authAtom);
  const [verify] = useMutation(VERIFY_TOKEN);
  const [refresh] = useMutation(REFRESH_TOKEN);
  const [logoutLoggedOut] = useMutation(LOGOUT_LOGGED_OUT);

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

  const doRefresh= () => {
    refresh({
      variables: {
        token: auth.refreshToken,
      },
    })
    .catch((e) => {
      console.log(e)
      Logout();
    })
    .then((d) => {
      if (d) {
        if (d.data.refreshToken !== null) {
          Cookies.set("refresh-token", d.data.refreshToken.refreshToken);
            Cookies.set("token", d.data.refreshToken.token);
          setAuth((oldAuth) => ({
            ...oldAuth,
            isAuthenticated: true,
            refreshToken: d.data.refreshToken.refreshToken,
            token: d.data.refreshToken.token
          }));
        } else {
          Logout();
        }
      }
    });
  }

  const loggedIn = () => {
    if (auth.token == null) {
      setAuth((oldAuth) => ({ ...oldAuth, isAuthenticated: false }));
      return;
    }
      verify({
        variables: {
          token: auth.token,
        },
      })
        .catch((error) => {
          console.log(error)
          Logout();
        })
        .then((d) => {
          if (d) {
            const { data } = d;
            if (data) {
              if (data.verifyToken !== null) {
                doRefresh();
              }
            }
          }
        });
  };

  useEffect(() => {
    loggedIn();
  }, []);

  return (
    <Router>
      <div className="app-elements">
        <main>
          <Alert />
          <Routes />
        </main>
        <Footer />
      </div>
      <Navbar />
    </Router>
  );
};

export default RouterContainer;
