# End-to-End (E2E) Testing Plan

This document outlines the strategy for End-to-End (E2E) testing of the complete application, including the React frontend and the KeystoneJS backend. E2E tests simulate real user scenarios to verify that all parts of the system work together correctly.

## Objectives of E2E Testing

*   Verify key user flows from start to finish.
*   Ensure frontend components correctly integrate with the backend API.
*   Validate data consistency across the application.
*   Catch issues related to deployment, environment configuration, and interactions between different services.

## Recommended E2E Testing Tools

*   **[Cypress](https://www.cypress.io/):** A popular JavaScript-based E2E testing framework known for its ease of use, speed, and reliability. It runs directly in the browser.
*   **[Playwright](https://playwright.dev/):** Developed by Microsoft, Playwright enables reliable E2E testing for modern web apps across all modern browsers.
*   **[Selenium](https://www.selenium.dev/):** A long-standing E2E testing tool with broad language support, though often considered more complex to set up than Cypress or Playwright for JavaScript projects.

The choice of tool depends on team familiarity and specific project needs. Cypress or Playwright are generally recommended for modern React/Node.js stacks.

## Test Environment for E2E

*   A dedicated E2E testing environment that mirrors production as closely as possible.
*   This environment should have the frontend and backend deployed and running, connected to a dedicated test database.
*   The test database should be seeded with appropriate test data before test runs, or tests should create their own data and clean up afterwards.
*   External services (like Cloudinary) might use test accounts or be mocked at a higher level if necessary, though E2E tests benefit from testing real integrations where feasible and non-destructive.

## Key User Flows and Scenarios for E2E Testing

**1. User Authentication:**
    *   **Registration:** A new user can successfully register through the frontend form, and their account is created in the backend.
    *   **Login:** A registered user can log in with correct credentials and is redirected to the appropriate page (e.g., dashboard). Session/token is correctly established.
    *   **Failed Login:** Login fails with incorrect credentials, and appropriate error messages are displayed.
    *   **Logout:** A logged-in user can log out, and their session is terminated.
    *   **Profile Update:** A logged-in user can update their profile information (e.g., bio, upload a new profile image via Cloudinary integration), and changes are reflected.

**2. Core Social Features:**
    *   **Post Creation:** An authenticated user can create a new post, and it appears in relevant feeds.
    *   **Post Viewing:** Users can view individual posts and lists of posts (e.g., all posts, posts by a specific user, posts from followed users).
    *   **Post Editing/Deleting:** The author of a post can edit and delete their own post. Other users cannot.
    *   **Commenting:** An authenticated user can add a comment to a post. Comments are displayed correctly. Comment authors can edit/delete their comments.
    *   **Liking/Unliking:** An authenticated user can like a post. The like count updates. The user can unlike the post, and the count updates. The "liked" status for the current user is correctly displayed.
    *   **Following/Unfollowing Users:** An authenticated user can follow another user. The follower/following counts update. The "isFollowing" status is correctly displayed. The user can unfollow.

**3. Notifications:**
    *   **Notification Creation (Triggered by Actions):**
        *   Verify that when User B likes User A's post, User A receives a "new_like" notification.
        *   Verify that when User B comments on User A's post, User A receives a "new_comment" notification.
        *   Verify that when User B follows User A, User A receives a "new_follow" notification.
    *   **Notification Display:** A user can view their list of notifications.
    *   **Marking Notifications as Read:** A user can mark individual notifications or all notifications as read, and this status is updated.
    *   **Real-time Notifications (if frontend implements subscriptions):** Verify that new notifications appear in the UI in real-time without requiring a page refresh.

**4. CMS Page Rendering (KeystoneJS `Page` List):**
    *   **View Static Pages:** Users can navigate to and view pages created via the CMS (e.g., About Us, Contact Us, using slugs).
    *   **Render Document Field Content:**
        *   Verify correct rendering of basic formatting (headings, paragraphs, lists, links, dividers).
        *   Verify correct rendering of custom component blocks (e.g., Image block with Cloudinary image, CallToAction block, Quote block) defined in the Keystone `Page.content` field.
    *   **SEO Meta Tags:** Check that meta title and description (if implemented) are correctly rendered in the page's HTML head.

**5. Access Control & Authorization:**
    *   Attempt to perform actions that should be denied (e.g., an unauthenticated user trying to create a post, a user trying to edit another user's post). Verify that appropriate error messages or redirects occur.
    *   Verify Admin UI access is restricted to authenticated users.

## Test Execution and Reporting

*   E2E tests should be run regularly, ideally as part of the CI/CD pipeline after deployments to staging or E2E environments.
*   Test reports should clearly indicate pass/fail status for each scenario and provide detailed error logs and screenshots/videos for failures to aid debugging.

## Example E2E Test Snippet (Conceptual - Cypress-like)

```javascript
// cypress/e2e/login.cy.js (Conceptual)

// describe('Login Flow', () => {
//   beforeEach(() => {
//     // cy.visit('/login'); // Navigate to login page
//     // cy.fixture('users.json').as('users'); // Load test user data
//   });

//   it('should allow a registered user to login successfully', function () {
//     // const { validUser } = this.users;
//     // cy.get('input[name="username"]').type(validUser.username);
//     // cy.get('input[name="password"]').type(validUser.password);
//     // cy.get('button[type="submit"]').click();
//     // cy.url().should('include', '/dashboard'); // Or whatever the post-login page is
//     // cy.contains(`Welcome, ${validUser.username}`).should('be.visible');
//   });

//   it('should display an error for invalid credentials', function () {
//     // const { invalidUser } = this.users;
//     // cy.get('input[name="username"]').type(invalidUser.username);
//     // cy.get('input[name="password"]').type(invalidUser.password);
//     // cy.get('button[type="submit"]').click();
//     // cy.get('.error-message').should('contain', 'Invalid username or password');
//   });
// });
```

This E2E testing phase is critical for ensuring the entire application works as expected from a user's perspective.
