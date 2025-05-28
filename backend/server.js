require('dotenv').config({ path: '../.env' }); // Load environment variables from root .env file

const express = require('express');
const { createServer } = require('http'); // For WebSocket integration
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core'); // For ASv3+, or specific ASv4 plugins if needed
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { graphqlUploadExpress } = require('graphql-upload');

const db = require('./db');
const { typeDefs, resolvers } = require('./graphql');
const pubsub = require('./graphql/pubsub'); // Import PubSub instance
const { verifyToken } = require('./utils/auth');

async function startApolloServer() {
  const app = express();
  const httpServer = createServer(app); // Create HTTP server

  // Apply graphqlUploadExpress middleware early
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  // Test database connection
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Optionally, prevent server start if DB connection fails
    // process.exit(1); 
  }
  
  app.get('/status', (req, res) => {
    res.json({ status: 'Server is running' });
  });

  // Create the executable schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Set up WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql', // Match Apollo Server's GraphQL path
  });

  // `useServer` integrates GraphQL schema with the WebSocket server
  const serverCleanup = useServer({
    schema,
    context: async (ctx) => {
      let user = null;
      // Extract token from connectionParams (passed by client)
      const token = ctx.connectionParams?.Authorization?.split(' ')[1] || 
                    ctx.connectionParams?.authorization?.split(' ')[1] || '';
      if (token) {
        try {
          user = await verifyToken(token); // verifyToken should handle async if it becomes async
        } catch (e) {
          console.warn(\`Subscription connection denied due to invalid token: \${e.message}\`);
        }
      }
      return { pubsub, user, db }; // Provide pubsub, user, and db to subscription resolvers
    },
    onConnect: (ctx) => {
        console.log('Subscription client connected');
        // You can reject the connection by returning false or throwing an error
        // if (!ctx.connectionParams?.Authorization) return false; 
    },
    onDisconnect: (ctx, code, reason) => {
        console.log(\`Subscription client disconnected: \${code} \${reason}\`);
    },
  }, wsServer);

  // Configure Apollo Server
  const server = new ApolloServer({
    schema,
    csrfPrevention: true, // Recommended for AS3+
    plugins: [
      // Proper shutdown for the HTTP server
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      // Optional: Use GraphQL Playground if desired (AS3 usually defaults to it if not in production)
      // process.env.NODE_ENV !== 'production' ? ApolloServerPluginLandingPageGraphQLPlayground() : {},
    ],
    // Context for HTTP requests (Queries, Mutations)
    context: async ({ req }) => {
      let user = null;
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
          try {
            user = await verifyToken(token);
          } catch (error) {
            console.warn(\`HTTP request with invalid/expired token: \${error.message}\`);
          }
        }
      }
      // Provide pubsub here as well if mutations need to publish events directly
      // (though it's often cleaner to do it within services or after DB operations)
      return { user, db, pubsub }; 
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' }); // Ensure path matches WebSocket path

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(\`Server is running on http://localhost:\${PORT}\`);
    console.log(\`GraphQL endpoint ready at http://localhost:\${PORT}${server.graphqlPath}\`);
    console.log(\`Subscriptions ready at ws://localhost:\${PORT}${server.graphqlPath}\`);
  });
}

startApolloServer();
