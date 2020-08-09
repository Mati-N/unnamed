import { gql } from "@apollo/client";

export const ADD_USER = gql`
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

export const LOGIN_USER = gql`
  mutation tokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      payload
      token
    }
  }
`;
