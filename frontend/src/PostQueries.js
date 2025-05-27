import { gql } from "@apollo/client";

// Adapted GET_POSTS: Simplified by removing pagination and 'liked' field for now.
// 'orderBy' is also removed as it's a backend implementation detail.
export const GET_POSTS_SIMPLIFIED = gql`
  query posts {
    posts { # Assuming the backend 'posts' query returns an array directly
      id
      title
      text
      # likeCount # Temporarily remove if not essential for display
      # commentCount # Temporarily remove if not essential for display
      createdAt
      user {
        username
        id
        profile_image # Changed from imagePath
      }
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation createPost($title: String!, $text: String!) {
    createPost(input: { title: $title, text: $text }) {
      id
      title
      text
      createdAt
      user {
        id
        username
        profile_image # Changed from imagePath
      }
    }
  }
`;
