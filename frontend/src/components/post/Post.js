import React, { useState, lazy } from "react";
import { Waypoint } from "react-waypoint";
import { useQuery } from "@apollo/client";
import { GET_POST } from "../../Queries";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../layout/Error";

const PostItem = lazy(() => import("./PostItem"));
const Comments = lazy(() => import("./Comments"));

const Post = ({
  match: {
    params: { id },
  },
}) => {
  const { loading, data, error, fetchMore, refetch } = useQuery(GET_POST, {
    variables: { id },
  });
  const [spin, setSpin] = useState(true);

  const more = () => {
    fetchMore({
      query: GET_POST,
      variables: { cursor: data.post.postComments.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        setSpin(true);
        if (!previousResult.post.postComments.pageInfo.hasNextPage) {
          setSpin(false);
          return previousResult;
        }
        const newEdges = fetchMoreResult.post.postComments.edges;
        const pageInfo = fetchMoreResult.post.postComments.pageInfo;

        return newEdges.length
          ? {
              post: {
                ...previousResult.post,
                postComments: {
                  __typename: previousResult.post.postComments.__typename,
                  edges: [...previousResult.post.posts.edges, ...newEdges],
                  pageInfo,
                },
              },
            }
          : previousResult;
      },
    });
  };

  if (loading && !data) {
    return <Spinner size={40} />;
  }
  const { node } = data.posts.edges[0];

  console.log(data);
  return (
    <ErrorBoundary FallbackComponent={Error}>
      <div className="main">
        <PostItem
          key={node.id}
          likes={node.likers.length}
          comments={node.commentSet.length}
          user_id={node.user.id}
          username={node.user.username}
          {...node}
        />
        <Comments comments={data.postComments.edges} />

        <Waypoint onEnter={more}>
          <div className="spinner">
            {(loading || spin) && <Spinner size={40} />}
          </div>
        </Waypoint>
      </div>
    </ErrorBoundary>
  );
};

export default Post;
