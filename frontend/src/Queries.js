import {
  gql
} from "@apollo/client";

export const ADD_USER = gql `
  mutation createUser($username: String!, $password: String!) {
    createUser(input: { username: $username, password: $password }) {
      ok
      message
      user {
        username
        id
        password
      }
    }
  }
`;

export const LOGIN_USER = gql `
  mutation tokenAuth($username: String!, $password: String!) {
    tokenAuth(input: { username: $username, password: $password }) {
      payload
      token
      refreshToken
      user {
        id
      }
    }
  }
`;


export const GET_POSTS = gql `
  query posts($cursor: String) {
    posts(first: 45, after: $cursor, orderBy: "created_at") {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          title
          text
          likeCount
          commentCount
          createdAt
          user {
            username
            id
          }
        }
      }
    }
  }
`;

export const FOLLOWING_POSTS = gql `
  query followingPosts($cursor: String) {
    followingPosts(first: 45, after: $cursor, orderBy: "created_at") {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          title
          text
          likeCount
          commentCount
          createdAt
          user {
            username
            id
          }
        }
      }
    }
  }
`;

export const GET_POST = gql `
  query post($id: ID!, $cursor: String) {
    posts(id: $id) {
      edges {
        node {
          id
          title
          text
          likeCount
          commentCount
          createdAt
          user {
            username
            id
          }
        }
      }
    }

    postComments(id: $id, after: $cursor) {
      edges {
        node {
          id
          user {
            username
            id
          }
          content
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;


export const LIKED = gql `
  query liked($post_id: ID!) {
    liked(id: $post_id)
  }
`;

export const VERIFY_TOKEN = gql `
  mutation verifyToken($token: String!) {
    verifyToken(input: { token: $token }) {
      payload
    }
  }
`;

export const LOGOUT_USER = gql `
  mutation($token: String!) {
    deleteTokenCookie(input: {}) {
      deleted
    }
    deleteRefreshTokenCookie(input: {}) {
      deleted
    }
     revokeToken(input: {
       refreshToken: $token
     }) {
       revoked
     }
  }
`;

export const LOGOUT_LOGGED_OUT = gql `
  mutation logoutLoggedOut {
    deleteTokenCookie(input: {}) {
      deleted
    }
    deleteRefreshTokenCookie(input: {}) {
      deleted
    }
  }
`;

export const LIKE = gql `
  mutation like($post_id: ID!) {
    likePost(input: {postId: $post_id}) {
      ok
      post {
        likeCount
      }
    }
  }
`;

export const CREATE_POST = gql `
  mutation createPost($text: String!, $title: String!) {
    createPost(input: { text: $text, title: $title }) {
      ok
      post {
        id
        title
        text
        likeCount
        commentCount
        createdAt
        user {
          username
          id
        }
      }
    }
  }
`;

export const REFRESH_TOKEN = gql `
  mutation refreshToken($token: String!) {
    refreshToken(input: { refreshToken: $token }) {
      token
      refreshToken
    }
  }
`;

export const SELF_USER = gql `
  query self_user {
    selfUser {
      id
      username
      postCount
      followerCount
    }
  }
`;

export const SELF_POSTS = gql `
  query self_posts($cursor: String) {
    selfPost(first: 20, orderBy: "created_at", after: $cursor) {
      edges {
        node {
          id
          likeCount
          commentCount
          text
          title
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_USER = gql `
  query get_user($id: ID!) {
    userGet(id: $id) {
      username
      postCount
      followerCount
    }

    isFollowing(id: $id)
  }
`;

export const USER_POSTS = gql `
  query user_posts($cursor: String, $id: ID!) {
    userPost(first: 10, orderBy: "created_at", after: $cursor, id: $id) {
      edges {
        node {
          id
          likeCount
          commentCount
          text
          title
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const FOLLOW = gql `
  mutation followUser($id: ID!) {
    followUser(input: {id: $id}) {
      ok
      user {
        id
        followerCount
      }
      message
    }
  }
`;

export const UPDATE_USER = gql `
  mutation updateUser($password: String!, $username: String, $newPassword: String) {
    updateUser(input: {
      password: $password,
      username: $username,
      newP: $newPassword
    }) {
      ok
      message
    }
  }
`;

export const CREATE_COMMENT = gql `
  mutation createComment($id: ID!, $comment: String!){
    createComment(input: {
      post: $id,
      content: $comment
    }) {
      ok
      comment {
        id
        user {
          username
          id
        }
        content
        createdAt
      }
      __typename
    }
  }
`;

export const NOTIFICATION_NUMBER = gql `
  query noftificationNumber  {
    notificationNumber
  }
`;

export const GET_NOTIFICATIONS = gql `
  query($cursor: String) {
    selfNotification(orderBy: "-created_at", after: $cursor, first: 18) {
      pageInfo {
        hasNextPage
        endCursor
      }

      edges {
        node {
          createdAt
          category
          sender {
            id
            username
          }
          post {
            id
            title
          }
          comment {
            id
            content
            post {
              id
              title
            }
          }
          read
          id
        }
      }
    }
  }
`;

export const READ_NOTIFICATION = gql `
  mutation readNotification($id: ID) {
    readNotification(input: {id: $id}) {
      ok
    }
  }
`;