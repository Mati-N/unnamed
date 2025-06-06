"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/schema.ts
var import_core, import_fields, import_fields_document, import_cloudinary, NOTIFICATION_CREATED_TOPIC, cloudinaryConfig, isSignedIn, isOwner, UserListConfig, PostListConfig, CommentListConfig, LikeListConfig, FollowingListConfig, NotificationListConfig, PageListConfig, lists, extendGraphqlSchema;
var init_schema = __esm({
  "src/schema.ts"() {
    "use strict";
    import_core = require("@keystone-6/core");
    import_fields = require("@keystone-6/core/fields");
    import_fields_document = require("@keystone-6/fields-document");
    import_cloudinary = require("@keystone-6/cloudinary");
    NOTIFICATION_CREATED_TOPIC = "NOTIFICATION_CREATED";
    cloudinaryConfig = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME_MISSING",
      apiKey: process.env.CLOUDINARY_API_KEY || "YOUR_API_KEY_MISSING",
      apiSecret: process.env.CLOUDINARY_API_SECRET || "YOUR_API_SECRET_MISSING"
    };
    isSignedIn = ({ session: session2 }) => !!session2;
    isOwner = (fieldPath = "user") => ({ session: session2, item }) => {
      if (!session2?.data?.id) return false;
      const ownerId = item[`${fieldPath}Id`] || item[fieldPath] && item[fieldPath].id;
      return session2.data.id === ownerId;
    };
    UserListConfig = (0, import_core.list)({
      access: { operation: { query: () => true, create: () => true, update: ({ session: session2, item }) => isSignedIn({ session: session2 }) && session2?.data.id === item.id, delete: ({ session: session2, item }) => isSignedIn({ session: session2 }) && session2?.data.id === item.id } },
      fields: {
        username: (0, import_fields.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
        email: (0, import_fields.text)({ isIndexed: "unique" }),
        password: (0, import_fields.password)({ validation: { isRequired: true } }),
        bio: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
        profile_image: (0, import_cloudinary.cloudinaryImage)({ cloudinary: cloudinaryConfig }),
        date_joined: (0, import_fields.timestamp)({ defaultValue: { kind: "now" } }),
        isFollowing: (0, import_fields.virtual)({ field: () => import_core.graphql.field({ type: import_core.graphql.Boolean, async resolve(item, args, context) {
          if (!context.session?.data?.id) return false;
          const { id: userId } = item;
          const { id: followerId } = context.session.data;
          const fr = await context.db.Following.findOne({ where: { followerId_targetId: { followerId, targetId: userId } } });
          return !!fr;
        } }), ui: { query: "(id)" } }),
        follower_count: (0, import_fields.virtual)({ field: () => import_core.graphql.field({ type: import_core.graphql.Int, async resolve(item, args, context) {
          return context.db.Following.count({ where: { target: { id: { equals: item.id } } } });
        } }) }),
        post_count: (0, import_fields.virtual)({ field: () => import_core.graphql.field({ type: import_core.graphql.Int, async resolve(item, args, context) {
          return context.db.Post.count({ where: { user: { id: { equals: item.id } } } });
        } }) }),
        posts: (0, import_fields.relationship)({ ref: "Post.user", many: true }),
        comments: (0, import_fields.relationship)({ ref: "Comment.user", many: true }),
        likes: (0, import_fields.relationship)({ ref: "Like.user", many: true }),
        notifications: (0, import_fields.relationship)({ ref: "Notification.recipient", many: true }),
        sent_notifications: (0, import_fields.relationship)({ ref: "Notification.sender", many: true }),
        following: (0, import_fields.relationship)({ ref: "Following.follower", many: true }),
        followers: (0, import_fields.relationship)({ ref: "Following.target", many: true })
      }
    });
    PostListConfig = (0, import_core.list)({
      access: { operation: { query: () => true, create: isSignedIn, update: isOwner("user"), delete: isOwner("user") } },
      fields: {
        title: (0, import_fields.text)({ validation: { isRequired: true } }),
        text: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
        createdAt: (0, import_fields.timestamp)({ defaultValue: { kind: "now" }, ui: { createView: { fieldMode: "hidden" }, itemView: { fieldMode: "read" } } }),
        updatedAt: (0, import_fields.timestamp)({ db: { updatedAt: true }, ui: { createView: { fieldMode: "hidden" }, itemView: { fieldMode: "read" } } }),
        user: (0, import_fields.relationship)({ ref: "User.posts", ui: { createView: { fieldMode: ({ session: session2 }) => session2?.data ? "hidden" : "edit" }, itemView: { fieldMode: "read" } } }),
        liked: (0, import_fields.virtual)({ field: () => import_core.graphql.field({ type: import_core.graphql.Boolean, async resolve(item, args, context) {
          if (!context.session?.data?.id) return false;
          const { id: postId } = item;
          const { id: userId } = context.session.data;
          const lr = await context.db.Like.findOne({ where: { userId_postId: { userId, postId } } });
          return !!lr;
        } }), ui: { query: "(id)" } }),
        likeCount: (0, import_fields.integer)({ defaultValue: 0, ui: { createView: { fieldMode: "hidden" }, itemView: { fieldMode: "read" } } }),
        comment_count: (0, import_fields.virtual)({ field: () => import_core.graphql.field({ type: import_core.graphql.Int, async resolve(item, args, context) {
          return context.db.Comment.count({ where: { post: { id: { equals: item.id } } } });
        } }) }),
        comments: (0, import_fields.relationship)({ ref: "Comment.post", many: true }),
        likes: (0, import_fields.relationship)({ ref: "Like.post", many: true }),
        notifications: (0, import_fields.relationship)({ ref: "Notification.post", many: true })
      },
      hooks: { resolveInput: { create: async ({ resolvedData, context }) => {
        if (context.session?.data?.id) {
          return { ...resolvedData, user: { connect: { id: context.session.data.id } } };
        }
        return resolvedData;
      } } }
    });
    CommentListConfig = (0, import_core.list)({
      access: { operation: { query: () => true, create: isSignedIn, update: isOwner("user"), delete: isOwner("user") } },
      fields: { content: (0, import_fields.text)({ validation: { isRequired: true }, ui: { displayMode: "textarea" } }), createdAt: (0, import_fields.timestamp)({ defaultValue: { kind: "now" }, ui: { createView: { fieldMode: "hidden" }, itemView: { fieldMode: "read" } } }), updatedAt: (0, import_fields.timestamp)({ db: { updatedAt: true }, ui: { createView: { fieldMode: "hidden" }, itemView: { fieldMode: "read" } } }), user: (0, import_fields.relationship)({ ref: "User.comments", ui: { createView: { fieldMode: ({ session: session2 }) => session2?.data ? "hidden" : "edit" }, itemView: { fieldMode: "read" } } }), post: (0, import_fields.relationship)({ ref: "Post.comments" }), notifications: (0, import_fields.relationship)({ ref: "Notification.comment", many: true }) },
      hooks: {
        resolveInput: { create: async ({ resolvedData, context }) => {
          if (context.session?.data?.id) {
            return { ...resolvedData, user: { connect: { id: context.session.data.id } } };
          }
          return resolvedData;
        } },
        afterOperation: async ({ operation, item, context, resolvedData, originalItem }) => {
          if (operation === "create" && item && context.session?.data?.id) {
            const commentData = item;
            const postId = commentData.postId || resolvedData?.post?.connect?.id;
            const commentId = commentData.id;
            if (!postId || !commentId) {
              console.error("Comment created but postId or commentId is missing for notification.");
              return;
            }
            const postAuthor = await context.db.Post.findOne({ where: { id: postId } });
            if (postAuthor && typeof postAuthor.userId === "string" && postAuthor.userId !== context.session.data.id) {
              const notification = await context.db.Notification.createOne({
                data: { category: "new_comment", recipient: { connect: { id: postAuthor.userId } }, sender: { connect: { id: context.session.data.id } }, post: { connect: { id: postId } }, comment: { connect: { id: commentId } } },
                query: "id category read createdAt recipient { id username } sender { id username } post { id title } comment { id content }"
              });
              if (notification && context.pubsub) {
                context.pubsub.publish(NOTIFICATION_CREATED_TOPIC, { notification_created: notification, recipientId: postAuthor.userId });
              }
            }
          }
        }
      }
    });
    LikeListConfig = (0, import_core.list)({
      access: { operation: { query: () => true, create: isSignedIn, update: () => false, delete: isOwner("user") } },
      fields: {
        user: (0, import_fields.relationship)({ ref: "User.likes", ui: { createView: { fieldMode: ({ session: session2 }) => session2?.data ? "hidden" : "edit" } } }),
        post: (0, import_fields.relationship)({ ref: "Post.likes" })
      },
      hooks: {
        resolveInput: { create: async ({ resolvedData, context }) => {
          if (context.session?.data?.id) {
            if (!resolvedData.post) {
              return resolvedData;
            }
            return { ...resolvedData, user: { connect: { id: context.session.data.id } } };
          }
          return resolvedData;
        } },
        afterOperation: async ({ operation, item, originalItem, context, resolvedData }) => {
          let postIdToUpdate = null;
          if (operation === "create" && item) {
            postIdToUpdate = item.postId || resolvedData?.post?.connect?.id;
            if (item && context.session?.data?.id) {
              const postDetails = await context.db.Post.findOne({ where: { id: postIdToUpdate }, select: { userId: true } });
              if (postDetails && postDetails.userId !== context.session.data.id) {
                const notification = await context.db.Notification.createOne({
                  data: { category: "new_like", recipient: { connect: { id: postDetails.userId } }, sender: { connect: { id: context.session.data.id } }, post: { connect: { id: postIdToUpdate } } },
                  query: "id category read createdAt recipient { id username } sender { id username } post { id title }"
                });
                if (notification && context.pubsub) {
                  context.pubsub.publish(NOTIFICATION_CREATED_TOPIC, { notification_created: notification, recipientId: postDetails.userId });
                }
              }
            }
          } else if (operation === "delete" && originalItem) {
            postIdToUpdate = originalItem.postId;
          }
          if (postIdToUpdate) {
            const count = await context.db.Like.count({ where: { post: { id: { equals: postIdToUpdate } } } });
            await context.db.Post.updateOne({ where: { id: postIdToUpdate }, data: { likeCount: count } });
          }
        }
      }
    });
    FollowingListConfig = (0, import_core.list)({
      access: { operation: { query: () => true, create: isSignedIn, update: () => false, delete: isOwner("follower") } },
      fields: { target: (0, import_fields.relationship)({ ref: "User.followers" }), follower: (0, import_fields.relationship)({ ref: "User.following", ui: { createView: { fieldMode: ({ session: session2 }) => session2?.data ? "hidden" : "edit" } } }) },
      hooks: {
        resolveInput: { create: async ({ resolvedData, context }) => {
          if (context.session?.data?.id) {
            if (!resolvedData.target) {
              return resolvedData;
            }
            return { ...resolvedData, follower: { connect: { id: context.session.data.id } } };
          }
          return resolvedData;
        } },
        afterOperation: async ({ operation, item, context, resolvedData, originalItem }) => {
          if (operation === "create" && item && context.session?.data?.id) {
            const followData = item;
            const targetId = followData.targetId || resolvedData?.target?.connect?.id;
            if (!targetId) {
              console.error("Follow created but targetId is missing for notification.");
              return;
            }
            if (targetId !== context.session.data.id) {
              const notification = await context.db.Notification.createOne({
                data: { category: "new_follow", recipient: { connect: { id: targetId } }, sender: { connect: { id: context.session.data.id } } },
                query: "id category read createdAt recipient { id username } sender { id username }"
              });
              if (notification && context.pubsub) {
                context.pubsub.publish(NOTIFICATION_CREATED_TOPIC, { notification_created: notification, recipientId: targetId });
              }
            }
          }
        }
      }
    });
    NotificationListConfig = (0, import_core.list)({
      access: { operation: { query: isSignedIn, create: () => false, update: isOwner("recipient"), delete: isOwner("recipient") }, filter: { query: ({ session: session2 }) => {
        if (!session2?.data?.id) return { id: { equals: null } };
        return { recipient: { id: { equals: session2.data.id } } };
      }, update: ({ session: session2 }) => {
        if (!session2?.data?.id) return { id: { equals: null } };
        return { recipient: { id: { equals: session2.data.id } } };
      }, delete: ({ session: session2 }) => {
        if (!session2?.data?.id) return { id: { equals: null } };
        return { recipient: { id: { equals: session2.data.id } } };
      } } },
      fields: { category: (0, import_fields.text)({ validation: { isRequired: true } }), read: (0, import_fields.checkbox)({ defaultValue: false }), createdAt: (0, import_fields.timestamp)({ defaultValue: { kind: "now" }, ui: { createView: { fieldMode: "hidden" }, itemView: { fieldMode: "read" } } }), updatedAt: (0, import_fields.timestamp)({ db: { updatedAt: true }, ui: { createView: { fieldMode: "hidden" }, itemView: { fieldMode: "read" } } }), recipient: (0, import_fields.relationship)({ ref: "User.notifications" }), sender: (0, import_fields.relationship)({ ref: "User.sent_notifications" }), post: (0, import_fields.relationship)({ ref: "Post.notifications" }), comment: (0, import_fields.relationship)({ ref: "Comment.notifications" }) }
    });
    PageListConfig = (0, import_core.list)({
      access: { operation: { query: () => true, create: isSignedIn, update: isSignedIn, delete: isSignedIn } },
      fields: {
        title: (0, import_fields.text)({ validation: { isRequired: true } }),
        slug: (0, import_fields.text)({ isIndexed: "unique", validation: { isRequired: true } }),
        content: (0, import_fields_document.document)({
          formatting: true,
          layouts: [[1, 1], [1, 1, 1]],
          links: true,
          dividers: true,
          componentBlocks: {
            imageBlock: { label: "Image", schema: { image: (0, import_cloudinary.cloudinaryImage)({ cloudinary: cloudinaryConfig }), altText: (0, import_fields.text)({ label: "Alt Text" }), caption: (0, import_fields.text)({ label: "Caption" }) } },
            callToActionBlock: { label: "Call to Action", schema: { heading: (0, import_fields.text)({ validation: { isRequired: true } }), text: (0, import_fields.text)({ ui: { displayMode: "textarea" } }), buttonText: (0, import_fields.text)({ validation: { isRequired: true }, label: "Button Text" }), buttonLink: (0, import_fields.text)({ validation: { isRequired: true }, label: "Button Link (URL)" }), alignment: (0, import_fields.text)({ label: "Alignment (left/center)" }) } },
            quoteBlock: { label: "Quote", schema: { quote: (0, import_fields.text)({ validation: { isRequired: true }, ui: { displayMode: "textarea" } }), attribution: (0, import_fields.text)() } }
          }
        }),
        author: (0, import_fields.relationship)({ ref: "User", ui: { createView: { fieldMode: "hidden" }, itemView: { fieldMode: "read" } } }),
        publishedAt: (0, import_fields.timestamp)(),
        metaTitle: (0, import_fields.text)(),
        metaDescription: (0, import_fields.text)({ ui: { displayMode: "textarea" } })
      }
    });
    lists = {
      User: UserListConfig,
      Post: PostListConfig,
      Comment: CommentListConfig,
      Like: LikeListConfig,
      Following: FollowingListConfig,
      Notification: NotificationListConfig,
      Page: PageListConfig
    };
    extendGraphqlSchema = import_core.graphql.extend((base) => {
      const ReadNotificationOutput = import_core.graphql.object()({
        name: "ReadNotificationOutput",
        fields: () => ({
          id: import_core.graphql.field({ type: import_core.graphql.ID }),
          read: import_core.graphql.field({ type: import_core.graphql.Boolean })
        })
      });
      const GraphQLNotification = import_core.graphql.object()({
        name: "GraphQLNotification",
        // Explicitly name the type
        fields: {
          id: import_core.graphql.field({ type: import_core.graphql.ID }),
          category: import_core.graphql.field({ type: import_core.graphql.String }),
          read: import_core.graphql.field({ type: import_core.graphql.Boolean }),
          createdAt: import_core.graphql.field({ type: import_core.graphql.String }),
          // Using String for DateTime
          recipient: import_core.graphql.field({
            type: "User",
            // Changed from keystoneGraphql.JSON
            resolve: async (item, args, context) => {
              return item.recipientId ? context.db.User.findOne({ where: { id: item.recipientId } }) : null;
            }
          }),
          sender: import_core.graphql.field({
            type: "User",
            // Changed from keystoneGraphql.JSON
            resolve: async (item, args, context) => {
              return item.senderId ? context.db.User.findOne({ where: { id: item.senderId } }) : null;
            }
          }),
          post: import_core.graphql.field({
            type: "Post",
            // Changed from keystoneGraphql.JSON
            resolve: async (item, args, context) => {
              return item.postId ? context.db.Post.findOne({ where: { id: item.postId } }) : null;
            }
          })
          // Note: Comment field on Notification is not included in this simplified example payload.
        }
      });
      const existingMutations = base.mutation || {};
      return {
        ...base,
        mutation: {
          ...existingMutations,
          readNotification: import_core.graphql.field({
            type: ReadNotificationOutput,
            args: { id: import_core.graphql.arg({ type: import_core.graphql.ID }) },
            async resolve(source, { id }, context) {
              if (!context.session?.data?.id) {
                throw new Error("Not authenticated");
              }
              const currentUserId = context.session.data.id;
              if (id) {
                const notification = await context.db.Notification.findOne({ where: { id, recipientId: currentUserId } });
                if (!notification) {
                  throw new Error("Notification not found or not authorized");
                }
                return context.db.Notification.updateOne({ where: { id }, data: { read: !notification.read } });
              } else {
                throw new Error("Notification ID is required to mark as read/unread.");
              }
            }
          })
        },
        subscription: {
          notification_created: import_core.graphql.field({
            // This is the standard way to define such a field
            type: GraphQLNotification,
            args: {},
            // No client arguments for this subscription
            resolve: async (payload, args, context, info) => {
              const rawNotification = payload.notification_created;
              return {
                id: rawNotification.id,
                category: rawNotification.category,
                read: rawNotification.read,
                createdAt: rawNotification.createdAt,
                recipientId: rawNotification.recipient?.connect?.id,
                senderId: rawNotification.sender?.connect?.id,
                postId: rawNotification.post?.connect?.id
              };
            },
            subscribe: async function* (root, args, context, info) {
              if (!context.session?.data?.id || !context.pubsub) {
                async function* emptyGenerator() {
                }
                yield* emptyGenerator();
                return;
              }
              const userId = context.session.data.id;
              const iterator = context.pubsub.asyncIterator(NOTIFICATION_CREATED_TOPIC);
              for await (const event of iterator) {
                if (event.recipientId === userId) {
                  yield event;
                }
              }
            }
          })
        }
      };
    });
  }
});

// src/auth.ts
var import_auth, import_session, sessionSecret, withAuth, session;
var init_auth = __esm({
  "src/auth.ts"() {
    "use strict";
    import_auth = require("@keystone-6/auth");
    import_session = require("@keystone-6/core/session");
    sessionSecret = process.env.SESSION_SECRET || "defaultcomplexenoughsecretshouldbeherepleasechange";
    ({ withAuth } = (0, import_auth.createAuth)({
      listKey: "User",
      // This should match the key of your User list in schema.ts
      identityField: "username",
      // Or 'email' if you prefer to login with email
      secretField: "password",
      initFirstItem: {
        // Optional: If you want to create a first admin user on startup
        fields: ["username", "password"]
        // Add 'email' if it's required for your User list
        // You can add more fields here if your User list has other required fields
        // itemData: { isAdmin: true }, // Example: if you have an isAdmin field
      },
      sessionData: "id username email"
      // Fields to include in the session object
    }));
    session = (0, import_session.statelessSessions)({
      maxAge: 60 * 60 * 24 * 30,
      // 30 days
      secret: sessionSecret
    });
  }
});

// src/keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
var import_core2, import_graphql_subscriptions, dbUrl, pubsub, keystone_default;
var init_keystone = __esm({
  "src/keystone.ts"() {
    "use strict";
    import_core2 = require("@keystone-6/core");
    init_schema();
    init_auth();
    import_graphql_subscriptions = require("graphql-subscriptions");
    dbUrl = process.env.DATABASE_URL || "file:./keystone.db";
    pubsub = new import_graphql_subscriptions.PubSub();
    keystone_default = withAuth(
      (0, import_core2.config)({
        db: {
          provider: "sqlite",
          url: dbUrl,
          async onConnect(context) {
            console.log("Connected to the database!");
          }
        },
        lists,
        session,
        ui: {
          isAccessAllowed: (context) => !!context.session?.data
          // Added :any to context
        },
        // --- GraphQL Server Configuration ---
        graphql: {
          // extendSchema is defined at the top level of config, not nested here.
        },
        extendGraphqlSchema,
        // Moved to top level
        // --- Making pubsub available in context (Keystone 6 specific way) ---
        extendContext: async (context) => {
          return {
            ...context,
            pubsub
            // Make pubsub instance available on the context
          };
        },
        // --- Server-side Subscriptions Setup ---
        // Keystone 6's default Apollo Server setup needs to be configured for subscriptions.
        // This typically involves enabling WebSockets.
        // The exact configuration might depend on Keystone version and how it exposes Apollo Server settings.
        // A common way in Apollo Server v3/v4 (which Keystone would likely use parts of):
        server: {
          // Health check removed
        }
      })
    );
  }
});

// keystone.js
module.exports = (init_keystone(), __toCommonJS(keystone_exports));
//# sourceMappingURL=config.js.map
