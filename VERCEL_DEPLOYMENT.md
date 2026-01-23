# Deploying to Vercel with Sanity CMS

This guide will help you deploy your SvelteKit + Sanity CMS application to Vercel.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- Sanity account (free tier available at https://sanity.io)
- GitHub account (for connecting to Vercel)

## Step 1: Set Up Sanity Project

1. **Create Sanity Account**
   - Go to https://www.sanity.io
   - Sign up for free
   - Create a new project

2. **Get Your Project Credentials**
   - Go to your Sanity project settings
   - Note your **Project ID**
   - Note your **Dataset** name (usually "production")
   - Create an API token:
     - Go to API → Tokens
     - Click "Add API token"
     - Name it (e.g., "Vercel Production")
     - Set permissions to "Editor" (for write operations)
     - Copy the token (you won't see it again!)

3. **Set Up Schemas**
   - Add the schemas from `src/lib/sanity.schema.ts` to your Sanity Studio
   - Or use Sanity's cloud studio at https://your-project-id.sanity.studio
   - See [SANITY_SETUP.md](./SANITY_SETUP.md) for detailed schema setup

## Step 2: Prepare Your Code

The project is already configured for Vercel:
- ✅ `@sveltejs/adapter-vercel` installed
- ✅ `vercel.json` configuration file created
- ✅ Serverless functions configured

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **SvelteKit** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `pnpm run build` (auto-detected)
   - Output Directory: (leave empty, auto-detected)
   - Install Command: `pnpm install` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   SANITY_PROJECT_ID=your-project-id-here
   ```
   (Your Sanity project ID from Step 1)
   
   ```
   SANITY_DATASET=production
   ```
   (Usually "production" or "development")
   
   ```
   PUBLIC_SANITY_PROJECT_ID=your-project-id-here
   PUBLIC_SANITY_DATASET=production
   PUBLIC_SANITY_STUDIO_URL=https://your-project-id.sanity.studio
   SANITY_API_TOKEN=your-api-token-here
   ```
   (All Sanity environment variables - note the PUBLIC_ prefixes for client-side variables)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Copy your deployment URL

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   pnpm add -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts:
   - Link to existing project? No
   - Project name: jaco-line (or your choice)
   - Directory: ./
   - Override settings? No

4. **Add Environment Variables**
   ```bash
   vercel env add PUBLIC_SANITY_PROJECT_ID
   # Paste your Sanity project ID
   
   vercel env add PUBLIC_SANITY_DATASET
   # Enter: production
   
   vercel env add PUBLIC_SANITY_STUDIO_URL
   # Enter: https://your-project-id.sanity.studio
   
   vercel env add SANITY_API_TOKEN
   # Paste your Sanity API token (Editor permissions)
   ```

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

## Step 4: Access Sanity Studio

1. Visit your Sanity Studio: `https://your-project-id.sanity.studio`
2. Log in with your Sanity account
3. Start adding content (events, gallery images, workshops)!
4. Your content will automatically appear on your Vercel-deployed website

## Step 5: Set Up Custom Domain (Optional)

1. Go to your Vercel project → Settings → Domains
2. Add your domain (e.g., `jaco-line.nl`)
3. Follow DNS configuration instructions
4. Your site will be available at your custom domain

## Environment Variables Summary

Required environment variables in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID | `abc123xyz` |
| `PUBLIC_SANITY_DATASET` | Your Sanity dataset name | `production` |
| `PUBLIC_SANITY_STUDIO_URL` | Your Sanity Studio URL | `https://abc123xyz.sanity.studio` |
| `SANITY_API_TOKEN` | Your Sanity API token (Editor permissions) | `sk...` (long token string) |

## Troubleshooting

### "Cannot connect to Sanity"
- Verify `PUBLIC_SANITY_PROJECT_ID` is correct in Vercel environment variables
- Check that `PUBLIC_SANITY_DATASET` matches your dataset name
- Verify `SANITY_API_TOKEN` is set and has Editor permissions (not just Viewer)
- Check Vercel function logs for detailed error messages

### "API routes returning empty arrays"
- Ensure you've added content in Sanity Studio
- Check that content is published (not just saved as drafts)
- Verify your GROQ queries in the API routes
- Check that schemas are properly set up in Sanity

### "Write operations failing"
- Check that `SANITY_API_TOKEN` is set
- Verify the token has Editor permissions (not just Viewer)
- Ensure the token hasn't expired

### Build Fails
- Check Vercel build logs
- Ensure `pnpm` is used (Vercel auto-detects this)
- Verify all dependencies are in `package.json`
- Make sure Sanity environment variables are set

### Function Timeout
- Vercel serverless functions have timeout limits
- Free tier: 10 seconds
- Pro tier: 60 seconds
- If Sanity queries are slow, consider optimizing GROQ queries or using CDN

## Vercel Limits

- **Free Tier:**
  - 100GB bandwidth/month
  - Serverless function execution: 100 hours/month
  - Function timeout: 10 seconds
  
- **Pro Tier ($20/month):**
  - Unlimited bandwidth
  - Serverless function execution: 1000 hours/month
  - Function timeout: 60 seconds
  - Better performance

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Set up environment variables
3. ✅ Access Sanity Studio
4. ✅ Add content (events, gallery images, workshops)
5. ✅ Test the website
6. ✅ Set up custom domain (optional)

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME
```

Your site is now live on Vercel! 🎉
