import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FOLLOWING_POSTS } from "../../Queries";
import { useQuery } from "@apollo/client";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
const Offline = React.lazy(() => import("./Offline"));
const Posts = React.lazy(() => import("../post/Posts"));

function FollowingPosts() {
  const { loading, data, error, fetchMore, refetch } = useQuery(
    FOLLOWING_POSTS
  );
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    if (!loading) {
      setSpin(false);
    }
  }, [loading]);

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
    if (!data?.followingPosts?.pageInfo?.hasNextPage) {
      setSpin(false);
      return;
    }

    setSpin(true);
    fetchMore({
      variables: {
        cursor: data.followingPosts.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        const newEdges = fetchMoreResult.followingPosts.edges;
        const pageInfo = fetchMoreResult.followingPosts.pageInfo;

        if (!newEdges.length) {
          return previousResult;
        }

        return {
          followingPosts: {
            __typename: previousResult.followingPosts.__typename,
            edges: [...previousResult.followingPosts.edges, ...newEdges],
            pageInfo,
          },
        };
      },
    }).finally(() => setSpin(false));
  };

  return (
    <>
      <ul className="nav nav-pills nav-fill home-pages">
        <li className="nav-item">
          <NavLink to="/all" className="nav-link" activeClassName="active" exact>
            All Posts
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/" className="nav-link" activeClassName="active" exact>
            Following
          </NavLink>
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
