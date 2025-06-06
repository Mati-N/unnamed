# Frontend Integration Plan: Connecting to KeystoneJS Backend

This document outlines the necessary steps and considerations for updating the existing React frontend to integrate with the new KeystoneJS backend.

## Overview

The frontend application (originally in the `frontend/` directory) needs to be updated to communicate with the KeystoneJS GraphQL API instead of the old Django Graphene API. This involves changes to API endpoint configuration, GraphQL queries/mutations, authentication handling, and rendering of CMS content.

## Key Areas for Frontend Modification

1.  **GraphQL Client Configuration (e.g., Apollo Client):**
    *   **API Endpoint:** Update the GraphQL URI to point to the KeystoneJS server (e.g., `http://localhost:3000/api/graphql` or the production URL).
    *   **Authentication (JWT Handling):**
        *   Modify how JWTs are stored (e.g., localStorage, secure cookie) and retrieved.
        *   Update the mechanism for adding the JWT to the `Authorization` header (e.g., `Bearer <token>`) for authenticated requests. Keystone's session management might return tokens differently than the old system.
        *   Adjust login/logout logic to use Keystone's authentication mutations and session management.
    *   **WebSocket Link (for Subscriptions):** Configure the GraphQL client to support subscriptions via WebSockets, pointing to the correct WebSocket endpoint provided by KeystoneJS for GraphQL subscriptions.

2.  **User Authentication Components:**
    *   Login, registration, and logout forms/components will need to use the new KeystoneJS GraphQL mutations for authentication.
    *   Update user context or state management to reflect Keystone's session data structure.

3.  **Content Display Components (Posts, Comments, User Profiles):**
    *   Review and update GraphQL queries used to fetch data for posts, comments, user profiles, likes, follows, etc.
    *   Field names or data structures might have changed slightly with the new KeystoneJS schema (e.g., `likeCount` is now a direct field on `Post`).
    *   Adapt components to render data based on the updated queries.
    *   Ensure components correctly use the new virtual fields like `isFollowing` and `liked`.

4.  **Content Creation/Modification Components:**
    *   Forms for creating/editing posts, comments, and user profiles need to use the updated KeystoneJS mutations.
    *   File upload logic for profile images needs to integrate with how Keystone's `cloudinaryImage` field expects uploads (typically a GraphQL multipart request).

5.  **CMS Page Rendering (Wagtail -> KeystoneJS Page List):**
    *   **Data Fetching:** Create new GraphQL queries to fetch content from the KeystoneJS `Page` list (e.g., by slug).
    *   **Document Field Rendering:** The `Page.content` field is a KeystoneJS `document` field, which outputs a structured JSON (based on Tiptap/ProseMirror).
        *   A dedicated renderer component will be needed in the frontend to traverse this JSON and render appropriate HTML elements or React components.
        *   KeystoneJS provides utilities or examples for rendering document fields (e.g., `@keystone-6/document-renderer`). This package should be used.
        *   Custom components defined in the `Page.content` field's `componentBlocks` (e.g., `imageBlock`, `callToActionBlock`) will need corresponding React components in the frontend that the document renderer can map to.

6.  **Notification System:**
    *   Update components that display notifications to fetch data from the KeystoneJS `Notification` list.
    *   Implement GraphQL subscription client logic to listen for `notification_created` events and update the UI in real-time.
    *   Ensure "mark as read" functionality uses the new `readNotification` mutation.

## Conceptual Code Snippets (React with Apollo Client)

**1. Apollo Client Setup (Simplified):**
```javascript
// src/apolloClient.js (Conceptual)
// import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
// import { GraphQLWsLink } from '@apollo/client/link/subscriptions'; // For subscriptions
// import { createClient } from 'graphql-ws'; // For subscriptions
// import { getMainDefinition } from '@apollo/client/utilities';

// const httpLink = createHttpLink({
//   uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:3000/api/graphql',
// });

// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem('authToken'); // Or your token storage mechanism
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     }
//   }
// });

// const wsLink = typeof window !== 'undefined' ? new GraphQLWsLink(createClient({
//   url: process.env.REACT_APP_GRAPHQL_WS_ENDPOINT || 'ws://localhost:3000/api/graphql', // Adjust if different
//   connectionParams: () => { // Optional: for sending auth token with WebSocket connection
//     const token = localStorage.getItem('authToken');
//     return { Authorization: `Bearer ${token}` };
//   },
// })) : null;


// const splitLink = wsLink ? split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
//   },
//   wsLink,
//   authLink.concat(httpLink),
// ) : authLink.concat(httpLink);

// const client = new ApolloClient({
//   link: splitLink,
//   cache: new InMemoryCache(),
// });

// export default client;
```

**2. Rendering Keystone Document Field (Conceptual):**
```javascript
// src/components/KeystoneDocumentRenderer.js (Conceptual)
// import { DocumentRenderer } from '@keystone-6/document-renderer';

// // Define renderers for your custom component blocks
// const componentBlockRenderers = {
//   imageBlock: (props) => {
//     const { image, altText, caption } = props.fields;
//     if (!image?.data?.publicUrl) return null;
//     return (
//       <div>
//         <img src={image.data.publicUrl} alt={altText?.value || ''} />
//         {caption?.value && <p>{caption.value}</p>}
//       </div>
//     );
//   },
//   callToActionBlock: (props) => {
//     const { heading, text, buttonText, buttonLink } = props.fields;
//     return (
//       <div>
//         <h3>{heading?.value}</h3>
//         {text?.value && <p>{text.value}</p>}
//         {buttonText?.value && buttonLink?.value && (
//           <a href={buttonLink.value}><button>{buttonText.value}</button></a>
//         )}
//       </div>
//     );
//   },
//   // ... other custom block renderers
// };

// export const MyDocumentRenderer = ({ document }) => {
//   if (!document) return null;
//   return <DocumentRenderer document={document} componentBlocks={componentBlockRenderers} />;
// };
```

**3. Notification Subscription Component (Conceptual):**
```javascript
// src/components/NotificationToast.js (Conceptual)
// import { gql, useSubscription } from '@apollo/client';

// const NOTIFICATION_SUBSCRIPTION = gql`
//   subscription OnNotificationCreated {
//     notification_created {
//       id
//       category
//       senderUsername
//       // ... other fields needed for the toast
//     }
//   }
// `;

// function NotificationToast() {
//   const { data, loading, error } = useSubscription(NOTIFICATION_SUBSCRIPTION);

//   if (loading || error || !data?.notification_created) return null;

//   const { category, senderUsername } = data.notification_created;
//   // Display a toast/alert: e.g., `New ${category} from ${senderUsername}`
//   // This would integrate with a toast library or UI component.

//   return null; // Or a visible component that shows the toast
// }
```

## Key Considerations

*   **Schema Differences:** Carefully map old Graphene query/mutation names and structures to the new KeystoneJS ones.
*   **Authentication Flow:** Ensure login, logout, and session persistence work seamlessly with KeystoneJS.
*   **Error Handling:** Adapt frontend error handling for GraphQL errors from the new backend.
*   **Performance:** Test frontend performance after integration, especially for pages rendering complex document fields.
*   **Environment Variables:** The frontend will need environment variables for the new API endpoints (HTTP and WebSocket).

This migration will require a systematic review and update of most data-fetching and data-mutating parts of the React application.
