const { gql } = require('apollo-server-express');

// Basic DateTime scalar (can be replaced with a more robust one later)
const typeDefs = gql\`
  scalar DateTime
  scalar Upload # Added for file uploads

  type Query {
    hello: String
    selfUser: User
    user(id: ID!): User
    
    # Post and Comment Queries
    allPosts(first: Int, after: String, last: Int, before: String): PostConnection
    post(id: ID!): Post
  }

  # Payload Types for Mutations
  type AuthPayload {
    token: String!
    refreshToken: String # Optional, depending on frontend needs
    user: User!
    # payload: String # From original frontend query, can omit if not used
  }

  type CreateUserPayload {
    ok: Boolean!
    message: String
    user: User # The created user, might exclude password or sensitive fields
  }
  
  type UpdateUserPayload {
    ok: Boolean!
    message: String
    user: User # The updated user
  }

  # Input types (optional, but can help structure complex inputs)
  # input UpdateUserInput {
  #   username: String
  #   bio: String
  #   # Add other fields that can be updated
  # }
  
  type PostPayload {
      ok: Boolean!
      message: String
      post: Post
  }

  type CommentPayload {
      ok: Boolean!
      message: String
      comment: Comment
      # post: Post # Could return the parent post if useful, e.g., for commentCount update
  }

  type Mutation {
    _empty: String # Placeholder, real mutations will be added later
    
    # Auth Mutations
    createUser(username: String!, email: String!, password: String!, firstName: String, lastName: String, bio: String, profileImageFile: Upload): CreateUserPayload!
    tokenAuth(username: String!, password: String!): AuthPayload! # For login
    updateUser(username: String, currentPassword: String!, newPassword: String, bio: String, profileImageFile: Upload): UpdateUserPayload!
    refreshToken(token: String!): AuthPayload # Or a simpler payload with just new tokens
    revokeToken(refreshToken: String!): Boolean

    # Post Mutations
    createPost(title: String!, text: String!): PostPayload!
    # updatePost(id: ID!, title: String, text: String): PostPayload # Optional
    # deletePost(id: ID!): PostPayload # Optional

    # Comment Mutations
    createComment(postId: ID!, content: String!): CommentPayload!

    # Conceptual example of a mutation that might use file upload:
    # updateUserProfile(username: String, profileImage: Upload): User
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean
    startCursor: String
    hasPreviousPage: Boolean
  }

  # User Type and related connections/edges
  type User {
    id: ID!
    username: String!
    email: String
    bio: String
    profileImage: String # Corresponds to imagePath
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relational fields
    posts(first: Int, after: String, last: Int, before: String): PostConnection
    comments(first: Int, after: String, last: Int, before: String): CommentConnection
    
    # Counts and flags
    followerCount: Int
    followingCount: Int # Added for completeness, though not explicitly in Django UserNode
    postCount: Int
    isFollowing: Boolean # Indicates if the requesting user is following this user
  }

  type UserEdge {
    node: User
    cursor: String!
  }

  type UserConnection {
    pageInfo: PageInfo!
    edges: [UserEdge]
  }

  # Post Type and related connections/edges
  type Post {
    id: ID!
    title: String!
    text: String!
    author: User! # Renamed from 'user' for clarity if 'user' is too generic
    createdAt: DateTime!
    updatedAt: DateTime!

    # Relational fields
    comments(first: Int, after: String, last: Int, before: String): CommentConnection
    
    # Counts and flags
    likeCount: Int
    commentCount: Int
    liked: Boolean # Indicates if the requesting user liked this post
  }

  type PostEdge {
    node: Post
    cursor: String!
  }

  type PostConnection {
    pageInfo: PageInfo!
    edges: [PostEdge]
  }

  # Comment Type and related connections/edges
  type Comment {
    id: ID!
    content: String!
    author: User! # Renamed from 'user'
    post: Post!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type CommentEdge {
    node: Comment
    cursor: String!
  }

  type CommentConnection {
    pageInfo: PageInfo!
    edges: [CommentEdge]
  }

  # Notification Type and related connections/edges
  type Notification {
    id: ID!
    category: String!
    read: Boolean!
    sender: User!
    recipient: User!
    post: Post # Nullable as per Django model
    comment: Comment # Nullable as per Django model
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type NotificationEdge {
    node: Notification
    cursor: String!
  }

  type NotificationConnection {
    pageInfo: PageInfo!
    edges: [NotificationEdge]
  }
\`;

module.exports = typeDefs;
