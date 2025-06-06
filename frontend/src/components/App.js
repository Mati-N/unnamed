import React, { lazy, Suspense } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
// import Cookies from "js-cookie"; // No longer needed for CSRF
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import createUploadLink from "apollo-upload-client/public/createUploadLink.js";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { RecoilRoot } from "recoil";
import RouterContainer from "./Routing/RouterContainer";

const wsLink = new WebSocketLink({
  uri: "ws://" + location.host + "/api/graphql",
  options: {
    reconnect: true,
  },
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const httpLink = createUploadLink({ uri: "/api/graphql" });
const authHttpLink = authLink.concat(httpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authHttpLink // Use the authenticated HTTP link here
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  credentials: "same-origin", // Important for cookies if ever needed, but not for Bearer token
  link: splitLink,
  dataIdFromObject: (object) => object.id,
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
