
import { list } from '@keystone-6/core';
import { text, password, timestamp, relationship, checkbox, virtual } from '@keystone-6/core/fields';
import { graphql } from '@keystone-6/core';
import type { Lists, Context } from '.keystone/types'; // Will cause tsc error, but needed for target env

// Helper to check if a user is authenticated
const isSignedIn = ({ session }: Context) => {
  return !!session;
};

// Helper to check if the current user is the owner of an item
const isOwner = (fieldPath = 'user') => ({ session, item }: { session: Context['session'], item: any }) => {
  if (!session?.data?.id) return false;
  const directIdField = `${fieldPath}Id`;
  if (item[directIdField] && typeof item[directIdField] === 'string') {
    return session.data.id === item[directIdField];
  }
  if (item[fieldPath] && typeof item[fieldPath] === 'object' && item[fieldPath] !== null && typeof item[fieldPath].id === 'string') {
    return session.data.id === item[fieldPath].id;
  }
  return false;
};

// --- User List ---
const UserListConfig: Lists.User.Type = list({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: ({ session, item }) => isSignedIn({ session }) && session?.data.id === item.id,
      delete: ({ session, item }) => isSignedIn({ session }) && session?.data.id === item.id,
    },
  },
  fields: {
    username: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    email: text({ isIndexed: 'unique' }),
    password: password({ validation: { isRequired: true } }),
    bio: text({ ui: { displayMode: 'textarea' } }),
    profile_image_url: text(),
    date_joined: timestamp({ defaultValue: { kind: 'now' } }),
    isFollowing: virtual({
      field: () => graphql.field({ // Removed 'lists' param
        type: graphql.Boolean,
        async resolve(item, args, context: Context) {
          if (!context.session?.data?.id) return false;
          const { id: userId } = item as { id: string };
          const { id: followerId } = context.session.data;
          // This assumes a named composite unique constraint in Prisma, e.g. @@unique([followerId, targetId], name: "followerId_targetId")
          const followingRecord = await context.db.Following.findOne({
             where: { followerId_targetId: { followerId: followerId, targetId: userId } }
          });
          return !!followingRecord;
        }
      }),
      ui: { query: '(id)' }
    }),
    posts: relationship({ ref: 'Post.user', many: true }),
    comments: relationship({ ref: 'Comment.user', many: true }),
    likes: relationship({ ref: 'Like.user', many: true }),
    notifications: relationship({ ref: 'Notification.recipient', many: true }),
    sent_notifications: relationship({ ref: 'Notification.sender', many: true }),
    following: relationship({ ref: 'Following.follower', many: true }),
    followers: relationship({ ref: 'Following.target', many: true }),
  },
});

// --- Post List ---
const PostListConfig: Lists.Post.Type = list({
  access: {
    operation: {
      query: () => true,
      create: isSignedIn,
      update: isOwner('user'),
      delete: isOwner('user'),
    },
  },
  fields: {
    title: text({ validation: { isRequired: true } }),
    text: text({ ui: { displayMode: 'textarea' } }),
    createdAt: timestamp({ defaultValue: { kind: 'now' }, ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }),
    updatedAt: timestamp({ db: { updatedAt: true }, ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }),
    user: relationship({
      ref: 'User.posts',
      ui: {
        createView: { fieldMode: 'hidden' }, // Set by hook
        itemView: { fieldMode: 'read' }
      }
    }),
    liked: virtual({
      field: () => graphql.field({ // Removed 'lists' param
        type: graphql.Boolean,
        async resolve(item, args, context: Context) {
          if (!context.session?.data?.id) return false;
          const { id: postId } = item as { id: string };
          const { id: userId } = context.session.data;
          // This assumes a named composite unique constraint in Prisma, e.g. @@unique([userId, postId], name: "userId_postId")
          const likeRecord = await context.db.Like.findOne({
            where: { userId_postId: { userId: userId, postId: postId } }
          });
          return !!likeRecord;
        }
      }),
      ui: { query: '(id)' }
    }),
    comments: relationship({ ref: 'Comment.post', many: true }),
    likes: relationship({ ref: 'Like.post', many: true }),
    notifications: relationship({ ref: 'Notification.post', many: true }),
  },
  hooks: {
    resolveInput: {
      create: async ({ resolvedData, context }) => {
        if (context.session?.data?.id) {
          return { ...resolvedData, user: { connect: { id: context.session.data.id } } };
        }
        return resolvedData;
      },
    },
  },
});

// --- Comment List ---
const CommentListConfig: Lists.Comment.Type = list({
  access: {
    operation: {
      query: () => true,
      create: isSignedIn,
      update: isOwner('user'),
      delete: isOwner('user'),
    },
  },
  fields: {
    content: text({ validation: { isRequired: true }, ui: { displayMode: 'textarea' } }),
    createdAt: timestamp({ defaultValue: { kind: 'now' }, ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }),
    updatedAt: timestamp({ db: { updatedAt: true }, ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }),
    user: relationship({
      ref: 'User.comments',
      ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } // Set by hook
    }),
    post: relationship({ ref: 'Post.comments' }),
    notifications: relationship({ ref: 'Notification.comment', many: true }),
  },
  hooks: {
    resolveInput: {
      create: async ({ resolvedData, context }) => {
        if (context.session?.data?.id) {
          return { ...resolvedData, user: { connect: { id: context.session.data.id } } };
        }
        return resolvedData;
      },
    },
  },
});

// --- Like List ---
const LikeListConfig: Lists.Like.Type = list({
  access: {
    operation: {
      query: () => true,
      create: isSignedIn,
      update: () => false,
      delete: isOwner('user'),
    },
  },
  fields: {
    user: relationship({
      ref: 'User.likes',
      ui: { createView: { fieldMode: 'hidden' } } // Set by hook
    }),
    post: relationship({ ref: 'Post.likes' }),
  },
  hooks: {
    resolveInput: {
      create: async ({ resolvedData, context }) => {
        if (context.session?.data?.id) {
          if (!resolvedData.post) {
             // Let Keystone's validation handle missing post if not provided
             // This hook should primarily focus on setting the user
          }
          return { ...resolvedData, user: { connect: { id: context.session.data.id } } };
        }
        return resolvedData;
      },
    },
  },
});

// --- Following List ---
const FollowingListConfig: Lists.Following.Type = list({
  access: {
    operation: {
      query: () => true,
      create: isSignedIn,
      update: () => false,
      delete: isOwner('follower'),
    },
  },
  fields: {
    target: relationship({ ref: 'User.followers' }),
    follower: relationship({
      ref: 'User.following',
      ui: { createView: { fieldMode: 'hidden' } } // Set by hook
    }),
  },
  hooks: {
    resolveInput: {
      create: async ({ resolvedData, context }) => {
        if (context.session?.data?.id) {
          if (!resolvedData.target) {
            // Let Keystone's validation handle missing target if not provided
          }
          return { ...resolvedData, follower: { connect: { id: context.session.data.id } } };
        }
        return resolvedData;
      },
    },
  },
});

// --- Notification List ---
const NotificationListConfig: Lists.Notification.Type = list({
  access: {
    operation: {
      query: isSignedIn,
      create: () => false,
      update: isOwner('recipient'),
      delete: isOwner('recipient'),
    },
    filter: {
      query: ({ session }: Context) => {
        if (!session?.data?.id) return { id: { equals: null } } as any;
        return { recipient: { id: { equals: session.data.id } } };
      },
      update: ({ session }: Context) => {
        if (!session?.data?.id) return { id: { equals: null } } as any;
        return { recipient: { id: { equals: session.data.id } } };
      },
      delete: ({ session }: Context) => {
        if (!session?.data?.id) return { id: { equals: null } } as any;
        return { recipient: { id: { equals: session.data.id } } };
      },
    },
  },
  fields: {
    category: text({ validation: { isRequired: true } }),
    read: checkbox({ defaultValue: false }),
    createdAt: timestamp({ defaultValue: { kind: 'now' }, ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }),
    updatedAt: timestamp({ db: { updatedAt: true }, ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }),
    recipient: relationship({ ref: 'User.notifications' }),
    sender: relationship({ ref: 'User.sent_notifications' }),
    post: relationship({ ref: 'Post.notifications' }),
    comment: relationship({ ref: 'Comment.notifications' }),
  },
});


export const lists: Lists = {
  User: UserListConfig,
  Post: PostListConfig,
  Comment: CommentListConfig,
  Like: LikeListConfig,
  Following: FollowingListConfig,
  Notification: NotificationListConfig,
};
