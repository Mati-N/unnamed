
import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';

// TODO: Update SESSION_SECRET in .env file with a strong secret
const sessionSecret = process.env.SESSION_SECRET || 'defaultcomplexenoughsecretshouldbeherepleasechange';

// createAuth configures how Keystone authenticates users
// We're using the User list and identifying users by their username (or email)
// The password field is specified as secretField
const { withAuth } = createAuth({
  listKey: 'User', // This should match the key of your User list in schema.ts
  identityField: 'username', // Or 'email' if you prefer to login with email
  secretField: 'password',
  initFirstItem: { // Optional: If you want to create a first admin user on startup
    fields: ['username', 'password'], // Add 'email' if it's required for your User list
    // You can add more fields here if your User list has other required fields
    // itemData: { isAdmin: true }, // Example: if you have an isAdmin field
  },
  sessionData: 'id username email', // Fields to include in the session object
});

// statelessSessions uses JWTs for session management
// This is common for headless APIs
const session = statelessSessions({
  maxAge: 60 * 60 * 24 * 30, // 30 days
  secret: sessionSecret,
});

export { withAuth, session };
