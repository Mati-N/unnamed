import React, { useState } from "react";
import PostItem from "../post/PostItem";
import { Waypoint } from "react-waypoint";
import { useQuery } from "@apollo/client";
import { GET_POST } from "../../Queries";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";

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
      query: GET_COMMENTS,
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
  console.log(data.posts.edges);
  const { node } = data.posts.edges[0];

  return (
    <div className="main">
      <PostItem
        key={node.id}
        {...node}
        likes={node.likers.length}
        comments={node.commentSet.length}
        user_id={node.user.id}
        username={node.user.username}
      />
      {(loading || spin) && <Spinner />}
    </div>
  );
};

export default Post;
