import { gql } from "@apollo/client";

export const UPDATE_PROFILE_IMAGE_MUTATION = gql`
  mutation updateProfileImage($file: Upload!) {
    updateProfileImage(file: $file) {
      id
      username
      profile_image # Ensure this matches the backend User model field
    }
  }
`;

// Also, let's add SELF_USER query here as it's user-related and Account page might need it.
// This query might need adjustment based on what Account.js displays.
// Assuming it's similar to the old SELF_USER but with profile_image.
export const GET_SELF_USER_PROFILE = gql`
  query selfUserProfile {
    me { # Changed from selfUser to 'me' as it's common in new backend
      id
      username
      email 
      bio # Added bio as it's part of User type
      profile_image
      followerCount # Assuming these are direct fields on User type
      followingCount
    }
  }
`;
