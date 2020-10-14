import React, { lazy, Suspense } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  split,
} from "@apollo/client";
import Cookies from "js-cookie";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import createUploadLink from "apollo-upload-client/public/createUploadLink.js";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { RecoilRoot } from "recoil";
import RouterContainer from "./Routing/RouterContainer";

const wsLink = new WebSocketLink({
  uri: "ws://" + location.host + "/api/",
  options: {
    reconnect: true,
  },
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
  createUploadLink({ uri: "/api/" })
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  credentials: "same-origin",
  link: splitLink,
  dataIdFromObject: (object) => object.id,
  headers: {
    "X-CSRFToken": Cookies.get("csrftoken"),
  },
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
