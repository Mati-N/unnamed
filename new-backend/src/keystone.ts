import { config } from '@keystone-6/core';
import { lists, extendGraphqlSchema } from './schema'; // Import extendGraphqlSchema
import { withAuth, session } from './auth';
// import { createYoga } from 'graphql-yoga'; // Not using direct Yoga for now
// import { createServer } from 'node:http';
import { PubSub } from 'graphql-subscriptions'; // Simple in-memory PubSub

const dbUrl = process.env.DATABASE_URL || 'file:./keystone.db';
const pubsub = new PubSub(); // Initialize PubSub

export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      url: dbUrl,
      async onConnect(context) { console.log('Connected to the database!'); },
    },
    lists,
    session,
    ui: {
      isAccessAllowed: (context: any) => !!context.session?.data, // Added :any to context
    },
    // --- GraphQL Server Configuration ---
    graphql: {
      // extendSchema is defined at the top level of config, not nested here.
    },
    extendGraphqlSchema: extendGraphqlSchema, // Moved to top level
    // --- Making pubsub available in context (Keystone 6 specific way) ---
    extendContext: async (context: any) => { // Added :any to context
      return {
        ...context,
        pubsub // Make pubsub instance available on the context
      };
    },
    // --- Server-side Subscriptions Setup ---
    // Keystone 6's default Apollo Server setup needs to be configured for subscriptions.
    // This typically involves enabling WebSockets.
    // The exact configuration might depend on Keystone version and how it exposes Apollo Server settings.
    // A common way in Apollo Server v3/v4 (which Keystone would likely use parts of):
    server: {
      // Health check removed
    },
  })
);
