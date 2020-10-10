import React, { lazy, Suspense } from "react";
import { HashRouter as Router } from "react-router-dom";
import AuthState from "../context/auth/AuthState";
import AlertState from "../context/alert/AlertState";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Cookies from "js-cookie";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import createUploadLink from "apollo-upload-client/public/createUploadLink.js";
const Navbar = lazy(() => import("./layout/Navbar"));
const Alert = lazy(() => import("./layout/Alert"));
const Routes = lazy(() => import("./Routing/Routes"));
const Footer = lazy(() => import("./layout/Footer"));

const client = new ApolloClient({
  uri: "/api/",
  cache: new InMemoryCache(),
  connectToDevTools: true,
  credentials: "same-origin",
  link: createUploadLink({ uri: "/api/" }),
  dataIdFromObject: (object) => object.id,
  headers: {
    "X-CSRFToken": Cookies.get("csrftoken"),
  },
});

const App = () => {
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
              <div className="app-elements">
                <main>
                  <Alert />
                  <Routes />
                </main>
                <Footer />
              </div>
              <Navbar />
            </Router>
          </Suspense>
        </AuthState>
      </AlertState>
    </ApolloProvider>
  );
};

export default App;
