import { list, graphql as keystoneGraphql } from '@keystone-6/core';
import { text, password, timestamp, relationship, checkbox, virtual, integer } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import type { Lists, Context, ListHooks } from '.keystone/types';
import { cloudinaryImage } from '@keystone-6/cloudinary';

// Topic for publishing new notifications
const NOTIFICATION_CREATED_TOPIC = 'NOTIFICATION_CREATED';

const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME_MISSING',
  apiKey: process.env.CLOUDINARY_API_KEY || 'YOUR_API_KEY_MISSING',
  apiSecret: process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET_MISSING',
};

const isSignedIn = ({ session }: Context) => !!session;
const isOwner = (fieldPath = 'user') => ({ session, item }: { session: Context['session'], item: any }) => {
  if (!session?.data?.id) return false;
  const ownerId = item[`${fieldPath}Id`] || (item[fieldPath] && item[fieldPath].id);
  return session.data.id === ownerId;
};

// --- User List ---
const UserListConfig = list({
  access: { operation: { query: () => true, create: () => true, update: ({ session, item }: any) => isSignedIn({ session }) && session?.data.id === item.id, delete: ({ session, item }: any) => isSignedIn({ session }) && session?.data.id === item.id, }, },
  fields: {
    username: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    email: text({ isIndexed: 'unique' }),
    password: password({ validation: { isRequired: true } }),
    bio: text({ ui: { displayMode: 'textarea' } }),
    profile_image: cloudinaryImage({ cloudinary: cloudinaryConfig }),
    date_joined: timestamp({ defaultValue: { kind: 'now' } }),
    isFollowing: virtual({ field: () => keystoneGraphql.field({ type: keystoneGraphql.Boolean, async resolve(item: any, args, context: Context) { if (!context.session?.data?.id) return false; const { id: userId } = item; const { id: followerId } = context.session.data; const fr = await context.db.Following.findOne({ where: { followerId_targetId: { followerId: followerId, targetId: userId } } }); return !!fr; } }), ui: { query: '(id)' } }),
    follower_count: virtual({ field: () => keystoneGraphql.field({ type: keystoneGraphql.Int, async resolve(item: any, args, context: Context) { return context.db.Following.count({ where: { target: { id: { equals: item.id } } } }); } }) }),
    post_count: virtual({ field: () => keystoneGraphql.field({ type: keystoneGraphql.Int, async resolve(item: any, args, context: Context) { return context.db.Post.count({ where: { user: { id: { equals: item.id } } } }); } }) }),
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
const PostListConfig = list({
  access: { operation: { query: () => true, create: isSignedIn, update: isOwner('user'), delete: isOwner('user'), }, },
  fields: {
    title: text({ validation: { isRequired: true } }),
    text: text({ ui: { displayMode: 'textarea' } }),
    createdAt: timestamp({ defaultValue: { kind: 'now' }, ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }),
    updatedAt: timestamp({ db: { updatedAt: true }, ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }),
    user: relationship({ ref: 'User.posts', ui: { createView: { fieldMode: ({ session }: any) => (session?.data ? 'hidden' : 'edit') }, itemView: { fieldMode: 'read' } } }),
    liked: virtual({ field: () => keystoneGraphql.field({ type: keystoneGraphql.Boolean, async resolve(item: any, args, context: Context) { if (!context.session?.data?.id) return false; const { id: postId } = item; const { id: userId } = context.session.data; const lr = await context.db.Like.findOne({ where: { userId_postId: { userId: userId, postId: postId } } }); return !!lr; } }), ui: { query: '(id)' } }),
    likeCount: integer({ defaultValue: 0, ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }),
    comment_count: virtual({ field: () => keystoneGraphql.field({ type: keystoneGraphql.Int, async resolve(item: any, args, context: Context) { return context.db.Comment.count({ where: { post: { id: { equals: item.id } } } }); } }) }),
    comments: relationship({ ref: 'Comment.post', many: true }),
    likes: relationship({ ref: 'Like.post', many: true }),
    notifications: relationship({ ref: 'Notification.post', many: true }),
  },
  hooks: { resolveInput: { create: async ({ resolvedData, context }: any) => { if (context.session?.data?.id) { return { ...resolvedData, user: { connect: { id: context.session.data.id } } }; } return resolvedData; } }, },
});

// --- Comment List ---
const CommentListConfig = list({
  access: { operation: { query: () => true, create: isSignedIn, update: isOwner('user'), delete: isOwner('user'), }, },
  fields: { content: text({ validation: { isRequired: true }, ui: { displayMode: 'textarea' } }), createdAt: timestamp({ defaultValue: { kind: 'now' }, ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }), updatedAt: timestamp({ db: { updatedAt: true }, ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }), user: relationship({ ref: 'User.comments', ui: { createView: { fieldMode: ({ session }: any) => (session?.data ? 'hidden' : 'edit') }, itemView: { fieldMode: 'read' } } }), post: relationship({ ref: 'Post.comments' }), notifications: relationship({ ref: 'Notification.comment', many: true }), },
  hooks: {
    resolveInput: { create: async ({ resolvedData, context }: any) => { if (context.session?.data?.id) { return { ...resolvedData, user: { connect: { id: context.session.data.id } } }; } return resolvedData; } },
    afterOperation: async ({ operation, item, context, resolvedData, originalItem }: any) => {
      if (operation === 'create' && item && context.session?.data?.id) {
        const commentData = item;
        const postId = commentData.postId || (resolvedData?.post as any)?.connect?.id;
        const commentId = commentData.id;
        if (!postId || !commentId) { console.error('Comment created but postId or commentId is missing for notification.'); return; }
        const postAuthor = await context.db.Post.findOne({ where: { id: postId }, });
        if (postAuthor && typeof postAuthor.userId === 'string' && postAuthor.userId !== context.session.data.id) {
          const notification = await context.db.Notification.createOne({
            data: { category: 'new_comment', recipient: { connect: { id: postAuthor.userId } }, sender: { connect: { id: context.session.data.id } }, post: { connect: { id: postId } }, comment: { connect: { id: commentId } } },
            query: 'id category read createdAt recipient { id username } sender { id username } post { id title } comment { id content }'
          });
          if (notification && context.pubsub) {
            context.pubsub.publish(NOTIFICATION_CREATED_TOPIC, { notification_created: notification, recipientId: postAuthor.userId });
          }
        }
      }
    },
  },
});

// --- Like List ---
const LikeListConfig = list({
  access: { operation: { query: () => true, create: isSignedIn, update: () => false, delete: isOwner('user'), }, },
  fields: {
    user: relationship({ ref: 'User.likes', ui: { createView: { fieldMode: ({ session }: any) => (session?.data ? 'hidden' : 'edit') } } }),
    post: relationship({ ref: 'Post.likes' }),
  },
  hooks: {
    resolveInput: { create: async ({ resolvedData, context }: any) => { if (context.session?.data?.id) { if (!resolvedData.post) { return resolvedData; } return { ...resolvedData, user: { connect: { id: context.session.data.id } } }; } return resolvedData; } },
    afterOperation: async ({ operation, item, originalItem, context, resolvedData }: any) => {
      let postIdToUpdate: string | null = null;
      if (operation === 'create' && item) {
        postIdToUpdate = item.postId || (resolvedData?.post as any)?.connect?.id;
        if (item && context.session?.data?.id) {
          const postDetails = await context.db.Post.findOne({ where: { id: postIdToUpdate }, select: { userId: true } });
          if (postDetails && postDetails.userId !== context.session.data.id) {
            const notification = await context.db.Notification.createOne({
              data: { category: 'new_like', recipient: { connect: { id: postDetails.userId } }, sender: { connect: { id: context.session.data.id } }, post: { connect: { id: postIdToUpdate } } },
              query: 'id category read createdAt recipient { id username } sender { id username } post { id title }'
            });
            if (notification && context.pubsub) {
              context.pubsub.publish(NOTIFICATION_CREATED_TOPIC, { notification_created: notification, recipientId: postDetails.userId });
            }
          }
        }
      } else if (operation === 'delete' && originalItem) {
        postIdToUpdate = originalItem.postId;
      }

      if (postIdToUpdate) {
        const count = await context.db.Like.count({ where: { post: { id: { equals: postIdToUpdate } } } });
        await context.db.Post.updateOne({ where: { id: postIdToUpdate }, data: { likeCount: count } });
      }
    },
  },
});

// --- Following List ---
const FollowingListConfig = list({
  access: { operation: { query: () => true, create: isSignedIn, update: () => false, delete: isOwner('follower'), }, },
  fields: { target: relationship({ ref: 'User.followers' }), follower: relationship({ ref: 'User.following', ui: { createView: { fieldMode: ({ session }: any) => (session?.data ? 'hidden' : 'edit') } } }), },
  hooks: {
    resolveInput: { create: async ({ resolvedData, context }: any) => { if (context.session?.data?.id) { if (!resolvedData.target) { return resolvedData; } return { ...resolvedData, follower: { connect: { id: context.session.data.id } } }; } return resolvedData; } },
    afterOperation: async ({ operation, item, context, resolvedData, originalItem }: any) => {
      if (operation === 'create' && item && context.session?.data?.id) {
        const followData = item;
        const targetId = followData.targetId || (resolvedData?.target as any)?.connect?.id;
        if(!targetId){ console.error('Follow created but targetId is missing for notification.'); return; }
        if (targetId !== context.session.data.id) {
          const notification = await context.db.Notification.createOne({
            data: { category: 'new_follow', recipient: { connect: { id: targetId } }, sender: { connect: { id: context.session.data.id } } },
            query: 'id category read createdAt recipient { id username } sender { id username }'
          });
          if (notification && context.pubsub) {
            context.pubsub.publish(NOTIFICATION_CREATED_TOPIC, { notification_created: notification, recipientId: targetId });
          }
        }
      }
    },
  },
});

// --- Notification List ---
const NotificationListConfig = list({
  access: { operation: { query: isSignedIn, create: () => false, update: isOwner('recipient'), delete: isOwner('recipient'), }, filter: { query: ({ session }: any) => { if (!session?.data?.id) return { id: { equals: null } }; return { recipient: { id: { equals: session.data.id } } }; }, update: ({ session }: any) => { if (!session?.data?.id) return { id: { equals: null } }; return { recipient: { id: { equals: session.data.id } } }; }, delete: ({ session }: any) => { if (!session?.data?.id) return { id: { equals: null } }; return { recipient: { id: { equals: session.data.id } } }; }, }, },
  fields: { category: text({ validation: { isRequired: true } }), read: checkbox({ defaultValue: false }), createdAt: timestamp({ defaultValue: { kind: 'now' }, ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }), updatedAt: timestamp({ db: { updatedAt: true }, ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }), recipient: relationship({ ref: 'User.notifications' }), sender: relationship({ ref: 'User.sent_notifications' }), post: relationship({ ref: 'Post.notifications' }), comment: relationship({ ref: 'Comment.notifications' }), },
});

// --- Page List ---
const PageListConfig = list({
  access: { operation: { query: () => true, create: isSignedIn, update: isSignedIn, delete: isSignedIn, }, },
  fields: {
    title: text({ validation: { isRequired: true } }),
    slug: text({ isIndexed: 'unique', validation: { isRequired: true } }),
    content: document({
      formatting: true,
      layouts: [ [1, 1], [1, 1, 1], ],
      links: true,
      dividers: true,
      componentBlocks: {
        imageBlock: { label: 'Image', schema: { image: cloudinaryImage({ cloudinary: cloudinaryConfig, }), altText: text({ label: 'Alt Text' }), caption: text({ label: 'Caption' }), } },
        callToActionBlock: { label: 'Call to Action', schema: { heading: text({ validation: { isRequired: true } }), text: text({ ui: { displayMode: 'textarea' } }), buttonText: text({ validation: { isRequired: true }, label: 'Button Text' }), buttonLink: text({ validation: { isRequired: true }, label: 'Button Link (URL)' }), alignment: text({ label: 'Alignment (left/center)' }), } },
        quoteBlock: { label: 'Quote', schema: { quote: text({ validation: { isRequired: true }, ui: { displayMode: 'textarea' } }), attribution: text(), } }
      },
    }),
    author: relationship({ ref: 'User', ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } } }),
    publishedAt: timestamp(),
    metaTitle: text(),
    metaDescription: text({ ui: { displayMode: 'textarea' } }),
  },
});

export const lists = {
  User: UserListConfig,
  Post: PostListConfig,
  Comment: CommentListConfig,
  Like: LikeListConfig,
  Following: FollowingListConfig,
  Notification: NotificationListConfig,
  Page: PageListConfig,
};

export const extendGraphqlSchema = keystoneGraphql.extend(base => {
  const ReadNotificationOutput = keystoneGraphql.object<any>()({
    name: 'ReadNotificationOutput',
    fields: () => ({
      id: keystoneGraphql.field({ type: keystoneGraphql.ID }),
      read: keystoneGraphql.field({ type: keystoneGraphql.Boolean }),
    }),
  });

  // Define GraphQLNotification type based on Notification list structure for subscription payload
  const GraphQLNotification = keystoneGraphql.object<any>()({
    name: 'GraphQLNotification', // Explicitly name the type
    fields: {
      id: keystoneGraphql.field({ type: keystoneGraphql.ID }),
      category: keystoneGraphql.field({ type: keystoneGraphql.String }),
      read: keystoneGraphql.field({ type: keystoneGraphql.Boolean }),
      createdAt: keystoneGraphql.field({ type: keystoneGraphql.String }), // Using String for DateTime
      recipient: keystoneGraphql.field({
        type: 'User', // Changed from keystoneGraphql.JSON
        resolve: async (item: any, args: any, context: Context) => {
          // item already contains recipientId from the subscription resolver
          return item.recipientId ? context.db.User.findOne({ where: { id: item.recipientId } }) : null;
        }
      }),
      sender: keystoneGraphql.field({
        type: 'User', // Changed from keystoneGraphql.JSON
        resolve: async (item: any, args: any, context: Context) => {
          // item already contains senderId from the subscription resolver
          return item.senderId ? context.db.User.findOne({ where: { id: item.senderId } }) : null;
        }
      }),
      post: keystoneGraphql.field({
        type: 'Post', // Changed from keystoneGraphql.JSON
        resolve: async (item: any, args: any, context: Context) => {
          // item already contains postId from the subscription resolver
          return item.postId ? context.db.Post.findOne({ where: { id: item.postId } }) : null;
        }
      }),
      // Note: Comment field on Notification is not included in this simplified example payload.
    }
  });

  const existingMutations = base.mutation || {}; // Use base.mutation directly or empty object

  return {
    ...base,
    mutation: {
        ...existingMutations,
        readNotification: keystoneGraphql.field({
          type: ReadNotificationOutput,
          args: { id: keystoneGraphql.arg({ type: keystoneGraphql.ID }) },
          async resolve(source: any, { id }: { id: any }, context: Context) {
            if (!context.session?.data?.id) { throw new Error('Not authenticated'); }
            const currentUserId = context.session.data.id;
            if (id) {
              const notification = await context.db.Notification.findOne({ where: { id: id as string, recipientId: currentUserId }});
              if (!notification) { throw new Error('Notification not found or not authorized'); }
              return context.db.Notification.updateOne({ where: { id: id as string }, data: { read: !notification.read } });
            } else {
               throw new Error('Notification ID is required to mark as read/unread.');
            }
          },
        }),
    },
    subscription: {
      notification_created: keystoneGraphql.field({ // This is the standard way to define such a field
        type: GraphQLNotification,
        args: {}, // No client arguments for this subscription
        resolve: async (payload: any, args: any, context: any, info: any) => { // Simplified types
          // payload is { notification_created: {...}, recipientId: "..." }
          // This resolver transforms the event payload into the GraphQLNotification shape
          const rawNotification = payload.notification_created;
          return {
            id: rawNotification.id,
            category: rawNotification.category,
            read: rawNotification.read,
            createdAt: rawNotification.createdAt,
            recipientId: rawNotification.recipient?.connect?.id,
            senderId: rawNotification.sender?.connect?.id,
            postId: rawNotification.post?.connect?.id,
          };
        },
        subscribe: async function* (root: any, args: any, context: any, info: any) { // Simplified types
          if (!context.session?.data?.id || !context.pubsub) {
            // Must yield *something* or throw. An empty generator is fine for denial.
            async function* emptyGenerator(): AsyncGenerator<never, void, unknown> {}
            yield* emptyGenerator(); // Immediately completes.
            return;
          }
          const userId = context.session.data.id;
          const iterator = context.pubsub.asyncIterator(NOTIFICATION_CREATED_TOPIC);
          for await (const event of iterator) {
            if (event.recipientId === userId) {
              // The event itself (which contains notification_created and recipientId) is yielded.
              // The 'resolve' function above will then pick 'notification_created' from it.
              yield event;
            }
          }
        }
      }),
    },
  };
});
