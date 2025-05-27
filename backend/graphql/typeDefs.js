const { gql } = require('apollo-server-express');

const typeDefs = gql\`
  scalar DateTime

  type User {
    id: ID!
    username: String!
    email: String!
    bio: String
    profile_image: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    dummy: String # Required for Apollo Server to start if no other queries are defined
    posts: [Post!]!
    post(id: ID!): Post
    userPosts(userId: ID!): [Post!]!
    followingPosts: [Post!]! # Requires auth
    selfPosts: [Post!]! # Requires auth
  }

  type Post {
    id: ID!
    title: String!
    text: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
  }

  input CreatePostInput {
    title: String!
    text: String!
  }

  type Comment {
    id: ID!
    content: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    post: Post!
    likeCount: Int!
  }

  input CreateCommentInput {
    postId: ID!
    content: String!
  }

  type Like {
    id: ID!
    user: User!
    post: Post!
  }

  input LikePostInput {
    postId: ID!
  }

  type Following {
    id: ID!
    targetUser: User!
    followerUser: User!
  }

  input FollowUserInput {
    userId: ID!
  }

  type Query {
    dummy: String # Required for Apollo Server to start if no other queries are defined
    posts: [Post!]!
    post(id: ID!): Post
    userPosts(userId: ID!): [Post!]!
    followingPosts: [Post!]! # Requires auth
    selfPosts: [Post!]! # Requires auth
    postComments(postId: ID!): [Comment!]!
    isLiked(postId: ID!): Boolean! # Requires auth
    isFollowing(userId: ID!): Boolean! # Requires auth
  }

  type Mutation {
    signup(input: UserInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    createPost(input: CreatePostInput!): Post! # Requires auth
    createComment(input: CreateCommentInput!): Comment! # Requires auth
    likePost(input: LikePostInput!): Post! # Requires auth
    followUser(input: FollowUserInput!): User! # Requires auth
    markNotificationRead(input: MarkNotificationReadInput!): Notification # Requires auth
  }

  type Notification {
    id: ID!
    category: String!
    read: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    sender: User # Can be null if system generated, though usually a user
    recipient: User!
    post: Post # Nullable, e.g. for a follow notification
    comment: Comment # Nullable, e.g. for a like or follow notification
  }

  input MarkNotificationReadInput {
    notificationId: ID!
  }

  type Subscription {
    notificationCreated: Notification! # Requires auth for specific user
  }

  scalar Upload
\`;

module.exports = typeDefs;
