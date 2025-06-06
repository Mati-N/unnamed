# Data Migration Strategy: Wagtail to KeystoneJS

This document outlines the strategy and provides conceptual examples for migrating content from a Wagtail CMS (PostgreSQL) to this KeystoneJS application.

## Prerequisites (for actual migration)

1.  **Finalized KeystoneJS Schema:** The KeystoneJS lists and fields (including component blocks for the `Page.content` document field) must be fully defined to match the structure of the Wagtail content being migrated.
2.  **Database Access:**
    *   Read access to the production or a staging copy of the Wagtail PostgreSQL database.
    *   Write access to the new KeystoneJS PostgreSQL database.
3.  **Node.js Environment:** A Node.js environment where the migration scripts can be run, with necessary packages (e.g., `pg` for PostgreSQL connection, potentially a CSV parser or other transformation tools if exporting/importing via intermediate files).
4.  **Understanding of Wagtail Internals:** Knowledge of how Wagtail stores Page types, StreamFields (often as JSON in the database), Snippets, Images, and Documents.

## General Migration Process

1.  **Analyze Wagtail Content:**
    *   Identify all Wagtail Page types to be migrated (e.g., `HomePage`, `ArticlePage`, `BlogIndexPage`).
    *   For each Page type, document its fields, including `StreamField` block types and their internal structure.
    *   Identify all Wagtail Snippets and their fields.
    *   Assess how images (`wagtailimages.Image`) and documents (`wagtaildocs.Document`) are used and if metadata needs to be preserved.
    *   Map users (`wagtailcore.User` or custom user model) if authorship needs to be preserved.

2.  **Map Wagtail Models to KeystoneJS Lists:**
    *   For each Wagtail Page type, decide if it maps to the generic Keystone `Page` list (differentiated by a 'type' field perhaps) or if specialized Keystone lists are needed.
    *   For each `StreamField` block type, ensure a corresponding `componentBlock` is defined in Keystone's `Page.content` document field.
    *   Map Wagtail Snippets to appropriate Keystone lists.
    *   Plan user migration or mapping.

3.  **Develop Migration Scripts (Node.js):**
    *   Scripts will connect to both databases.
    *   For each content type:
        *   **Extract:** Query data from Wagtail tables (e.g., `wagtailcore_page`, specific page type tables, `wagtailsnippets_snippet`). StreamField data is often JSON and will need parsing.
        *   **Transform:** Convert extracted Wagtail data into the format expected by KeystoneJS. This is the most complex step.
            *   Map field names and types.
            *   Transform Wagtail StreamField JSON into Keystone's document field structure (a JSON structure representing blocks and their content, conforming to Tiptap/ProseMirror underlying structure if using the default document field).
            *   Handle relationships (e.g., authors, linked images/documents, related pages). This might involve multiple passes or caching IDs.
            *   Migrate images/documents to Cloudinary first (if not already there) and get their Cloudinary URLs/IDs to store in Keystone. If they are already in a compatible cloud storage, map URLs.
        *   **Load:** Use KeystoneJS's programmatic API (or direct Prisma client if simpler for bulk inserts, though Keystone API respects hooks) to create items in the KeystoneJS database.

4.  **Testing and Validation:**
    *   Start with a small subset of content.
    *   Verify migrated content in the KeystoneJS Admin UI and via API queries.
    *   Check for broken links, missing images, formatting issues.
    *   Iterate on scripts until migration is accurate.

5.  **Execute Full Migration:**
    *   Backup both databases before starting.
    *   Run scripts, monitor for errors.

## Conceptual Script Example (Pseudo-code for migrating an ArticlePage)

This is a simplified Node.js pseudo-script.

```javascript
// migration-script.js (Conceptual)
// const { PrismaClient: WagtailPrismaClient } = require('@prisma/client/wagtail'); // Hypothetical Prisma client for Wagtail DB
// const { PrismaClient: KeystonePrismaClient } = require('@prisma/client'); // Keystone's Prisma client
// const { convertStreamFieldToKeystoneDocument } = require('./streamfield-transformer'); // Helper function

// const wagtailDb = new WagtailPrismaClient({ datasources: { db: { url: 'WAGTAIL_DB_URL' } } });
// const keystoneDb = new KeystonePrismaClient({ datasources: { db: { url: 'KEYSTONE_DB_URL' } } });

async function migrateArticlePages() {
  // 1. Fetch ArticlePage data from Wagtail (simplified query)
  //    This assumes ArticlePage inherits from wagtailcore_page and has its own table.
  //    Actual queries would involve joining wagtailcore_page with the specific page type table.
  // const wagtailArticles = await wagtailDb.articlePageTable.findMany({
  //   include: { page_ptr: true, author: true /* ... other related fields ... */ }
  // });

  // for (const wagtailArticle of wagtailArticles) {
  //   console.log(`Migrating: ${wagtailArticle.page_ptr.title}`);

  //   // 2. Transform StreamField content (body)
  //   //    StreamField data is typically JSON. This function would parse it.
  //   // const keystoneContent = convertStreamFieldToKeystoneDocument(wagtailArticle.bodyStreamFieldJson);

  //   // 3. Map Author (example)
  //   // let keystoneAuthorId = null;
  //   // if (wagtailArticle.author) {
  //   //   const keystoneUser = await keystoneDb.user.findUnique({ where: { email: wagtailArticle.author.email } });
  //   //   if (keystoneUser) keystoneAuthorId = keystoneUser.id;
  //   //   // Else, handle missing users: create them, or assign to a default.
  //   // }

  //   // 4. Prepare data for Keystone Page list
  //   const keystonePageData = {
  //     title: wagtailArticle.page_ptr.title,
  //     slug: wagtailArticle.page_ptr.slug,
  //     content: keystoneContent, // Transformed document structure
  //     // authorId: keystoneAuthorId ? { connect: { id: keystoneAuthorId } } : undefined,
  //     publishedAt: wagtailArticle.page_ptr.first_published_at, // Or another date field
  //     // ... other common fields like metaTitle, metaDescription if they exist
  //     // You might add a 'wagtailPageId' field in Keystone for tracking originals
  //   };

  //   // 5. Load into Keystone (using Prisma client directly for simplicity here)
  //   try {
  //     // await keystoneDb.page.create({ data: keystonePageData });
  //     console.log(`Successfully migrated: ${keystonePageData.title}`);
  //   } catch (e) {
  //     console.error(`Error migrating ${keystonePageData.title}: `, e);
  //   }
  // }
}

// Example StreamField Transformer (Conceptual)
// function convertStreamFieldToKeystoneDocument(streamFieldJson) {
//   const streamData = JSON.parse(streamFieldJson);
//   const keystoneNodes = [];
//   for (const block of streamData) {
//     if (block.type === 'rich_text') {
//       // Convert Wagtail rich text HTML (or Draftail JSON) to Keystone document JSON
//       // This is non-trivial and requires careful mapping of features.
//       // keystoneNodes.push({ type: 'paragraph', children: [{ text: 'Converted HTML...' }] });
//     } else if (block.type === 'image_block') {
//       // Assuming 'image_block' in Wagtail has an image ID
//       // const wagtailImageId = block.value.image;
//       // const cloudinaryUrl = await getCloudinaryUrlForWagtailImage(wagtailImageId); // Helper
//       // keystoneNodes.push({
//       //   type: 'component-block',
//       //   component: 'imageBlock', // Matches Keystone componentBlock name
//       //   props: { image: { /* Cloudinary data */ publicUrl: cloudinaryUrl }, altText: block.value.alt_text },
//       //   children: [{ text: '' }] // Component blocks need a children array with an empty text node
//       // });
//     } // ... other block types ...
//   }
//   return { type: 'doc', children: keystoneNodes }; // Basic document structure
// }


// async function main() {
//   await migrateArticlePages();
//   // ... migrate other page types ...
//   // ... migrate snippets ...
// }

// main().catch(e => console.error(e)).finally(async () => {
//   await wagtailDb.$disconnect();
//   await keystoneDb.$disconnect();
// });
```

## Handling Specific Wagtail Features

*   **StreamFields:** As shown above, this is the most complex part. Each Wagtail block type needs a corresponding Keystone `componentBlock` and a transformation function.
*   **Images/Documents:** Migrate to Cloudinary (or chosen storage) and link. Preserve metadata if possible.
*   **Snippets:** Treat as regular content types. Migrate their data to corresponding Keystone lists.
*   **Forms (wagtail.contrib.forms):** Wagtail forms are complex. Options:
    1.  Rebuild forms using a Node.js/React form solution on the frontend.
    2.  Use a third-party form service.
    3.  If simple, create a "Form" list in Keystone and a "FormSubmission" list.
*   **Redirects (wagtail.contrib.redirects):** Create a "Redirect" list in Keystone and migrate redirect rules. Implement redirect logic in the Node.js application or at the frontend/CDN level.
*   **Internal Links (PageChooserBlock, etc.):** These need careful handling. Store as relationships in Keystone if possible, or transform links to use new URL structures.

This migration is a significant sub-project requiring careful planning and execution.

## Step 11: Execute and Verify Content Migration (Conceptual)

This step involves running the developed migration scripts and thoroughly verifying the migrated content in the new KeystoneJS system. It's typically an iterative process.

### Execution

1.  **Environment Setup:**
    *   Ensure the KeystoneJS application is running and connected to its target database.
    *   Ensure the migration scripts have access to both the source (Wagtail) and target (KeystoneJS) databases.
    *   **CRITICAL:** Always run initial migrations on staging or development environments, NEVER directly on a live production Wagtail database without extensive testing and backups.

2.  **Dry Runs (If Supported by Scripts):**
    *   If scripts are designed with a dry-run mode, execute this first to identify potential issues without making database changes (e.g., logging transformed data).

3.  **Incremental Migration:**
    *   Start by migrating a small subset of content (e.g., a few pages of each type, a selection of snippets).
    *   This allows for faster iteration and debugging of the migration scripts.

4.  **Full Migration Run:**
    *   Once confident with subsets, perform a full migration run, carefully monitoring logs for errors.

### Verification Checklist

After each migration run (subset or full), verify the following:

1.  **Data Completeness:**
    *   **Counts:** Compare the number of migrated items (pages, snippets, users, etc.) in KeystoneJS against the source Wagtail counts.
    *   **All Content Types:** Ensure all intended Wagtail page types and snippets have corresponding entries in KeystoneJS.

2.  **Field Data Integrity:**
    *   **Basic Fields:** Check common fields (titles, slugs, dates, text content) for accuracy and correct mapping.
    *   **Special Characters/Encoding:** Ensure text is rendered correctly.
    *   **StreamField / Document Field Content:** This is critical.
        *   Verify that all Wagtail StreamField blocks have been transformed into their corresponding Keystone `componentBlocks` within the `document` field.
        *   Check formatting (headings, lists, bold/italic, links) within rich text blocks.
        *   Ensure images within image blocks render correctly and have correct alt text/captions.
        *   Verify functionality and content of custom component blocks (e.g., CTAs, quotes).
    *   **SEO Fields:** Meta titles, descriptions, etc., should be correctly migrated.

3.  **Relationships and Links:**
    *   **Authorship:** Verify that pages/posts are correctly linked to their authors in KeystoneJS.
    *   **Internal Links:** Check that links between migrated pages (e.g., in rich text or custom link fields) point to the correct new URLs or Keystone entries.
    *   **Image/Document Links:** Ensure all images and documents are correctly referenced and rendering/accessible (e.g., Cloudinary URLs are correct).
    *   **Related Content (e.g., Wagtail's `PageChooserBlock`, `SnippetChooserBlock`):** Verify these relationships are re-established in Keystone.

4.  **User Accounts (if migrated):**
    *   Verify user data (usernames, emails).
    *   Test login for migrated users (password migration strategy needs careful handling - often users need to reset passwords post-migration unless hashes are compatible and salts are migrated, which is complex and security-sensitive).

5.  **Admin UI Experience:**
    *   Navigate the KeystoneJS Admin UI.
    *   Open migrated pages and items for editing.
    *   Ensure content is structured correctly and editable in the new system.
    *   Check that component blocks in the document field are usable.

6.  **Frontend Rendering (if a basic frontend is available for testing):**
    *   Query migrated content via the KeystoneJS GraphQL API.
    *   If possible, render some migrated pages on a test frontend to catch issues not apparent in the Admin UI or raw API data.

### Iteration

*   If discrepancies or errors are found, update the migration scripts.
*   Depending on the nature of the issues, you might need to:
    *   Clear previously migrated content from KeystoneJS (for the specific subset or all).
    *   Re-run the migration scripts.
*   Repeat the verification process until the content is migrated accurately and completely.

This verification step is crucial for a successful CMS transition. Allocate sufficient time for thorough testing and iteration.
