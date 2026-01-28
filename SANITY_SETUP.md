# Sanity CMS Setup Guide

Sanity CMS is now integrated into this SvelteKit project. Follow these steps to complete the setup.

## Prerequisites

- Node.js 18+
- A Sanity account (free tier available at https://sanity.io)

## Setup Steps

### 1. Create a Sanity Project

1. Go to https://www.sanity.io and sign up for a free account
2. Create a new project (or use an existing one)
3. Note your **Project ID** and **Dataset** name (usually "production")

### 2. Create Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
# Public (accessible in browser)
PUBLIC_SANITY_PROJECT_ID=your-project-id-here
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_STUDIO_URL=https://your-project-id.sanity.studio

# Private (server-only)
SANITY_API_TOKEN=your-api-token-here
```

**Important:**
- `PUBLIC_SANITY_PROJECT_ID`: Found in your Sanity project settings (must have `PUBLIC_` prefix)
- `PUBLIC_SANITY_DATASET`: Usually "production" (or "development" for testing) (must have `PUBLIC_` prefix)
- `PUBLIC_SANITY_STUDIO_URL`: Your Sanity Studio URL (must have `PUBLIC_` prefix)
- `SANITY_API_TOKEN`: Create a token in Sanity Studio → API → Tokens with **Editor** permissions
  - This token is used to fetch draft content when preview mode is enabled AND for write operations (creating subscriptions)
  - Keep this token private (no `PUBLIC_` prefix)

### 3. Set Up Sanity Studio (Optional but Recommended)

Sanity Studio is a separate admin interface for managing content. You can either:

**Option A: Embedded Studio (Recommended)**
- Run `npx sanity init` in your project root
- Follow the prompts to set up Sanity Studio
- Add the schemas from `src/lib/sanity.schema.ts` to your studio's `schemas` folder

**Option B: Standalone Studio**
- Create a separate directory: `mkdir sanity-studio && cd sanity-studio`
- Run `npx sanity init` there
- Link it to your project using the same Project ID

**Option C: Use Sanity's Cloud Studio**
- Access your content at https://your-project-id.sanity.studio
- No local setup needed, but you'll need to add schemas via the web interface

### 4. Add Schemas to Sanity Studio

Copy the schema definitions from `src/lib/sanity.schema.ts` and add them to your Sanity Studio:

- `event` - Market stand events
- `gallery` - Pottery images
- `workshop` - Workshop information
- `workshopSubscription` - Workshop registrations
- `newsletterSubscriber` - Newsletter signups

### 5. Install Dependencies

```bash
pnpm install
```

### 6. Start the Development Server

```bash
pnpm run dev
```

### 7. Access Sanity Studio

- **Cloud Studio**: https://your-project-id.sanity.studio
- **Local Studio** (if set up): Usually runs on `http://localhost:3333`

## Content Types

The following content types are configured:

- **Events** - Market stand events (`event`)
- **Gallery** - Pottery images (`gallery`)
- **Workshops** - Workshop information (`workshop`)
- **Workshop Subscriptions** - Workshop registrations (`workshopSubscription`)
- **Newsletter Subscribers** - Newsletter signups (`newsletterSubscriber`)

## API Endpoints

Your SvelteKit API routes automatically connect to Sanity:

- `GET /api/events` - List all events
- `GET /api/gallery` - List all gallery images
- `GET /api/workshops` - List all workshops
- `POST /api/workshops/subscribe` - Create workshop subscription
- `POST /api/newsletter/subscribe` - Create newsletter subscription
- `POST /api/contact` - Handle contact form

## Adding Content

1. Log into Sanity Studio (cloud or local)
2. Navigate to the content type you want to edit
3. Click "Create" to add new content
4. Fill in the fields and publish
5. Your content will automatically appear on the website!

## Image Handling

Sanity automatically handles image optimization. Images are stored in Sanity's CDN and can be accessed via the `urlFor` helper:

```typescript
import { urlFor } from '$lib/sanity.server';

// In your component
const imageUrl = urlFor(galleryItem.image).url();
```

## Production Deployment

For production:

1. Ensure your production Sanity dataset is set up
2. Update `SANITY_PROJECT_ID` and `SANITY_DATASET` in your production environment
3. Set `SANITY_API_TOKEN` with appropriate permissions
4. Build and deploy your SvelteKit app
5. Consider enabling CDN for faster image delivery (set `useCdn: true` in `sanity.server.ts`)

## Troubleshooting

**"Cannot connect to Sanity"**
- Verify your `SANITY_PROJECT_ID` is correct
- Check that `SANITY_DATASET` matches your dataset name
- Ensure your API token has the correct permissions

**"API routes returning empty arrays"**
- Ensure you've added content in Sanity Studio
- Check that content is published (not just saved as drafts)
- Verify your GROQ queries in the API routes

**"Write operations failing"**
- Check that `SANITY_API_TOKEN` is set
- Verify the token has Editor permissions (not just Viewer)
- Ensure the token hasn't expired
