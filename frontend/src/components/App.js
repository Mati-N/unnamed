import React from "react";
import Register from "./auth/Register";
import Login from "./auth/Login";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "./pages/Home";
import AuthState from "../context/auth/AuthState";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/api/",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthState>
        <Router>
          <div className="app">
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/home" component={Home} />
            </Switch>
          </div>
        </Router>
      </AuthState>
    </ApolloProvider>
  );
}

export default App;
