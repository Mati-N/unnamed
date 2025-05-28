require('dotenv').config({ path: '../.env' }); // Load environment variables from root .env file

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload'); // For file uploads
const db = require('./db'); // Import the database configuration
const { typeDefs, resolvers } = require('./graphql'); // Import combined typeDefs and resolvers
const { verifyToken } = require('./utils/auth'); // Import token verification utility
// const { authenticateJWT } = require('./middleware/authMiddleware'); // authenticateJWT for REST if needed

async function startServer() {
  const app = express();

  // Apply graphqlUploadExpress middleware for handling file uploads
  // It should be placed before Apollo Server middleware
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); // Example limits


  // Test database connection
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    // Optional: Sync models (be cautious with this in production)
    // await db.sequelize.sync({ alter: true }); 
    // console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  // Basic route for checking server status
  app.get('/status', (req, res) => {
    res.json({ status: 'Server is running' });
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // For WebSocket connections, req might not be available in the same way.
      // This context setup is primarily for HTTP requests.
      let user = null;
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1]; // Expecting "Bearer TOKEN_STRING"
        if (token) {
          try {
            const decoded = verifyToken(token);
            user = decoded; // Attach decoded user payload (e.g., { id, username })
          } catch (error) {
            console.warn('Invalid or expired token for GraphQL context:', error.message);
            // User remains null if token is invalid/expired
          }
        }
      }
      return { user, db }; // Provide user and db to all resolvers
    },
  });

  await server.start(); // Ensure server is started before applying middleware

  // Apply Apollo Server middleware
  server.applyMiddleware({ app }); // Default path is /graphql

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
