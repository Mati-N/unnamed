import React, { useState } from "react";
import PostItem from "../post/PostItem";
import { Waypoint } from "react-waypoint";
import { useQuery, readQuery } from "@apollo/client";
import { GET_POSTS, GET_COMMENTS } from "../../Queries";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";

const Post = ({
  match: {
    params: { id },
  },
}) => {
  const { loading, data, error, fetchMore, refetch } = useQuery(GET_COMMENTS, {
    variables: { id },
  });
  const { post } = readQuery({
    query: GET_POSTS,
    variables: {
      id,
    },
  });

  console.log(post);
  const [spin, setSpin] = useState(true);

  const more = () => {
    fetchMore({
      query: GET_COMMENTS,
      variables: { cursor: data.postComments.pageInfo.endCursor },
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
              postComments: {
                __typename: previousResult.postComments.__typename,
                edges: [...previousResult.posts.edges, ...newEdges],
                pageInfo,
              },
            }
          : previousResult;
      },
    });
  };

  return (
    <div className="main">
      <PostItem
        key={post.id}
        {...post}
        likes={post.likers.length}
        comments={post.commentSet.length}
        user_id={post.user.id}
        username={post.user.username}
      />
      {(loading || spin) && <Spinner />}
    </div>
  );
};

export default Post;
