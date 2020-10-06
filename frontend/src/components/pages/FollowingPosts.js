import React, { useState, lazy } from "react";
import { Link } from "react-router-dom";
import { FOLLOWING_POSTS } from "../../Queries";
import { useQuery } from "@apollo/client";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
const Offline = lazy(() => import("./Offline"));
const Posts = lazy(() => import("../post/Posts"));

function FollowingPosts() {
  const { loading, data, error, fetchMore, refetch } = useQuery(
    FOLLOWING_POSTS,
    {
      pollInterval: 100000,
    }
  );
  const [spin, setSpin] = useState(true);

  if (loading || !data)
    return (
      <div className="spinner">
        <Spinner
          size={50}
          style={{
            margin: "auto",
          }}
        />{" "}
      </div>
    );

  if (error) {
    return (
      <>
        <Offline />
        <button className="btn btn-teal" onClick={refetch}>
          Refresh{" "}
        </button>{" "}
      </>
    );
  }

  const more = () => {
    fetchMore({
      query: FOLLOWING_POSTS,
      variables: {
        cursor: data.followingPosts.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        setSpin(true);
        if (!previousResult.followingPosts.pageInfo.hasNextPage) {
          setSpin(false);
          return previousResult;
        }
        const newEdges = fetchMoreResult.followingPosts.edges;
        const pageInfo = fetchMoreResult.followingPosts.pageInfo;

        return newEdges.length
          ? {
              followingPosts: {
                __typename: previousResult.followingPosts.__typename,
                edges: [...previousResult.followingPosts.edges, ...newEdges],
                pageInfo,
              },
            }
          : previousResult;
      },
    });
  };

  return (
    <>
      <ul className="nav nav-pills nav-fill home-pages">
        <li className="nav-item">
          <Link to="/all" className="nav-link">
            All Posts
          </Link>
        </li>
        <li className="nav-item">
          <a className="nav-link active">Following</a>
        </li>
      </ul>
      <Posts
        posts={data.followingPosts.edges}
        self={false}
        id={null}
        spin={spin}
        more={more}
        refetch={refetch}
      />
    </>
  );
}

export default FollowingPosts;
