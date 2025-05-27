import React, { lazy, Suspense } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  split,
} from "@apollo/client";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import { createUploadLink } from "apollo-upload-client"; // Standard import
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context"; // For auth headers
import { RecoilRoot } from "recoil";
import RouterContainer from "./Routing/RouterContainer";

const GRAPHQL_HTTP_URI = "http://localhost:4000/graphql";
const GRAPHQL_WS_URI = "ws://localhost:4000/graphql";

// HTTP link with upload capabilities
const uploadLink = createUploadLink({ uri: GRAPHQL_HTTP_URI });

// Auth link to set authorization headers for HTTP requests
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token"); // Get token from localStorage
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", // Use Bearer scheme
    },
  };
});

// WebSocket link for subscriptions
const wsLink = new WebSocketLink({
  uri: GRAPHQL_WS_URI,
  options: {
    reconnect: true,
    connectionParams: () => { // Pass token for WebSocket connection
      const token = localStorage.getItem("token");
      return {
        Authorization: token ? `Bearer ${token}` : "", // For backend to verify
        authToken: token, // Alternative for some setups
      };
    },
  },
});

// Combine authLink with uploadLink for HTTP requests
const httpAuthUploadLink = authLink.concat(uploadLink);

// Split link to direct traffic: subscriptions via WS, queries/mutations via HTTP
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // For subscriptions
  httpAuthUploadLink // For queries and mutations
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: (object) => object.id || null, // Robust data ID extraction
  }),
  connectToDevTools: true,
  link: splitLink,
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
