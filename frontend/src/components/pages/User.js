import React, { useState, useEffect, lazy } from "react";
import { GET_USER, USER_POSTS } from "../../Queries";
import { useQuery } from "@apollo/client";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import { Redirect } from "react-router-dom";
import { authAtom, alertAtom } from "../../atoms";
import { useRecoilValue, useResetRecoilState } from "recoil";

const UserInfo = lazy(() => import("../layout/UserInfo"))
const Offline = lazy(() => import("./Offline"));
const Posts = lazy(() => import("../post/Posts"));

const User = ({ match }) => {
  const {
    loading: user_loading,
    data: user_data,
    error: user_error,
  } = useQuery(GET_USER, { variables: { id: match.params.id } });
  const { loading, data, error, fetchMore, refetch } = useQuery(USER_POSTS, {
    variables: { id: match.params.id },
  });
  const { user } = useRecoilValue(authAtom);
  const removeAlert = useResetRecoilState(alertAtom);
  const [spin, setSpin] = useState(false)

  useEffect(() => {
    removeAlert();
  }, []);

  if (user == match.params.id) {
    return <Redirect to="/account" />;
  }

  if (loading || !data || user_loading || !user_data)
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

  if (error || user_error) {
    return <Offline />;
  }

  const more = () => {
    fetchMore({
      query: USER_POSTS,
      variables: {
        cursor: data.userPost.pageInfo.endCursor,
        id: match.params.id,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        setSpin(true);
        const newEdges = fetchMoreResult.userPost.edges;
        const pageInfo = fetchMoreResult.userPost.pageInfo;

        if (!previousResult.userPost.pageInfo.hasNextPage) {
          setSpin(false);
          return previousResult;
        }

        return newEdges.length
          ? {
              userPost: {
                __typename: previousResult.userPost.__typename,
                edges: [...previousResult.userPost.edges, ...newEdges],
                pageInfo,
              },
            }
          : previousResult;
      },
    });
  };

  if (user_data.userGet == null) {
    return <h1>User Does Not Exist</h1>;
  }



  const { userPost } = data;

  return (
    <>
     <UserInfo user={user_data.userGet} />
      <Posts
        posts={userPost.edges}
        self={true}
        username={user_data.userGet.username}
        id={match.params.id}
        more={more}
        spin={spin}
        refetch={refetch}
        imagePath={user_data.userGet.imagePath}
      />
    </>
  );
};

export default User;
