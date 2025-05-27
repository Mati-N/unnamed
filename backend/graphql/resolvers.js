const { User, Post, Following, Comment, Like, Notification } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AuthenticationError, UserInputError, ForbiddenError } = require('apollo-server-express');
const { Op } = require('sequelize');
const { PubSub, withFilter } = require('graphql-subscriptions');
const { GraphQLUpload } = require('graphql-upload'); // For file uploads
const cloudinary = require('../config/cloudinary'); // Cloudinary SDK

require('dotenv').config();

const pubsub = new PubSub();
const NOTIFICATION_CREATED = 'NOTIFICATION_CREATED';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in your .env file');
}

const resolvers = {
  Query: {
    dummy: () => "GraphQL server is running!",
    posts: async () => {
      return Post.findAll({
        include: [{ model: User, as: 'user' }],
        order: [['createdAt', 'DESC']],
      });
    },
    post: async (_, { id }) => {
      return Post.findByPk(id, {
        include: [{ model: User, as: 'user' }],
      });
    },
    userPosts: async (_, { userId }) => {
      return Post.findAll({
        where: { userId },
        include: [{ model: User, as: 'user' }],
        order: [['createdAt', 'DESC']],
      });
    },
    followingPosts: async (_, __, { user, models }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to see posts from users you follow.');
      }
      const currentUser = await models.User.findByPk(user.userId, {
        include: [{
          model: models.Following,
          as: 'following',
          attributes: ['targetId'] // Only need the IDs of users being followed
        }]
      });

      if (!currentUser || !currentUser.following) {
        return []; // Or handle as appropriate if user has no followings
      }

      const followedUserIds = currentUser.following.map(f => f.targetId);

      // Include current user's posts as well
      const allUserIds = [...followedUserIds, user.userId];

      return models.Post.findAll({
        where: {
          userId: {
            [Op.in]: allUserIds,
          },
        },
        include: [{ model: models.User, as: 'user' }],
        order: [['createdAt', 'DESC']],
      });
    },
    selfPosts: async (_, __, { user, models }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to see your posts.');
      }
      return models.Post.findAll({
        where: { userId: user.userId },
        include: [{ model: models.User, as: 'user' }],
        order: [['createdAt', 'DESC']],
      });
    },
    postComments: async (_, { postId }, { models }) => {
      return models.Comment.findAll({
        where: { postId },
        include: [
          { model: models.User, as: 'user' },
          { model: models.Post, as: 'post' },
        ],
        order: [['createdAt', 'ASC']], // Or 'DESC' depending on desired order
      });
    },
    isLiked: async (_, { postId }, { user, models }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to check if you liked a post.');
      }
      const like = await models.Like.findOne({
        where: {
          userId: user.userId,
          postId: postId,
        },
      });
      return !!like; // Returns true if like exists, false otherwise
    },
    isFollowing: async (_, { userId }, { user, models }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to check if you are following someone.');
      }
      const following = await models.Following.findOne({
        where: {
          followerId: user.userId,
          targetId: userId,
        },
      });
      return !!following;
    },
    selfNotifications: async (_, __, { user, models }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to view your notifications.');
      }
      return models.Notification.findAll({
        where: { recipientId: user.userId },
        include: [
          { model: models.User, as: 'sender' },
          { model: models.User, as: 'recipient' },
          { model: models.Post, as: 'post' },
          { model: models.Comment, as: 'comment' },
        ],
        order: [['createdAt', 'DESC']],
      });
    },
    unreadNotificationCount: async (_, __, { user, models }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to count unread notifications.');
      }
      return models.Notification.count({
        where: {
          recipientId: user.userId,
          read: false,
        },
      });
    },
  },
  User: {
    followerCount: async (parent, _, { models }) => {
      return models.Following.count({ where: { targetId: parent.id } });
    },
    followingCount: async (parent, _, { models }) => {
      return models.Following.count({ where: { followerId: parent.id } });
    },
  },
  Post: {
    user: async (parent, _, { models }) => {
      if (parent.user) return parent.user;
      return models.User.findByPk(parent.userId);
    },
    likeCount: async (parent, _, { models }) => {
      return models.Like.count({ where: { postId: parent.id } });
    },
  },
  Comment: {
    user: async (parent, _, { models }) => {
      if (parent.user) return parent.user;
      return models.User.findByPk(parent.userId);
    },
    post: async (parent, _, { models }) => {
      if (parent.post) return parent.post;
      return models.Post.findByPk(parent.postId);
    },
  },
  Like: {
    user: async (parent, _, { models }) => {
      if (parent.user) return parent.user;
      return models.User.findByPk(parent.userId);
    },
    post: async (parent, _, { models }) => {
      if (parent.post) return parent.post;
      return models.Post.findByPk(parent.postId);
    },
  },
  Following: { // Field resolvers for Following type
    targetUser: async (parent, _, { models }) => {
      return models.User.findByPk(parent.targetId);
    },
    followerUser: async (parent, _, { models }) => {
      return models.User.findByPk(parent.followerId);
    },
  },
  Notification: { // Field resolvers for Notification
    sender: async (parent, _, { models }) => {
      if (parent.sender) return parent.sender; // Already eager-loaded
      if (!parent.senderId) return null; // No sender ID
      return models.User.findByPk(parent.senderId);
    },
    recipient: async (parent, _, { models }) => {
      if (parent.recipient) return parent.recipient; // Already eager-loaded
      return models.User.findByPk(parent.recipientId);
    },
    post: async (parent, _, { models }) => {
      if (parent.post) return parent.post; // Already eager-loaded
      if (!parent.postId) return null; // No post ID
      return models.Post.findByPk(parent.postId);
    },
    comment: async (parent, _, { models }) => {
      if (parent.comment) return parent.comment; // Already eager-loaded
      if (!parent.commentId) return null; // No comment ID
      return models.Comment.findByPk(parent.commentId);
    },
  },
  Mutation: {
    signup: async (_, { input }, { models }) => {
      const { username, email, password } = input;

      // Check if email already exists
      const existingUser = await models.User.findOne({ where: { email } });
      if (existingUser) {
        throw new UserInputError('Email already in use.');
      }

      const newUser = await models.User.create({
        username,
        email,
        password,
      });

      const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, {
        expiresIn: '1d',
      });

      return { token, user: newUser };
    },
    login: async (_, { input }, { models }) => { // Added models to context
      const { email, password } = input;

      const user = await models.User.findOne({ where: { email } });
      if (!user) {
        throw new AuthenticationError('Invalid credentials. User not found.');
      }

      const isValid = await user.validPassword(password);
      if (!isValid) {
        throw new AuthenticationError('Invalid credentials. Password incorrect.');
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1d',
      });

      return { token, user };
    },
    createPost: async (_, { input }, { user, models }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to create a post.');
      }
      const { title, text } = input;
      const newPost = await models.Post.create({
        title,
        text,
        userId: user.userId,
      });
      // Fetch the post with the user associated to return the full object
      return models.Post.findByPk(newPost.id, {
        include: [{ model: models.User, as: 'user'}]
      });
    },
    createComment: async (_, { input }, { user, models }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to comment.');
      }
      const { postId, content } = input;

      // Verify post exists
      const post = await models.Post.findByPk(postId);
      if (!post) {
        throw new UserInputError('Post not found.');
      }

      const newComment = await models.Comment.create({
        content,
        userId: user.userId,
        postId,
      });

      // Fetch the comment with user and post associated to return the full object
      const finalComment = await models.Comment.findByPk(newComment.id, {
        include: [
          { model: models.User, as: 'user' },
          { model: models.Post, as: 'post' }, // Eager load post for recipientId
        ],
      });

      // Create Notification if commenter is not post author
      if (post.userId !== user.userId) {
        const notification = await models.Notification.create({
          category: 'new_comment',
          senderId: user.userId,
          recipientId: post.userId, // Notify post author
          postId: finalComment.postId,
          commentId: finalComment.id,
        });
        const fullNotification = await models.Notification.findByPk(notification.id, {
          include: [
            { model: models.User, as: 'sender' },
            { model: models.User, as: 'recipient' },
            { model: models.Post, as: 'post' },
            { model: models.Comment, as: 'comment' },
          ]
        });
        pubsub.publish(NOTIFICATION_CREATED, { notificationCreated: fullNotification });
      }
      return finalComment;
    },
    likePost: async (_, { input }, { user, models }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to like a post.');
      }
      const { postId } = input;

      // Verify post exists
      const post = await models.Post.findByPk(postId);
      if (!post) {
        throw new UserInputError('Post not found.');
      }

      // Check if already liked
      const existingLike = await models.Like.findOne({
        where: {
          userId: user.userId,
          postId: postId,
        },
      });

      if (existingLike) {
        // Unlike the post
        await existingLike.destroy();
      } else {
        // Like the post
        await models.Like.create({
          userId: user.userId,
          postId: postId,
        });
      }

      // Return the updated post (the frontend might want the post with the new like count)
      // Fetch the post again to get updated associations or counts if necessary,
      // or rely on the Post.likeCount resolver to be called by the client.
      const updatedPost = await models.Post.findByPk(postId, {
        include: [{ model: models.User, as: 'user' }] // Eager load user for recipientId
      });

      // Create Notification only if a new like was created (not unliked) and liker is not post author
      if (!existingLike && updatedPost.userId !== user.userId) {
        const notification = await models.Notification.create({
          category: 'new_like',
          senderId: user.userId,
          recipientId: updatedPost.userId, // Notify post author
          postId: postId,
          // likeId: createdLike.id, // If you decide to store likeId in Notification model
        });
        const fullNotification = await models.Notification.findByPk(notification.id, {
          include: [
            { model: models.User, as: 'sender' },
            { model: models.User, as: 'recipient' },
            { model: models.Post, as: 'post' },
          ]
        });
        pubsub.publish(NOTIFICATION_CREATED, { notificationCreated: fullNotification });
      }
      return updatedPost;
    },
    followUser: async (_, { input }, { user, models }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to follow a user.');
      }
      const { userId: targetUserId } = input;

      if (user.userId === targetUserId) {
        throw new UserInputError("You cannot follow yourself.");
      }

      // Verify target user exists
      const targetUserToFollow = await models.User.findByPk(targetUserId);
      if (!targetUserToFollow) {
        throw new UserInputError('User to follow not found.');
      }

      // Check if already following
      const existingFollowing = await models.Following.findOne({
        where: {
          followerId: user.userId,
          targetId: targetUserId,
        },
      });

      let wasNewFollow = false;
      if (existingFollowing) {
        // Unfollow the user
        await existingFollowing.destroy();
      } else {
        // Follow the user
        await models.Following.create({
          followerId: user.userId,
          targetId: targetUserId,
        });
        wasNewFollow = true;
      }
      // Return the target user (the one who was followed/unfollowed)
      const finalTargetUser = await models.User.findByPk(targetUserId);

      // Create Notification only if a new follow relationship was established
      if (wasNewFollow) { // user.userId !== targetUserId is already checked
        const notification = await models.Notification.create({
          category: 'new_follow',
          senderId: user.userId,
          recipientId: targetUserId,
        });
        const fullNotification = await models.Notification.findByPk(notification.id, {
          include: [
            { model: models.User, as: 'sender' },
            { model: models.User, as: 'recipient' },
          ]
        });
        pubsub.publish(NOTIFICATION_CREATED, { notificationCreated: fullNotification });
      }
      return finalTargetUser;
    },
    updateProfileImage: async (_, { file }, { models, user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to update your profile image.');
      }

      const { createReadStream, filename, mimetype } = await file;

      // Basic validation for mimetype (optional, but good practice)
      if (!mimetype.startsWith('image/')) {
        throw new UserInputError('Invalid file type. Only images are allowed.');
      }

      const stream = createReadStream();

      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'user_pic', // Optional: specify a folder in Cloudinary
              public_id: `${user.userId}_${Date.now()}`, // Optional: custom public_id
              // transformation: [{ width: 300, height: 300, crop: "limit" }] // Example transformation
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error details:', error);
                return reject(new Error('Failed to upload image to Cloudinary.'));
              }
              resolve(result);
            }
          );
          stream.pipe(uploadStream);
        });

        if (!result || !result.secure_url) {
          throw new Error('Cloudinary upload failed, no secure_url returned.');
        }
        
        const userToUpdate = await models.User.findByPk(user.userId);
        if (!userToUpdate) {
          // This should ideally not happen if JWT is valid and user exists
          throw new AuthenticationError('User not found.');
        }
        userToUpdate.profile_image = result.secure_url;
        await userToUpdate.save();
        return userToUpdate;

      } catch (err) {
        console.error('Error during profile image update:', err);
        // Consolidate error messages for client
        if (err.message.includes('Cloudinary') || err.message.includes('upload failed')) {
             throw new Error('Failed to upload image. Please try again.');
        }
        throw new Error('An unexpected error occurred while updating profile image.');
      }
    },
    markNotificationRead: async (_, { input }, { user, models }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in.');
      }
      const { notificationId } = input;
      const notification = await models.Notification.findByPk(notificationId);

      if (!notification) {
        throw new UserInputError('Notification not found.');
      }

      if (notification.recipientId !== user.userId) {
        throw new ForbiddenError('You are not authorized to mark this notification as read.');
      }

      notification.read = true;
      await notification.save();

      // Return the updated notification, potentially with associations for client update
      return models.Notification.findByPk(notificationId, {
        include: [
          { model: models.User, as: 'sender' },
          { model: models.User, as: 'recipient' },
          { model: models.Post, as: 'post' },
          { model: models.Comment, as: 'comment' },
        ]
      });
    },
  },
  Subscription: {
    notificationCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([NOTIFICATION_CREATED]),
        (payload, variables, context) => {
          if (!context || !context.user) return false;
          return payload.notificationCreated.recipientId === context.user.userId;
        }
      ),
    },
  },
  Upload: GraphQLUpload, // Add Upload scalar resolver
  // DateTime: new GraphQLScalarType({ ... }) // Implementation for DateTime
};

module.exports = resolvers;
