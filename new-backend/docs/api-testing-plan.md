# API Testing Plan for KeystoneJS Backend

This document outlines the strategy and examples for testing the KeystoneJS GraphQL API.
Thorough testing is crucial to ensure the API is functional, secure, and reliable.

## Testing Tools

*   **Testing Framework:** [Jest](https://jestjs.io/) is a popular choice for Node.js testing, offering a test runner, assertion library, and mocking capabilities.
*   **HTTP Client for Integration Tests:** A library like `supertest` (often used with Express) or `apollo-server-testing` (if using Apollo Server directly, though Keystone has its own test utils or can be tested via HTTP requests to its GraphQL endpoint). Keystone's documentation should be consulted for recommended testing utilities for its GraphQL layer.
*   **Mocking:** Jest provides built-in mocking. For database interactions, Prisma Client can be mocked, or a separate test database can be used.

## Types of Tests

1.  **Unit Tests:**
    *   Focus on individual functions or modules if complex logic is extracted outside of Keystone's declarative schema (e.g., custom utility functions).
    *   For this project, much of the logic is within Keystone's schema resolvers and hooks, which are better tested via integration tests.

2.  **Integration Tests (GraphQL API):**
    *   These are the most critical tests for this backend. They involve sending actual GraphQL queries and mutations to a running KeystoneJS instance (connected to a test database).
    *   **Scope:**
        *   CRUD operations for all lists (User, Post, Comment, Like, Following, Notification, Page).
        *   Authentication mutations (login, logout, session management).
        *   Custom mutations (e.g., `readNotification`).
        *   GraphQL Subscriptions (e.g., `notification_created`).
        *   Access control rules (verifying users can/cannot perform actions based on their roles/ownership).
        *   Virtual field resolvers (e.g., `isFollowing`, `liked`, count fields).
        *   Hook logic (e.g., ensuring `likeCount` is updated correctly, notifications are created upon specific actions).
        *   File uploads (e.g., profile image to Cloudinary).
        *   Filtering and ordering capabilities.

3.  **End-to-End (E2E) Tests:**
    *   These would involve testing the entire system, including a frontend application interacting with the API. This is beyond the scope of this backend-specific testing plan but is mentioned for completeness.

## Test Environment Setup

*   **Separate Test Database:** Essential to avoid conflicts with development or production data. The `DATABASE_URL` environment variable should point to this test database when running tests.
*   **Database Seeding/Resetting:** Scripts or fixtures to populate the test database with consistent data before test runs, and mechanisms to clean up or reset the database between tests or test suites. Prisma migrations should be applied to the test database.
*   **Mocking External Services:** For services like Cloudinary, use mocking libraries to simulate uploads and responses without making actual external calls during most tests.
*   **Environment Variables:** Test-specific environment variables (e.g., for a test Cloudinary setup if not fully mocked).

## Conceptual Test Case Examples (using Jest-like syntax)

These are illustrative and assume a helper for making GraphQL requests to the test server.

```javascript
// __tests__/auth.test.js (Conceptual)

// describe('Authentication', () => {
//   beforeAll(async () => { /* Setup: start server, connect to test DB, seed data */ });
//   afterAll(async () => { /* Teardown: stop server, clear DB */ });

//   it('should allow a new user to register', async () => {
//     // const response = await graphqlRequest({
//     //   query: `mutation { createUser(data: { username: "testuser", password: "password123" }) { id username } }`
//     // });
//     // expect(response.data.createUser.id).toBeDefined();
//     // expect(response.data.createUser.username).toBe("testuser");
//   });

//   it('should allow a registered user to login', async () => {
//     // First, ensure user exists or create one.
//     // const response = await graphqlRequest({
//     //   query: `mutation { authenticateUserWithPassword(username: "testuser", password: "password123") { item { id } sessionToken } }`
//     // });
//     // expect(response.data.authenticateUserWithPassword.sessionToken).toBeDefined();
//     // expect(response.data.authenticateUserWithPassword.item.id).toBeDefined();
//   });

//   // ... more tests for failed login, logout, session validation etc.
// });


// __tests__/post.test.js (Conceptual)

// describe('Posts', () => {
//   let authenticatedUserClient; // GraphQL client authenticated as a user
//   let anotherUserClient;
//   let unauthenticatedClient;
//   let createdPostId;

//   beforeAll(async () => {
//     // Setup clients, create users, login to get tokens for authenticatedClient etc.
//     // authenticatedUserClient = await getAuthenticatedClient("user1", "password");
//     // anotherUserClient = await getAuthenticatedClient("user2", "password");
//     // unauthenticatedClient = getUnauthenticatedClient();
//   });

//   it('should allow an authenticated user to create a post', async () => {
//     // const response = await authenticatedUserClient.mutate({
//     //   mutation: `mutation { createPost(data: { title: "My Test Post", text: "Content" }) { id title user { id } } }`
//     // });
//     // expect(response.data.createPost.id).toBeDefined();
//     // expect(response.data.createPost.title).toBe("My Test Post");
//     // expect(response.data.createPost.user.id).toBe(authenticatedUserClient.userId);
//     // createdPostId = response.data.createPost.id;
//   });

//   it('should not allow an unauthenticated user to create a post', async () => {
//     // try {
//     //   await unauthenticatedClient.mutate({ /* ... createPost mutation ... */ });
//     // } catch (error) {
//     //   expect(error.graphQLErrors[0].message).toContain("Access denied"); // Or similar error
//     // }
//   });

//   it('should allow the owner to update their post', async () => {
//     // const response = await authenticatedUserClient.mutate({
//     //   mutation: `mutation { updatePost(where: { id: "${createdPostId}" }, data: { title: "Updated Title" }) { id title } }`
//     // });
//     // expect(response.data.updatePost.title).toBe("Updated Title");
//   });

//   it('should not allow another user to update a post', async () => {
//     // try {
//     //   await anotherUserClient.mutate({ /* ... updatePost mutation on createdPostId ... */ });
//     // } catch (error) {
//     //   expect(error.graphQLErrors[0].message).toContain("Access denied");
//     // }
//   });

//   it('should correctly update likeCount when a post is liked and unliked', async () => {
//     // 1. Get initial likeCount
//     // const initialPost = await authenticatedUserClient.query({ query: `{ post(where: { id: "${createdPostId}"}) { likeCount } }` });
//     // expect(initialPost.data.post.likeCount).toBe(0);

//     // 2. Like the post
//     // await anotherUserClient.mutate({ mutation: `mutation { createLike(data: { post: { connect: { id: "${createdPostId}" } } }) { id } }` });
//     // const postAfterLike = await authenticatedUserClient.query({ query: `{ post(where: { id: "${createdPostId}"}) { likeCount } }` });
//     // expect(postAfterLike.data.post.likeCount).toBe(1);

//     // 3. Unlike the post (requires finding the Like ID or a custom unlike mutation)
//     //    (Assuming a way to get the like ID and then delete it)
//     // await anotherUserClient.mutate({ mutation: `mutation { deleteLike(where: { id: "LIKE_ID" }) { id } }` });
//     // const postAfterUnlike = await authenticatedUserClient.query({ query: `{ post(where: { id: "${createdPostId}"}) { likeCount } }` });
//     // expect(postAfterUnlike.data.post.likeCount).toBe(0);
//   });

//   // ... tests for virtual fields like 'liked', 'comment_count'
//   // ... tests for ordering by likeCount
// });

// __tests__/notification.test.js (Conceptual)
// describe('Notifications and Subscriptions', () => {
//   // ... setup ...
//   it('should create a notification when a user likes another user\'s post', async () => {
//     // UserA creates a post.
//     // UserB likes UserA's post.
//     // Verify UserA receives a 'new_like' notification.
//     // (This involves querying UserA's notifications).
//   });

//   it('should publish to notification_created subscription when a notification is created', (done) => {
//     // const subscribingClient = getAuthenticatedClientForSubscription("userA"); // User who will receive notification
//     // const actingClient = getAuthenticatedClient("userB"); // User performing action

//     // subscribingClient.subscribe({ query: `subscription { notification_created { id category } }`})
//     //   .subscribe({
//     //     next: (data) => {
//     //       expect(data.data.notification_created.category).toBe('new_like'); // Or other category
//     //       done(); // Call done to finish the test
//     //     },
//     //     error: (err) => done(err),
//     //   });

//     // // Give subscription a moment to establish
//     // setTimeout(async () => {
//     //   // UserB likes a post by UserA (which triggers notification creation)
//     //   // await actingClient.mutate({ /* ... like post mutation ... */ });
//     // }, 100);
//   });
// });
```

## Test Execution Strategy

*   **Automated Tests:** Run as part of a CI/CD pipeline on every commit/PR.
*   **Local Testing:** Developers should run tests locally before pushing code.
*   **Coverage:** Aim for high test coverage, especially for critical paths, access control, and business logic in hooks/resolvers.

This plan provides a conceptual framework. Actual implementation would require detailed test cases for all API functionalities.
