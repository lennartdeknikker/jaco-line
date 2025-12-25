# Jaco Line - Pottery Website

A statically rendered SvelteKit website for Jaco Line pottery, integrated with Payload CMS.

## Features

- **Events**: Display market stand schedule at various events
- **Gallery**: Showcase pottery work with images
- **Workshops**: Information and registration for pottery workshops
- **Contact**: Contact form and information
- **Newsletter**: Subscription form for updates

## Tech Stack

- **SvelteKit** (latest version) - Framework
- **Payload CMS** - Content Management System
- **TypeScript** - Type safety
- **SCSS** - Styling with theme variables
- **ESLint** - Code linting
- **Stylelint** - CSS linting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js 18+
- Payload CMS instance (see [PAYLOAD_SETUP.md](./PAYLOAD_SETUP.md) for setup instructions)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `PAYLOAD_URL` - Your Payload CMS API URL (e.g., `http://localhost:3000`)

3. Connect to Payload CMS:
   - Update load functions in `src/routes/*/+page.ts` to fetch from your Payload CMS instance
   - See comments in the load functions for integration examples

4. Start the development server:
```bash
pnpm run dev
```

The site will be available at `http://localhost:5173`

### Building for Production

```bash
pnpm run build
```

The static site will be generated in the `build` directory.

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

## Payload CMS Integration

Payload CMS should be set up as a separate service. See [PAYLOAD_SETUP.md](./PAYLOAD_SETUP.md) for detailed setup instructions.

### Collections Required

The CMS should include the following collections (see `payload.config.ts` for structure reference):

- **Events** - Market stand events
- **Gallery** - Pottery images  
- **Workshops** - Workshop information
- **Workshop Subscriptions** - Workshop registrations
- **Newsletter Subscribers** - Newsletter signups
- **Users** - CMS admin users
- **Media** - File uploads

### Connecting to Payload CMS

1. Set `PAYLOAD_URL` environment variable to your Payload CMS instance
2. Update load functions in `src/routes/*/+page.ts` to fetch from Payload CMS
3. Example: `fetch(\`${import.meta.env.PAYLOAD_URL}/api/events\`)`

## Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable components
│   └── types.ts        # TypeScript types
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

