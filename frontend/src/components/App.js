import React from "react";
import { HashRouter as Router } from "react-router-dom";
import Routes from "./Routing/Routes";
import Navbar from "./layout/Navbar";
import Alert from "./layout/Alert";
import AuthState from "../context/auth/AuthState";
import AlertState from "../context/alert/AlertState";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Cookies from "js-cookie";

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
        <AuthState>
          <Router>
            <Navbar />

            <div className="app">
              <Alert />
              <Routes />
            </div>
          </Router>
        </AuthState>
      </AlertState>
    </ApolloProvider>
  );
}

export default App;
