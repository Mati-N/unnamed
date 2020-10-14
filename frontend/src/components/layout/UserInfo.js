import React from 'react'
import { useMutation, gql } from "@apollo/client";
import { FOLLOW } from "../../Queries";
import Avatar from "@material-ui/core/Avatar";

const UserInfo = ({ user }) => {
  const [follow] = useMutation(FOLLOW);

    const followIt = () => {
    follow({
      variables: { id: user.id },
      update: (cache, { data }) => {
        if (cache) {
          cache.writeFragment({
            id: `UserNode:${data.followUser.user.id}`,
            fragment: gql`
              fragment User on UserNode {
                followerCount
                isFollowing
              }
            `,
            data: {
              followerCount: data.followUser.user.followerCount,
              isFollowing: data.followUser.user.isFollowing,
            },
          });
        }
      }
    });
  };
    return (
         <div className="account-info">
        <div className="account-info-top">
          <Avatar
            alt="profile picture"
            src={user.imagePath}
            variant="circle"
            style={{
              margin: "0.4em",
            }}
          >
            {user.username.substring(0, 1)}
          </Avatar>
          <span className="username inline-block">
            {user.username}
          </span>
        </div>

        <div className="info-mini">
          <button className="btn btn-teal" onClick={followIt}>
            {user.isFollowing ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-user-plus"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="rgb(248, 248, 248)"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <circle cx="9" cy="7" r="4" />
                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                <path d="M16 11h6m-3 -3v6" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-user-minus"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="rgb(248, 248, 248)"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <circle cx="9" cy="7" r="4" />
                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                <line x1="16" y1="11" x2="22" y2="11" />
              </svg>
            )}{" "}
            {user.isFollowing ? "Unfollow" : "Follow"}
          </button>
          <span className="info">
            {user.postCount > 0
              ? user.postCount
              : "No"}{" "}
            Post{user.postCount > 1 ? "s" : ""}
          </span>
          <span className="info">
            {user.followerCount > 0 ? user.followerCount : "No"} Follower
            {user.followerCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    )
}

export default UserInfo
