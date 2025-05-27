const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const http = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const { graphqlUploadExpress } = require('graphql-upload'); // For file uploads

const { sequelize, ...models } = require('./models');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to get user from token
const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    // Assuming token might be "Bearer <actual_token>" or just "<actual_token>"
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    if (!actualToken) return null;
    return jwt.verify(actualToken, JWT_SECRET);
  } catch (err) {
    console.error('Invalid/Expired token for subscription:', err.message);
    return null;
  }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply graphqlUploadExpress middleware before Apollo Server middleware
// maxFileSize and maxFiles are examples; adjust as needed
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));


// Create HTTP server - Express app will be a middleware for this server
const httpServer = http.createServer(app);

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, connection }) => {
    if (connection) {
      // For WebSocket connections (subscriptions)
      return { ...connection.context, models };
    }
    // For HTTP requests (queries/mutations)
    const context = { models };
    if (req && req.headers && req.headers.authorization) {
      const user = getUserFromToken(req.headers.authorization);
      if (user) {
        context.user = user;
      }
    }
    return context;
  },
  formatError: (error) => {
    console.error("GraphQL Error:", JSON.stringify(error, null, 2));
    return error;
  },
  // Note: For Apollo Server v2/v3 with graphql-upload, `uploads` option is often set to false.
  // However, with graphqlUploadExpress middleware, this might not be needed or might be true.
  // Check Apollo Server and graphql-upload documentation if issues arise.
  // uploads: false, // Typical for AS2 when using graphqlUploadExpress
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Database synchronization and server start
  try {
    await sequelize.authenticate();
    console.log('Database authenticated successfully.');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    // Start listening on the HTTP server, not the Express app directly
    httpServer.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
      console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.graphqlPath}`);

      // Setup SubscriptionServer for WebSocket handling
      SubscriptionServer.create(
        {
          schema: server.schema, // Use schema from ApolloServer instance
          execute,
          subscribe,
          onConnect: (connectionParams, webSocket, context) => {
            console.log('Client attempting to connect for subscriptions...');
            const token = connectionParams.Authorization || connectionParams.authorization || connectionParams.authToken;
            if (token) {
              const user = getUserFromToken(token);
              if (user) {
                console.log('Client authenticated for subscriptions:', user.email);
                // This context ( {user, models} ) will be available in connection.context in ApolloServer context
                return { user, models }; 
              } else {
                console.log('Subscription connection with invalid token.');
                // Allow connection but without user context, or throw error to deny
                // throw new Error('Invalid auth token for subscriptions!'); 
              }
            }
            console.log('Subscription connection without token.');
            return { models }; // Basic context without user, still provide models
          },
          onDisconnect: (webSocket, context) => {
            console.log('Client disconnected from subscriptions');
          },
        },
        {
          server: httpServer,
          path: server.graphqlPath, // Use the same path as GraphQL endpoint
        }
      );
    });
  } catch (err) {
    console.error('Unable to connect to the database or start server:', err);
    process.exit(1);
  }
}

startServer();

// Export app for potential testing, though httpServer is the main listener
module.exports = app; 
