# Payload CMS Setup Guide

This SvelteKit website is designed to work with Payload CMS as a separate service. Follow these steps to set up Payload CMS.

## Option 1: Separate Payload CMS Project (Recommended)

1. Create a new Payload CMS project:
```bash
npx create-payload-app@latest jaco-line-cms
```

2. Configure the collections based on `payload.config.ts` reference

3. Set up environment variables:
```env
DATABASE_URI=mongodb://localhost:27017/jaco-line
PAYLOAD_SECRET=your-secret-key
PAYLOAD_URL=http://localhost:3000
```

4. Update API routes in `src/routes/api/*` to fetch from your Payload CMS instance:
```typescript
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3000';
const response = await fetch(`${PAYLOAD_URL}/api/events`);
```

## Option 2: Integrated Payload CMS (Advanced)

If you want to run Payload CMS within the SvelteKit project:

1. Install Payload CMS dependencies:
```bash
npm install payload @payloadcms/db-mongodb @payloadcms/richtext-slate
```

2. Create a Payload server entry point
3. Configure SvelteKit to handle Payload routes
4. Update the build process accordingly

## API Endpoints

Your Payload CMS should expose these endpoints:

- `GET /api/events` - List all events
- `GET /api/gallery` - List all gallery images
- `GET /api/workshops` - List all workshops
- `POST /api/workshop-subscriptions` - Create workshop subscription
- `POST /api/newsletter-subscribers` - Create newsletter subscription
- `POST /api/contact` - Handle contact form (optional, can use email service)

## Collection Structure

See `payload.config.ts` for detailed collection structure reference.


