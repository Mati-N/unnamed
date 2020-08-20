import React from "react";
import { HashRouter as Router } from "react-router-dom";
import Routes from "./Routing/Routes";
import Navbar from "./layout/Navbar";
import Alert from "./layout/Alert";
import AuthState from "../context/auth/AuthState";
import AlertState from "../context/alert/AlertState";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/api/",
  cache: new InMemoryCache(),
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
