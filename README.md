# Jaco Line - Pottery Website

A statically rendered SvelteKit website for Jaco Line pottery, integrated with Sanity CMS.

## Features

- **Events**: Display market stand schedule at various events
- **Gallery**: Showcase pottery work with images
- **Workshops**: Information and registration for pottery workshops
- **Contact**: Contact form and information
- **Newsletter**: Subscription form for updates

## Tech Stack

- **SvelteKit** (latest version) - Framework
- **Sanity CMS** - Content Management System
- **TypeScript** - Type safety
- **SCSS** - Styling with theme variables
- **ESLint** - Code linting
- **Stylelint** - CSS linting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js 18+
- A Sanity account (free tier available at https://sanity.io)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up Sanity project:
   - Go to https://www.sanity.io and create a free account
   - Create a new project (or use existing)
   - Note your Project ID and Dataset name

3. Set up environment variables:
```bash
# Create .env file in the app/ directory
cat > app/.env << EOF
PUBLIC_SANITY_PROJECT_ID=your-project-id-here
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_STUDIO_URL=https://your-project-id.sanity.studio
SANITY_API_TOKEN=your-api-token-here
EOF
```

Or manually create `app/.env` with:
- `PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID (must have PUBLIC_ prefix)
- `PUBLIC_SANITY_DATASET` - Usually "production" (or "development") (must have PUBLIC_ prefix)
- `PUBLIC_SANITY_STUDIO_URL` - Your Sanity Studio URL (must have PUBLIC_ prefix)
- `SANITY_API_TOKEN` - Create a token in Sanity Studio → API → Tokens with **Editor** permissions

4. Set up Sanity schemas:
   - See `src/lib/sanity.schema.ts` for schema definitions
   - Add these schemas to your Sanity Studio project
   - Or use Sanity's cloud studio at https://your-project-id.sanity.studio

5. Start the development server:
```bash
pnpm run dev
```

The site will be available at `http://localhost:5173`

6. Access Sanity Studio:
   - Cloud Studio: https://your-project-id.sanity.studio
   - Or set up local studio: `npx sanity init`
   - Start adding content!

### Building for Production

```bash
pnpm run build
```

### Deploying to Vercel

This project is configured for Vercel deployment. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables:
   - `PUBLIC_SANITY_PROJECT_ID` (your Sanity project ID)
   - `PUBLIC_SANITY_DATASET` (usually "production")
   - `PUBLIC_SANITY_STUDIO_URL` (your Sanity Studio URL)
   - `SANITY_API_TOKEN` (your Sanity API token with Editor permissions)
4. Deploy!

### Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run check` - Type check
- `pnpm run lint` - Run all linters
- `pnpm run format` - Format code with Prettier
- `pnpm run lint:fix` - Fix linting issues

## Theme Customization

Theme variables can be easily customized in `src/styles/_variables.scss`:

- **Colors**: Primary, secondary, accent colors
- **Typography**: Font family (Poppins), sizes, weights
- **Spacing**: Consistent spacing units
- **Breakpoints**: Responsive breakpoints

## Sanity CMS Integration

Sanity CMS is integrated into this SvelteKit project. See [SANITY_SETUP.md](./SANITY_SETUP.md) for detailed setup instructions.

### Content Types Available

The CMS includes the following content types (schemas defined in `src/lib/sanity.schema.ts`):

- **Events** - Market stand events (`event`)
- **Gallery** - Pottery images (`gallery`)
- **Workshops** - Workshop information (`workshop`)
- **Workshop Subscriptions** - Workshop registrations (`workshopSubscription`)
- **Newsletter Subscribers** - Newsletter signups (`newsletterSubscriber`)

### API Routes

All API routes are automatically connected to Sanity CMS:

- `GET /api/events` - List all events
- `GET /api/gallery` - List all gallery images
- `GET /api/workshops` - List all workshops
- `POST /api/workshops/subscribe` - Create workshop subscription
- `POST /api/newsletter/subscribe` - Create newsletter subscription
- `POST /api/contact` - Handle contact form

The frontend pages automatically fetch from these API routes.

## Project Structure

```
src/
├── lib/
│   ├── components/        # Reusable components
│   ├── sanity.server.ts   # Sanity client configuration
│   ├── sanity.schema.ts   # Sanity schema definitions
│   └── types.ts           # TypeScript types
├── routes/
│   ├── api/            # API endpoints
│   ├── evenementen/    # Events page
│   ├── galerij/        # Gallery page
│   ├── workshops/      # Workshops page
│   ├── contact/        # Contact page
│   └── newsletter/     # Newsletter page
└── styles/
    ├── _variables.scss # Theme variables
    └── global.scss     # Global styles
```

## License

Private project for Jaco Line.

