import React, { useEffect, useState } from "react";
import { GET_POSTS, HOME_HIGHLIGHTS } from "../../Queries";
import { NavLink } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import Error from "../layout/Error";
import HomeHighlights from "../home/HomeHighlights";
const Posts = React.lazy(() => import("../post/Posts"));

function Home() {
  const { loading, data, error, fetchMore, refetch } = useQuery(GET_POSTS, {
    pollInterval: 1000000,
  });
  const {
    loading: highlightLoading,
    data: highlightData,
    error: highlightError,
    refetch: refetchHighlights,
  } = useQuery(HOME_HIGHLIGHTS, {
    variables: {
      trendingLimit: 5,
      suggestedLimit: 5,
      hashtagLimit: 8,
      spotlightLimit: 4,
      momentumSupporterLimit: 4,
      momentumBreakoutLimit: 3,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const [spin, setSpin] = useState(false);

  useEffect(() => {
    if (!loading) {
      setSpin(false);
    }
  }, [loading]);

  const more = () => {
    if (!data?.posts?.pageInfo?.hasNextPage) {
      setSpin(false);
      return;
    }

    setSpin(true);
    fetchMore({
      variables: { cursor: data.posts.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        const newEdges = fetchMoreResult.posts.edges;
        const pageInfo = fetchMoreResult.posts.pageInfo;

        if (!newEdges.length) {
          return previousResult;
        }

        return {
          posts: {
            __typename: previousResult.posts.__typename,
            edges: [...previousResult.posts.edges, ...newEdges],
            pageInfo,
          },
        };
      },
    }).finally(() => setSpin(false));
  };

  const refreshingHighlights = highlightLoading && !!highlightData;
  const highlightsUnavailable = highlightError && !highlightData;

  return (
    <>
      <ul className="nav nav-pills nav-fill home-pages">
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName="active" exact to="/all">
            All Posts
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName="active" exact to="/">
            Following
          </NavLink>
        </li>
      </ul>
      {highlightsUnavailable && (
        <div className="alert alert-warning" role="alert">
          We couldn't load today's community highlights. Try refreshing the page.
        </div>
      )}
      {(highlightData || highlightLoading) && (
        <HomeHighlights
          insights={highlightData?.platformInsights}
          trendingPosts={highlightData?.trendingPosts || []}
          trendingHashtags={highlightData?.trendingHashtags || []}
          creatorSpotlight={highlightData?.creatorSpotlight || []}
          suggestedUsers={highlightData?.suggestedUsers || []}
          personalMomentum={highlightData?.personalMomentum}
          loading={highlightLoading && !highlightData}
          refreshing={refreshingHighlights}
          onRefresh={() => refetchHighlights().catch(() => undefined)}
        />
      )}
      {error && <Error />}
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
