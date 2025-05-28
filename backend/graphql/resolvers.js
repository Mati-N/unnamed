const { GraphQLScalarType, Kind, GraphQLError } = require('graphql');
const { GraphQLUpload } = require('graphql-upload');
const db = require('../db');
const userService = require('../services/userService');
const { uploadToCloudinary } = require('../utils/cloudinaryUploader');
const { comparePassword, hashPassword, generateAccessToken, verifyToken } = require('../utils/auth');

// Helper for pagination (very basic offset-based for now)
const getPagination = (first, after) => {
  const limit = first || 10; // Default limit
  let offset = 0;
  if (after) {
    // Assuming 'after' cursor is an offset for simplicity in this example
    // For true cursor-based pagination, 'after' would be the ID of the last item
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
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'string') { // Already serialized
        return value;
    }
    if (value && value.toISOString) { // For Sequelize's dates that are not Date instances
        return value.toISOString();
    }
    throw Error('GraphQL DateTime Scalar serializer expected a `Date` object or an object with toISOString method');
  },
  parseValue(value) {
    if (typeof value === 'string') {
      return new Date(value);
    }
    throw new Error('GraphQL DateTime Scalar parser expected a `string`');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error('GraphQL DateTime Scalar parser expected a `string`');
  },
});

const resolvers = {
  DateTime: dateTimeScalar,
  Upload: GraphQLUpload,

  Query: {
    hello: () => 'world',
    selfUser: async (parent, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      const user = await db.User.findByPk(context.user.id);
      if (!user) {
        throw new GraphQLError('User not found.', { extensions: { code: 'NOT_FOUND' } });
      }
      return user;
    },
    user: async (parent, { id }, context) => {
      const user = await db.User.findByPk(id);
      if (!user) {
        throw new GraphQLError('User not found.', { extensions: { code: 'NOT_FOUND' } });
      }
      return user;
    },
  },

  Mutation: {
    _empty: () => null,
    createUser: async (parent, { username, email, password, firstName, lastName, bio, profileImageFile }, context) => {
      try {
        let profileImageUrl = null;
        if (profileImageFile) {
          const { createReadStream } = await profileImageFile;
          const stream = createReadStream();
          const result = await uploadToCloudinary(stream, { folder: 'user_profiles' });
          profileImageUrl = result.secure_url;
        }
        const user = await userService.registerUser({
          username,
          email,
          password,
          firstName,
          lastName,
          bio,
          profileImage: profileImageUrl,
        });
        return { ok: true, user, message: 'User created successfully.' };
      } catch (error) {
        console.error("CreateUser Error:", error);
        return { ok: false, message: error.message, user: null };
      }
    },
    tokenAuth: async (parent, { username, password }, context) => {
      try {
        const { user, accessToken, refreshToken } = await userService.loginUser({ username, password });
        return { token: accessToken, refreshToken, user };
      } catch (error) {
        console.error("TokenAuth Error:", error);
        throw new GraphQLError(error.message, { extensions: { code: 'UNAUTHENTICATED' } });
      }
    },
    updateUser: async (parent, { username, currentPassword, newPassword, bio, profileImageFile }, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required.', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      const userInstance = await db.User.findByPk(context.user.id);
      if (!userInstance) {
        throw new GraphQLError('User not found.', { extensions: { code: 'NOT_FOUND' } });
      }

      const isPasswordValid = await comparePassword(currentPassword, userInstance.password);
      if (!isPasswordValid) {
        throw new GraphQLError('Invalid current password.', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const updateData = {};
      if (username) updateData.username = username;
      if (bio) updateData.bio = bio;

      if (newPassword) {
        updateData.password = await hashPassword(newPassword);
      }

      if (profileImageFile) {
        const { createReadStream } = await profileImageFile;
        const stream = createReadStream();
        const result = await uploadToCloudinary(stream, { folder: 'user_profiles' });
        updateData.profileImage = result.secure_url;
      }

      try {
        await userInstance.update(updateData);
        // Refetch to get the latest data if needed, or ensure instance is updated
        const updatedUser = await db.User.findByPk(context.user.id);
        const userJSON = updatedUser.toJSON();
        delete userJSON.password; // Ensure password is not returned
        return { ok: true, user: userJSON, message: 'User updated successfully.' };
      } catch (error) {
        console.error("UpdateUser Error:", error);
        // Handle potential Sequelize validation errors (e.g., unique constraint on username)
        return { ok: false, message: error.message || 'Failed to update user.', user: null };
      }
    },
    refreshToken: async (parent, { token }, context) => {
        try {
            const decoded = verifyToken(token, true); // true for refresh token
            const user = await db.User.findByPk(decoded.id);
            if (!user) {
                throw new GraphQLError('User not found for refresh token.', { extensions: { code: 'UNAUTHENTICATED' } });
            }
            const userPayload = { id: user.id, username: user.username };
            const newAccessToken = generateAccessToken(userPayload);
            // Optionally, generate a new refresh token as well for rotation
            // const newRefreshToken = generateRefreshToken(userPayload);
            const userJSON = user.toJSON();
            delete userJSON.password; // Ensure password is not returned
            return { token: newAccessToken, refreshToken: token /* or newRefreshToken */, user: userJSON };
        } catch (error) {
            console.error("RefreshToken Error:", error);
            throw new GraphQLError('Invalid or expired refresh token.', { extensions: { code: 'UNAUTHENTICATED' } });
        }
    },
    revokeToken: async (parent, { refreshToken }, context) => {
        // For true stateless JWTs, client discards the token.
        // If implementing a denylist for refresh tokens, interact with it here.
        // Example: await db.DenylistedToken.create({ token: refreshToken });
        console.log(`Token revocation requested for: ${refreshToken ? refreshToken.substring(0,10)+"..." : "N/A"}`); // Basic logging
        return true; // Placeholder, actual revocation might involve a denylist
    },

    // Post Mutations
    createPost: async (parent, { title, text }, { db, user }) => {
      if (!user) {
        throw new GraphQLError('Authentication required to create a post.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      try {
        const newPost = await db.Post.create({
          title,
          text,
          userId: user.id, // Associate post with the logged-in user
        });
        return { ok: true, post: newPost, message: 'Post created successfully.' };
      } catch (error) {
        console.error("CreatePost Error:", error);
        // Could be a validation error from Sequelize or other DB issue
        throw new GraphQLError(error.message || 'Failed to create post.', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
      }
    },

    // Comment Mutations
    createComment: async (parent, { postId, content }, { db, user }) => {
      if (!user) {
        throw new GraphQLError('Authentication required to comment.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      try {
        const postExists = await db.Post.findByPk(postId);
        if (!postExists) {
          throw new GraphQLError('Post not found.', { extensions: { code: 'NOT_FOUND' } });
        }
        const newComment = await db.Comment.create({
          content,
          postId,
          userId: user.id, // Associate comment with the logged-in user
        });
        return { ok: true, comment: newComment, message: 'Comment created successfully.' };
      } catch (error) {
        console.error("CreateComment Error:", error);
        throw new GraphQLError(error.message || 'Failed to create comment.', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
      }
    },
  },
  
  Query: { // Ensure Query is defined here if not already present from User resolvers
    hello: () => 'world',
    selfUser: async (parent, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      const user = await db.User.findByPk(context.user.id);
      if (!user) {
        throw new GraphQLError('User not found.', { extensions: { code: 'NOT_FOUND' } });
      }
      return user;
    },
    user: async (parent, { id }, context) => {
      const user = await db.User.findByPk(id);
      if (!user) {
        throw new GraphQLError('User not found.', { extensions: { code: 'NOT_FOUND' } });
      }
      return user;
    },
    allPosts: async (parent, { first, after, last, before }, { db }) => {
      const { limit, offset } = getPagination(first, after);
      const { count, rows } = await db.Post.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        // For N+1, include author if frequently needed, though field resolver also handles it
        // include: [{ model: db.User, as: 'user' }] 
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
      const postItem = await db.Post.findByPk(id);
      if (!postItem) {
        throw new GraphQLError('Post not found.', { extensions: { code: 'NOT_FOUND' } });
      }
      return postItem;
    },
  },


  User: {
    posts: async (parent, { first, after, last, before }, { db }) => {
      const { limit, offset } = getPagination(first, after); // Basic pagination
      const { count, rows } = await db.Post.findAndCountAll({
        where: { userId: parent.id },
        limit,
        offset,
        order: [['createdAt', 'DESC']], // Example order
      });
      const edges = createEdges(rows, offset);
      return {
        edges,
        pageInfo: {
          hasNextPage: offset + rows.length < count,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          // hasPreviousPage and startCursor would require more complex logic or different pagination
        },
      };
    },
    comments: async (parent, { first, after, last, before }, { db }) => {
      const { limit, offset } = getPagination(first, after);
      const { count, rows } = await db.Comment.findAndCountAll({
        where: { userId: parent.id },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
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
    followerCount: async (parent, _, { db }) => {
      return db.Following.count({ where: { targetId: parent.id } });
    },
    followingCount: async (parent, _, { db }) => {
      return db.Following.count({ where: { followerId: parent.id } });
    },
    postCount: async (parent, _, { db }) => {
      return db.Post.count({ where: { userId: parent.id } });
    },
    isFollowing: async (parent, _, { db, user }) => {
      if (!user || !user.id) return false;
      if (parent.id === user.id) return false; // Cannot follow self
      const follow = await db.Following.findOne({
        where: { targetId: parent.id, followerId: user.id },
      });
      return !!follow;
    },
    // Fields like username, email, bio, profileImage, createdAt, updatedAt
    // are typically resolved automatically by Sequelize if the model property names match.
    // If User model has `profileImage` but schema has `imagePath`, a resolver for `imagePath` would be needed.
    // Here, `profileImage` is used in both schema and model.
  },

  Post: {
    author: async (parent, _, { db }) => {
      // parent.userId should be available from the Post instance
      if (!parent.userId) { // userId is the foreign key defined in post.js model
          const post = await db.Post.findByPk(parent.id, { include: [db.User] });
          return post ? post.User : null; // Or throw error if author must exist
      }
      // parent.userId is the foreign key from the Post model
      return db.User.findByPk(parent.userId);
    },
    comments: async (parent, { first, after, last, before }, { db }) => { // parent here is a Post instance
      const { limit, offset } = getPagination(first, after);
      const { count, rows } = await db.Comment.findAndCountAll({
        where: { postId: parent.id }, // Filter comments by the parent post's ID
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });
       const edges = createEdges(rows, offset);
      return {
        edges,
        pageInfo: {
          hasNextPage: offset + rows.length < count,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          // hasPreviousPage and startCursor for full Relay spec pagination
        },
      };
    },
    likeCount: async (parent, _, { db }) => { // parent is a Post instance
      return db.Like.count({ where: { postId: parent.id } });
    },
    commentCount: async (parent, _, { db }) => {
      return db.Comment.count({ where: { postId: parent.id } });
    },
    liked: async (parent, _, { db, user }) => {
      if (!user || !user.id) return false;
      const like = await db.Like.findOne({
        where: { postId: parent.id, userId: user.id },
      });
      return !!like;
    },
  },

  Comment: {
    author: async (parent, _, { db }) => {
       if (!parent.userId) {
          const comment = await db.Comment.findByPk(parent.id, { include: [{model: db.User, as: 'user'}] });
          return comment ? comment.user : null;
      }
      return db.User.findByPk(parent.userId);
    },
    post: async (parent, _, { db }) => {
      if (!parent.postId) {
          const comment = await db.Comment.findByPk(parent.id, { include: [{model: db.Post, as: 'post'}] });
          return comment ? comment.post : null;
      }
      return db.Post.findByPk(parent.postId);
    },
  },

  Notification: {
    sender: async (parent, _, { db }) => {
      if(!parent.senderId) {
        const notification = await db.Notification.findByPk(parent.id, {include: [{model: db.User, as: 'sender'}]});
        return notification ? notification.sender : null;
      }
      return db.User.findByPk(parent.senderId);
    },
    recipient: async (parent, _, { db }) => {
       if(!parent.recipientId) {
        const notification = await db.Notification.findByPk(parent.id, {include: [{model: db.User, as: 'recipient'}]});
        return notification ? notification.recipient : null;
      }
      return db.User.findByPk(parent.recipientId);
    },
    post: async (parent, _, { db }) => {
      if (!parent.postId) return null;
      if(!parent.Post) { // If not already loaded by a join
         const notification = await db.Notification.findByPk(parent.id, {include: [{model: db.Post, as: 'post'}]});
         return notification ? notification.post : null;
      }
      return parent.Post; // Assuming it might be preloaded sometimes
    },
    comment: async (parent, _, { db }) => {
      if (!parent.commentId) return null;
       if(!parent.Comment) {
         const notification = await db.Notification.findByPk(parent.id, {include: [{model: db.Comment, as: 'comment'}]});
         return notification ? notification.comment : null;
      }
      return parent.Comment;
    },
  },
  // Ensure Connection types (UserConnection, PostConnection, etc.)
  // have their 'edges' and 'pageInfo' fields resolved if not handled by parent.
  // In this setup, the parent resolvers (e.g., User.posts) return the full connection object.
};

module.exports = resolvers;
