const { GraphQLScalarType, Kind, GraphQLError } = require('graphql');
const { GraphQLUpload } = require('graphql-upload');
const { Op } = require('sequelize');
const db = require('../db');
const userService = require('../services/userService');
const { uploadToCloudinary } = require('../utils/cloudinaryUploader');
const { comparePassword, hashPassword, generateAccessToken, verifyToken } = require('../utils/auth');
const pubsub = require('./pubsub');

// Helper for pagination
const getPagination = (first, after) => {
  const limit = first || 10;
  let offset = 0;
  if (after) {
    offset = parseInt(Buffer.from(after, 'base64').toString('ascii'), 10);
    if (isNaN(offset)) offset = 0;
  }
  return { limit, offset };
};

const createEdges = (nodes, offset) => {
  return nodes.map((node, index) => ({
    cursor: Buffer.from((offset + index + 1).toString()).toString('base64'),
    node,
  }));
};

const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value) {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'string') return value;
    if (value && typeof value.toISOString === 'function') return value.toISOString();
    throw Error('GraphQL DateTime Scalar serializer expected a `Date` object or an object with toISOString method');
  },
  parseValue(value) {
    if (typeof value === 'string') return new Date(value);
    throw new Error('GraphQL DateTime Scalar parser expected a `string`');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) return new Date(ast.value);
    throw new Error('GraphQL DateTime Scalar parser expected a `string`');
  },
});

const resolvers = {
  DateTime: dateTimeScalar,
  Upload: GraphQLUpload,

  Query: {
    hello: () => 'world',
    selfUser: async (parent, args, { db, user: contextUser }) => {
      if (!contextUser) throw new GraphQLError('Authentication required.', { extensions: { code: 'UNAUTHENTICATED' } });
      const user = await db.User.findByPk(contextUser.id);
      if (!user) throw new GraphQLError('User not found.', { extensions: { code: 'NOT_FOUND' } });
      return user;
    },
    user: async (parent, { id }, { db }) => {
      const user = await db.User.findByPk(id);
      if (!user) throw new GraphQLError('User not found.', { extensions: { code: 'NOT_FOUND' } });
      return user;
    },
    allPosts: async (parent, { first, after }, { db }) => {
      const { limit, offset } = getPagination(first, after);
      const { count, rows } = await db.Post.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [{ model: db.User, as: 'user' }]
      });
      const edges = createEdges(rows, offset);
      return {
        edges,
        pageInfo: {
          hasNextPage: offset + rows.length < count,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
      };
    },
    post: async (parent, { id }, { db }) => {
      const postItem = await db.Post.findByPk(id, {
        include: [{ model: db.User, as: 'user' }]
      });
      if (!postItem) throw new GraphQLError('Post not found.', { extensions: { code: 'NOT_FOUND' } });
      return postItem;
    },
    selfNotifications: async (parent, { first, after }, { db, user: contextUser }) => {
      if (!contextUser) throw new GraphQLError('Authentication required.', { extensions: { code: 'UNAUTHENTICATED' } });
      const { limit, offset } = getPagination(first, after);
      const { count, rows } = await db.Notification.findAndCountAll({
        where: { recipientId: contextUser.id },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [
          { model: db.User, as: 'sender' },
          { model: db.User, as: 'recipient' },
          { model: db.Post, as: 'post' },
          { model: db.Comment, as: 'comment', include: [{ model: db.Post, as: 'post' }] }
        ]
      });
      const edges = createEdges(rows, offset);
      return {
        edges,
        pageInfo: {
          hasNextPage: offset + rows.length < count,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
      };
    },
    unreadNotificationCount: async (parent, _, { db, user: contextUser }) => {
      if (!contextUser) return 0;
      return db.Notification.count({ where: { recipientId: contextUser.id, read: false } });
    }
  },

  Mutation: {
    _empty: () => null,
    createUser: async (parent, { username, email, password, firstName, lastName, bio, profileImageFile }) => {
      try {
        let profileImageUrl = null;
        if (profileImageFile) {
          const { createReadStream } = await profileImageFile;
          const stream = createReadStream();
          const result = await uploadToCloudinary(stream, { folder: 'user_profiles' });
          profileImageUrl = result.secure_url;
        }
        const user = await userService.registerUser({ username, email, password, firstName, lastName, bio, profileImage: profileImageUrl });
        return { ok: true, user, message: 'User created successfully.' };
      } catch (error) {
        return { ok: false, message: error.message, user: null };
      }
    },
    tokenAuth: async (parent, { username, password }) => {
      try {
        const { user, accessToken, refreshToken } = await userService.loginUser({ username, password });
        return { token: accessToken, refreshToken, user };
      } catch (error) {
        throw new GraphQLError(error.message, { extensions: { code: 'UNAUTHENTICATED' } });
      }
    },
    updateUser: async (parent, { username, currentPassword, newPassword, bio, profileImageFile }, { db, user: contextUser }) => {
      if (!contextUser) throw new GraphQLError('Authentication required.', { extensions: { code: 'UNAUTHENTICATED' } });
      const userInstance = await db.User.findByPk(contextUser.id);
      if (!userInstance) throw new GraphQLError('User not found.', { extensions: { code: 'NOT_FOUND' } });
      if (!(await comparePassword(currentPassword, userInstance.password))) {
        throw new GraphQLError('Invalid current password.', { extensions: { code: 'BAD_USER_INPUT' } });
      }
      const updateData = {};
      if (username) updateData.username = username;
      if (bio) updateData.bio = bio;
      if (newPassword) updateData.password = await hashPassword(newPassword);
      if (profileImageFile) {
        const { createReadStream } = await profileImageFile;
        const stream = createReadStream();
        const result = await uploadToCloudinary(stream, { folder: 'user_profiles' });
        updateData.profileImage = result.secure_url;
      }
      try {
        await userInstance.update(updateData);
        const updatedUser = await db.User.findByPk(contextUser.id);
        const userJSON = updatedUser.toJSON();
        delete userJSON.password;
        return { ok: true, user: userJSON, message: 'User updated successfully.' };
      } catch (error) {
        return { ok: false, message: error.message || 'Failed to update user.', user: null };
      }
    },
    refreshToken: async (parent, { token: refreshTokenValue }, { db }) => {
        try {
            const decoded = verifyToken(refreshTokenValue, true);
            const user = await db.User.findByPk(decoded.id);
            if (!user) throw new GraphQLError('User not found for refresh token.', { extensions: { code: 'UNAUTHENTICATED' } });
            const userPayload = { id: user.id, username: user.username };
            const newAccessToken = generateAccessToken(userPayload);
            const userJSON = user.toJSON();
            delete userJSON.password;
            return { token: newAccessToken, refreshToken: refreshTokenValue, user: userJSON };
        } catch (error) {
            throw new GraphQLError('Invalid or expired refresh token.', { extensions: { code: 'UNAUTHENTICATED' } });
        }
    },
    revokeToken: async (parent, { refreshToken }) => {
        console.log(`Token revocation requested for: ${refreshToken ? refreshToken.substring(0,10)+"..." : "N/A"}`);
        return true;
    },
    createPost: async (parent, { title, text }, { db, user: contextUser }) => {
      if (!contextUser) throw new GraphQLError('Authentication required.', { extensions: { code: 'UNAUTHENTICATED' } });
      try {
        const newPost = await db.Post.create({ title, text, userId: contextUser.id });
        return { ok: true, post: newPost, message: 'Post created successfully.' };
      } catch (error) {
        throw new GraphQLError(error.message || 'Failed to create post.', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
      }
    },
    createComment: async (parent, { postId, content }, { db, user: contextUser, pubsub }) => {
      if (!contextUser) throw new GraphQLError('Authentication required.', { extensions: { code: 'UNAUTHENTICATED' } });
      try {
        const post = await db.Post.findByPk(postId);
        if (!post) throw new GraphQLError('Post not found.', { extensions: { code: 'NOT_FOUND' } });
        const newComment = await db.Comment.create({ content, postId, userId: contextUser.id });
        if (post.userId.toString() !== contextUser.id.toString()) {
          const notification = await db.Notification.create({
            recipientId: post.userId,
            senderId: contextUser.id,
            postId: post.id,
            commentId: newComment.id,
            category: 'new_comment',
          });
          const fullNotification = await db.Notification.findByPk(notification.id, {
            include: [{ model: db.User, as: 'sender' }, { model: db.User, as: 'recipient' }, { model: db.Post, as: 'post' }, { model: db.Comment, as: 'comment', include: [{model: db.Post, as: 'post'}]}]
          });
          if (fullNotification) pubsub.publish('NOTIFICATION_CREATED', { notificationCreated: fullNotification });
        }
        return { ok: true, comment: newComment, message: 'Comment created successfully.' };
      } catch (error) {
        throw new GraphQLError(error.message || 'Failed to create comment.', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
      }
    },
    likePost: async (parent, { postId }, { db, user: contextUser, pubsub }) => {
      if (!contextUser) throw new GraphQLError('Authentication required.', { extensions: { code: 'UNAUTHENTICATED' } });
      const post = await db.Post.findByPk(postId);
      if (!post) throw new GraphQLError('Post not found.', { extensions: { code: 'NOT_FOUND' } });
      let liked = false;
      const existingLike = await db.Like.findOne({ where: { userId: contextUser.id, postId } });
      if (existingLike) {
        await existingLike.destroy();
      } else {
        await db.Like.create({ userId: contextUser.id, postId });
        liked = true;
        if (post.userId.toString() !== contextUser.id.toString()) {
          const notification = await db.Notification.create({ recipientId: post.userId, senderId: contextUser.id, postId, category: 'new_like' });
          const fullNotification = await db.Notification.findByPk(notification.id, { include: [{ model: db.User, as: 'sender' }, { model: db.User, as: 'recipient' }, { model: db.Post, as: 'post' }]});
          if (fullNotification) pubsub.publish('NOTIFICATION_CREATED', { notificationCreated: fullNotification });
        }
      }
      const updatedPost = await db.Post.findByPk(postId, { include: [{ model: db.User, as: 'user' }]});
      return { ok: true, post: updatedPost, message: liked ? 'Post liked' : 'Post unliked' };
    },
    followUser: async (parent, { userId: targetUserId }, { db, user: contextUser, pubsub }) => {
      if (!contextUser) throw new GraphQLError('Authentication required.', { extensions: { code: 'UNAUTHENTICATED' } });
      if (contextUser.id.toString() === targetUserId.toString()) throw new GraphQLError('You cannot follow yourself.', { extensions: { code: 'BAD_USER_INPUT' } });
      const targetUser = await db.User.findByPk(targetUserId);
      if (!targetUser) throw new GraphQLError('Target user not found.', { extensions: { code: 'NOT_FOUND' } });
      let followed = false;
      const existingFollow = await db.Following.findOne({ where: { followerId: contextUser.id, targetId: targetUserId } });
      if (existingFollow) {
        await existingFollow.destroy();
      } else {
        await db.Following.create({ followerId: contextUser.id, targetId: targetUserId });
        followed = true;
        const notification = await db.Notification.create({ recipientId: targetUserId, senderId: contextUser.id, category: 'new_follow' });
        const fullNotification = await db.Notification.findByPk(notification.id, { include: [{ model: db.User, as: 'sender' }, { model: db.User, as: 'recipient' }]});
        if (fullNotification) pubsub.publish('NOTIFICATION_CREATED', { notificationCreated: fullNotification });
      }
      const updatedTargetUser = await db.User.findByPk(targetUserId);
      return { ok: true, user: updatedTargetUser, message: followed ? 'User followed' : 'User unfollowed' };
    },
    readNotification: async (parent, { notificationId }, { db, user: contextUser }) => {
      if (!contextUser) throw new GraphQLError('Authentication required.', { extensions: { code: 'UNAUTHENTICATED' } });
      const notification = await db.Notification.findByPk(notificationId);
      if (!notification) throw new GraphQLError('Notification not found.', { extensions: { code: 'NOT_FOUND' } });
      if (notification.recipientId.toString() !== contextUser.id.toString()) throw new GraphQLError('Not authorized.', { extensions: { code: 'FORBIDDEN' } });
      notification.read = true;
      await notification.save();
      return { ok: true, notification, message: 'Notification marked as read.' };
    },
    readAllNotifications: async (parent, _, { db, user: contextUser }) => {
      if (!contextUser) throw new GraphQLError('Authentication required.', { extensions: { code: 'UNAUTHENTICATED' } });
      const [affectedCount] = await db.Notification.update({ read: true }, { where: { recipientId: contextUser.id, read: false }});
      return { ok: true, count: affectedCount, message: `${affectedCount} notifications marked as read.` };
    }
  },

  User: {
    posts: async (parent, { first, after }, { db }) => {
      const { limit, offset } = getPagination(first, after);
      const { count, rows } = await db.Post.findAndCountAll({ where: { userId: parent.id }, limit, offset, order: [['createdAt', 'DESC']] });
      const edges = createEdges(rows, offset);
      return { edges, pageInfo: { hasNextPage: offset + rows.length < count, endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null } };
    },
    comments: async (parent, { first, after }, { db }) => {
      const { limit, offset } = getPagination(first, after);
      const { count, rows } = await db.Comment.findAndCountAll({ where: { userId: parent.id }, limit, offset, order: [['createdAt', 'DESC']] });
      const edges = createEdges(rows, offset);
      return { edges, pageInfo: { hasNextPage: offset + rows.length < count, endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null } };
    },
    followerCount: async (parent, _, { db }) => db.Following.count({ where: { targetId: parent.id } }),
    followingCount: async (parent, _, { db }) => db.Following.count({ where: { followerId: parent.id } }),
    postCount: async (parent, _, { db }) => db.Post.count({ where: { userId: parent.id } }),
    isFollowing: async (parent, _, { db, user: contextUser }) => {
      if (!contextUser || parent.id.toString() === contextUser.id.toString()) return false;
      const follow = await db.Following.findOne({ where: { targetId: parent.id, followerId: contextUser.id } });
      return !!follow;
    },
  },

  Post: {
    author: async (parent, _, { db }) => db.User.findByPk(parent.userId),
    comments: async (parent, { first, after }, { db }) => {
      const { limit, offset } = getPagination(first, after);
      const { count, rows } = await db.Comment.findAndCountAll({ where: { postId: parent.id }, limit, offset, order: [['createdAt', 'DESC']], include: [{model: db.User, as: 'user'}] });
      const edges = createEdges(rows, offset);
      return { edges, pageInfo: { hasNextPage: offset + rows.length < count, endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null } };
    },
    likeCount: async (parent, _, { db }) => db.Like.count({ where: { postId: parent.id } }),
    commentCount: async (parent, _, { db }) => db.Comment.count({ where: { postId: parent.id } }),
    liked: async (parent, _, { db, user: contextUser }) => {
      if (!contextUser) return false;
      const like = await db.Like.findOne({ where: { postId: parent.id, userId: contextUser.id } });
      return !!like;
    },
  },

  Comment: {
    author: async (parent, _, { db }) => db.User.findByPk(parent.userId),
    post: async (parent, _, { db }) => db.Post.findByPk(parent.postId),
  },

  Notification: {
    sender: async (parent, _, { db }) => db.User.findByPk(parent.senderId),
    recipient: async (parent, _, { db }) => db.User.findByPk(parent.recipientId),
    post: async (parent, _, { db }) => parent.postId ? db.Post.findByPk(parent.postId) : null,
    comment: async (parent, _, { db }) => parent.commentId ? db.Comment.findByPk(parent.commentId, {include: [{model: db.Post, as: 'post'}]}) : null,
  },
  
  Subscription: {
    notificationCreated: {
      subscribe: (parent, args, { pubsub, user: contextUser }) => { 
        if (!pubsub) throw new Error("Server configuration error for subscriptions.");
        // console.log(`Subscription request for notificationCreated received. User: ${contextUser ? contextUser.id : 'N/A'}`);
        // This is a generic subscription. Client-side filtering or user-specific topics would be needed for targeted notifications.
        return pubsub.asyncIterator(['NOTIFICATION_CREATED']);
      }
    }
  }
};

module.exports = resolvers;
