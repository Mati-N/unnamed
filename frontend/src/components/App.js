import React, { lazy, Suspense, useRef } from "react";
import { HashRouter as Router } from "react-router-dom";
import AuthState from "../context/auth/AuthState";
import AlertState from "../context/alert/AlertState";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Cookies from "js-cookie";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
const Navbar = lazy(() => import("./layout/Navbar"));
const Alert = lazy(() => import("./layout/Alert"));
const Routes = lazy(() => import("./Routing/Routes"));
const Footer = lazy(() => import("./layout/Footer"));

const client = new ApolloClient({
  uri: "/api/",
  cache: new InMemoryCache(),
  connectToDevTools: true,
  credentials: "same-origin",
  headers: {
    "X-CSRFToken": Cookies.get("csrftoken"),
  },
});

const App = () => {
  const main = useRef(null);
  return (
    <ApolloProvider client={client}>
      <AlertState>
        <AuthState client={client}>
          <Suspense
            fallback={
              <div className="page">
                <div className="spinner">
                  <Spinner
                    size={50}
                    style={{
                      margin: "auto",
                    }}
                  />
                </div>
              </div>
            }
          >
            <Router>
              <Navbar />
              <div className="app-elements">
                <main ref={main}>
                  <Alert />
                  <Routes main={main} />
                </main>
                <Footer />
              </div>
            </Router>
          </Suspense>
        </AuthState>
      </AlertState>
    </ApolloProvider>
  );
};

export default App;
