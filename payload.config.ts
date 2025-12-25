// Payload CMS Configuration Reference
// Note: Payload CMS should be set up as a separate service
// This file documents the collection structure needed for the CMS
//
// To set up Payload CMS:
// 1. Create a separate Payload CMS project (see PAYLOAD_SETUP.md)
// 2. Use the collection structure below as a reference
// 3. Update API routes in src/routes/api/* to fetch from your Payload CMS instance

/**
 * Collection Structure Reference:
 *
 * Collections needed:
 *
 * 1. Events
 *    - title (text, required)
 *    - description (textarea)
 *    - date (date, required)
 *    - location (text, required)
 *
 * 2. Gallery
 *    - alt (text)
 *    - image (upload, relationTo: media, required)
 *
 * 3. Workshops
 *    - title (text, required)
 *    - description (textarea)
 *    - date (date, required)
 *    - time (text)
 *    - location (text, required)
 *    - price (number)
 *    - maxParticipants (number)
 *
 * 4. Workshop Subscriptions
 *    - name (text, required)
 *    - email (email, required)
 *    - phone (text)
 *    - workshop (relationship, relationTo: workshops, required)
 *
 * 5. Newsletter Subscribers
 *    - name (text)
 *    - email (email, required, unique)
 *
 * 6. Users (for CMS admin)
 *    - name (text)
 *    - email (email, required, unique)
 *    - password (password, required)
 *
 * 7. Media
 *    - alt (text)
 *    - file (upload)
 */

export {};
