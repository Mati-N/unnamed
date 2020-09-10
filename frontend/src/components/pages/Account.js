import React, { useState, useContext, useEffect, lazy } from "react";
import { SELF_POSTS, SELF_USER } from "../../Queries";
import { useQuery } from "@apollo/client";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import AuthContext from "../../context/auth/AuthContext";
import AlertContext from "../../context/alert/AlertContext";
const Posts = lazy(() => import("../post/Posts"));
const AccountInfo = lazy(() => import("../layout/AccountInfo"));

const Account = () => {
  const {
    loading: user_loading,
    data: user_data,
    error: user_error,
  } = useQuery(SELF_USER);
  const { loading, data, error, fetchMore } = useQuery(SELF_POSTS);
  const { doLogout: Logout, user } = useContext(AuthContext);
  const { removeAlert } = useContext(AlertContext);
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    removeAlert();
  }, []);

  if (loading || !data || user_loading)
    return (
      <div className="spinner">
        <Spinner
          size={50}
          style={{
            margin: "auto",
          }}
        />
      </div>
    );

  if (error || user_error) return `${error}`;

  const more = () => {
    fetchMore({
      query: SELF_POSTS,
      variables: { cursor: data.selfPost.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        setSpin(true);
        console.log(fetchMoreResult);
        const newEdges = fetchMoreResult.selfPost.edges;
        const pageInfo = fetchMoreResult.selfPost.pageInfo;

        if (!previousResult.selfPost.pageInfo.hasNextPage) {
          setSpin(false);
          return previousResult;
        }

        return newEdges.length
          ? {
              selfPost: {
                __typename: previousResult.selfPost.__typename,
                edges: [...previousResult.selfPost.edges, ...newEdges],
                pageInfo,
              },
            }
          : previousResult;
      },
    });
  };

  const { selfPost: post } = data;
  return (
    <>
      <AccountInfo user_data={user_data} Logout={Logout} />
      <Posts
        posts={post.edges}
        self={true}
        id={user}
        username="You"
        more={more}
        spin={spin}
      />
    </>
  );
};

export default Account;
