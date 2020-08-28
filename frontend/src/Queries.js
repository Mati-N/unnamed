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
    posts(first: 45, after: $cursor, orderBy: "creation") {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          title
          text
          likers {
            id
          }
          commentSet {
            edges {
              node {
                id
              }
            }
          }
          creation
          commentCount
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
          likers {
            id
          }
          commentSet {
            edges {
              node {
                id
              }
            }
          }
          creation
          commentCount
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
  mutation {
    deleteTokenCookie(input: {}) {
      deleted
    }
  }
`;

export const LIKE = gql `
  mutation like($post_id: ID!) {
    likePost(postId: $post_id) {
      ok
      post {
        likers {
          id
        }
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
        likers {
          id
        }
        commentSet {
          edges {
            node {
              id
            }
          }
        }
        creation
        commentCount
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

export const REVOKE_TOKEN = gql `
  mutation revokeToken($token: String!) {
    revokeToken(input: { refreshToken: $token }) {
      revoked
    }
  }
`;

export const SELF_USER = gql `
  query self_user {
    user {
      id
      username
      posts {
        edges {
          node {
            id
          }
        }
      }
      followers {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

export const SELF_POSTS = gql `
  query self_posts($cursor: String) {
    post(first: 20, orderBy: "creation", after: $cursor) {
      edges {
        node {
          id
          likers {
            id
          }
          commentSet {
            edges {
              node {
                id
              }
            }
          }
          text
          title
          creation
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
      posts {
        edges {
          node {
            id
          }
        }
      }
      followers {
        edges {
          node {
            id
          }
        }
      }
    }

    isFollowing(id: $id)
  }
`;

export const USER_POSTS = gql `
  query user_posts($cursor: String, $id: ID!) {
    userPost(first: 10, orderBy: "creation", after: $cursor, id: $id) {
      edges {
        node {
          id
          likers {
            id
          }
          commentSet {
            edges {
              node {
                id
              }
            }
          }
          text
          title
          creation
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
    followUser(id: $id) {
      ok
      user {
        id
        followers {
          edges {
            node {
              id
            }
          }
        }
      }
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
      }
      __typename
    }
  }
`;