import React, { lazy, Suspense } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  split,
} from "@apollo/client";
import Cookies from "js-cookie"; // Kept for now, other parts of app might use it.
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import createUploadLink from "apollo-upload-client/public/createUploadLink.js";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { RecoilRoot } from "recoil";
import RouterContainer from "./Routing/RouterContainer";

// 1. Modify WebSocketLink URI and add connectionParams
const wsLink = new WebSocketLink({
  // uri: process.env.REACT_APP_WEBSOCKET_GRAPHQL_URL || "ws://localhost:4000/graphql", // With Env Var
  uri: "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
    connectionParams: () => {
      // The task asks for localStorage, but frontend currently uses Cookies for 'token'.
      // Using localStorage.getItem('token') as per instruction.
      // This assumes the token is stored directly, without "Bearer " prefix.
      const token = localStorage.getItem('token'); 
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
      return {};
    },
  },
});

// 2. Modify createUploadLink (HttpLink) URI
const httpLink = createUploadLink({ 
  // uri: process.env.REACT_APP_HTTP_GRAPHQL_URL || "http://localhost:4000/graphql", // With Env Var
  uri: "http://localhost:4000/graphql" 
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink // Use the modified httpLink
);

// 3. Remove CSRF Token Header & Verify Apollo Client Instantiation
const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  // credentials: "same-origin", // This might need to be 'include' or removed if CORS issues arise, especially if backend is on a different domain.
  link: splitLink,
  dataIdFromObject: (object) => object.id,
  // headers: removed (CSRF token header is gone)
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
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
          <RouterContainer />
        </Suspense>
      </RecoilRoot>
    </ApolloProvider>
  );
};

export default App;
