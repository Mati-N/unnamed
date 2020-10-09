import React, { useState, lazy } from "react";
import { GET_POSTS } from "../../Queries";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
const Offline = lazy(() => import("./Offline"));
const Posts = lazy(() => import("../post/Posts"));

function Home() {
  const { loading, data, error, fetchMore, refetch } = useQuery(GET_POSTS, {
    pollInterval: 1000000,
  });
  const [spin, setSpin] = useState(true);

  if (error) {
    return (
      <>
        <Offline />
        <button className="btn btn-teal" onClick={refetch}>
          Refresh
        </button>
      </>
    );
  }

  const more = () => {
    fetchMore({
      query: GET_POSTS,
      variables: { cursor: data.posts.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        setSpin(true);
        if (!previousResult.posts.pageInfo.hasNextPage) {
          setSpin(false);
          return previousResult;
        }
        const newEdges = fetchMoreResult.posts.edges;
        const pageInfo = fetchMoreResult.posts.pageInfo;

        return newEdges.length
          ? {
              posts: {
                __typename: previousResult.posts.__typename,
                edges: [...previousResult.posts.edges, ...newEdges],
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
          <a className="nav-link active">All Posts</a>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/">
            Following
          </Link>
        </li>
      </ul>
      {(loading || !data) && (
        <div className="spinner">
          <Spinner
            size={50}
            style={{
              margin: "auto",
            }}
          />
        </div>
      )}
      {(!loading || data) && (
        <Posts
          posts={data.posts.edges}
          self={false}
          id={null}
          more={more}
          spin={spin}
          refetch={refetch}
        />
      )}
    </>
  );
}

export default Home;
