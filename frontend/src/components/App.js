import React, { lazy, Suspense } from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Cookies from "js-cookie";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import { createUploadLink } from "apollo-upload-client";
import { RecoilRoot } from "recoil";
import RouterContainer from "./Routing/RouterContainer";

const client = new ApolloClient({
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
