import React, { useState, lazy } from "react";
import { Waypoint } from "react-waypoint";
import { useQuery } from "@apollo/client";
import { GET_POST } from "../../Queries";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";

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
      variables: { cursor: data.postComments.pageInfo.endCursor, id },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        setSpin(true);
        if (!previousResult.postComments.pageInfo.hasNextPage) {
          setSpin(false);
          return previousResult;
        }
        const newEdges = fetchMoreResult.postComments.edges;
        const pageInfo = fetchMoreResult.postComments.pageInfo;

        return newEdges.length
          ? {
              post: {
                ...previousResult.post,
                postComments: {
                  __typename: previousResult.postComments.__typename,
                  edges: [...previousResult.postComments.edges, ...newEdges],
                  pageInfo,
                },
              },
            }
          : previousResult;
      },
    });
    setSpin(false);
  };

  if (loading && !data) {
    return <Spinner size={40} />;
  }
  const { node } = data.posts.edges[0];

  return (
    <>
      <PostItem
        key={node.id}
        user_id={node.user.id}
        username={node.user.username}
        show_comment={true}
        {...node}
      />
      <Comments comments={data.postComments.edges} />

      <Waypoint onEnter={more}>
        <div className="spinner">
          {(loading || spin) && <Spinner size={40} />}
        </div>
      </Waypoint>
    </>
  );
};

export default Post;
