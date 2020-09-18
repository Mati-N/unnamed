import React, { lazy, Suspense } from "react";
import { HashRouter as Router } from "react-router-dom";
import AuthState from "../context/auth/AuthState";
import AlertState from "../context/alert/AlertState";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Cookies from "js-cookie";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
const Navbar = lazy(() => import("./layout/Navbar"));
const Alert = lazy(() => import("./layout/Alert"));
const Routes = lazy(() => import("./Routing/Routes"));

const client = new ApolloClient({
  uri: "/api/",
  cache: new InMemoryCache(),
  connectToDevTools: true,
  credentials: "same-origin",
  headers: {
    "X-CSRFToken": Cookies.get("csrftoken"),
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AlertState>
        <AuthState client={client}>
          <Suspense
            fallback={
              <div className="spinner">
                <Spinner
                  size={50}
                  style={{
                    margin: "auto",
                  }}
                />
              </div>
            }
          >
            <Router>
              <Navbar />
              <br className="break" />
              <main>
                <Alert />
                <Routes />
              </main>
              <footer>
                <a
                  style={{
                    opacity: 0,
                  }}
                  className="skip-link"
                  href="#root"
                >
                  Skip to main
                </a>
              </footer>
            </Router>
          </Suspense>
        </AuthState>
      </AlertState>
    </ApolloProvider>
  );
}

export default App;
