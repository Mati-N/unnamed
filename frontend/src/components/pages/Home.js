import React, { lazy } from "react"; // Removed useState as 'spin' is removed
// Import GET_POSTS_SIMPLIFIED from the new PostQueries.js
import { GET_POSTS_SIMPLIFIED } from "../../PostQueries"; 
import { Link } from "react-router-dom"; // Link might be removed if "Following" tab is removed
import { useQuery } from "@apollo/client";
import { ImpulseSpinner as Spinner } from "react-spinners-kit";
import Error from "../layout/Error";
// const Offline = lazy(() => import("./Offline")); // Offline component not used in current logic
const Posts = lazy(() => import("../post/Posts"));

function Home() {
  // Use GET_POSTS_SIMPLIFIED, removed pollInterval and cursor variables
  const { loading, data, error, refetch } = useQuery(GET_POSTS_SIMPLIFIED);
  // const [spin, setSpin] = useState(true); // 'spin' state removed

  // 'more' function (fetchMore logic) removed as pagination is simplified

  return (
    <>
      {/* Simplified navigation, focusing on All Posts for now */}
      <ul className="nav nav-pills nav-fill home-pages">
        <li className="nav-item">
          <a className="nav-link active" href="#">All Posts</a> {/* Changed to href="#" or remove <a> if not interactive */}
        </li>
        {/* 
        <li className="nav-item">
          <Link className="nav-link" to="/following"> {/* Assuming a route for following posts */}
            {/* Following
          </Link>
        </li>
        */}
      </ul>
      {error && <Error />}
      {/* Simplified loading check */}
      {loading && !data && ( 
        <div className="spinner" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px'}}>
          <Spinner
            size={50}
            style={{
              margin: "auto",
            }}
          />
        </div>
      )}
      {/* Pass data.posts directly to the Posts component */}
      {/* The Posts component was already updated to expect a flat array */}
      {data && data.posts && (
        <Posts
          posts={data.posts} // Changed from data.posts.edges
          self={false} // These props might need re-evaluation based on overall app auth state
          id={null}
          // imagePath might also come from a global auth state for 'self' case if needed
          // 'more' and 'spin' props removed
          refetch={refetch} // refetch might still be useful
        />
      )}
      {/* Fallback for when data is present but data.posts is not (e.g. empty response, though Posts handles empty array) */}
      {data && !data.posts && !loading && !error && (
         <p>No posts found or unable to load posts.</p>
      )}
    </>
  );
}

export default Home;
