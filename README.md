# Love More Yoga Studio

A modern, full-stack website for Love More yoga studio in Covington, LA. Built with Astro for the frontend and Strapi CMS for content management, deployed across multiple cloud services.

## Architecture Overview

This project uses a decoupled architecture with separate frontend and backend services:

```
┌─────────────────────────────────────────────────────────────┐
│                     Production Stack                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (Astro)              Backend (Strapi CMS)          │
│  ├─ Static site generation     ├─ Content management        │
│  ├─ Deployed on Netlify        ├─ Deployed on Render.com    │
│  ├─ Auto-deploy from GitHub    ├─ PostgreSQL database       │
│  └─ Fetches data at build      └─ RESTful API               │
│                                                               │
│  URL: lovemoremcc.com           URL: lovemore-cms.onrender.com│
└─────────────────────────────────────────────────────────────┘
```

## Services & Hosting

### Frontend: Netlify
- **Service**: Static site hosting with CDN
- **URL**: https://lovemoremcc.com (production) / https://lovemoreyoga.netlify.app (Netlify subdomain)
- **Deployment**: Auto-deploy from GitHub `master` branch
- **Build**: Runs `npm run build` on every push
- **Environment**: Node 22

### Backend: Render.com
- **Service**: Web service hosting (free tier)
- **URL**: https://lovemore-cms.onrender.com
- **Deployment**: Auto-deploy from GitHub repository
- **Database**: Managed PostgreSQL (also on Render.com)
- **Environment**: Node 22, Production mode

### CMS: Strapi
- **Version**: 5.40.0
- **Admin Panel**: https://lovemore-cms.onrender.com/admin
- **API Endpoint**: https://lovemore-cms.onrender.com/api
- **Features**: Drag-and-drop content ordering, rich text editing, media library

### Media Storage
- **Current**: Local file uploads stored on Render.com disk
- **Note**: Render.com free tier has ephemeral storage - uploads may be lost on restart
- **Recommended**: Configure Cloudinary for persistent media storage (see "Future Enhancements")

## Tech Stack

### Frontend (`/Users/joshuariley/Sites/lovemore`)
- **Framework**: Astro 6.0.4 (Static Site Generation)
- **Styling**: Tailwind CSS v4.2
- **Interactivity**: Alpine.js 3.15 with Intersect & Collapse plugins
- **Icons**: Lucide-Astro
- **Forms**: Netlify Forms (newsletter signup)
- **Typography**: Inter (body) + Playfair Display (headings)

### Backend (`/Users/joshuariley/Sites/lovemore-cms`)
- **CMS**: Strapi 5.40.0
- **Runtime**: Node.js 22+
- **Database**: PostgreSQL (production) / SQLite (development)
- **Languages**: TypeScript 5.x, React 18 (admin panel)

## Repository Structure

This project spans two separate repositories:

```
lovemore/                          # Frontend repository
├── src/
│   ├── pages/                     # Astro pages (team.astro, etc.)
│   ├── components/                # Reusable UI components
│   ├── layouts/                   # Page layouts
│   ├── lib/                       # Utilities (strapi.ts API client)
│   └── styles/                    # Global CSS
├── public/                        # Static assets
├── .env                           # Environment variables (STRAPI_URL)
├── astro.config.mjs              # Astro configuration
├── netlify.toml                  # Netlify deployment config
└── package.json

lovemore-cms/                      # Backend repository (separate)
├── src/
│   ├── api/                       # Content type APIs
│   │   ├── class/                 # Yoga class content type
│   │   ├── retreat/               # Retreat content type
│   │   ├── team-member/           # Team member profiles
│   │   └── team-page/             # Team page with member ordering
│   └── index.ts                   # Strapi entry point
├── config/
│   ├── database.ts                # DB configuration (Postgres/SQLite)
│   ├── plugins.ts                 # Plugin settings
│   └── server.ts                  # Server settings
├── types/
│   └── generated/                 # Auto-generated TypeScript types
├── .env                           # Secrets and database config
├── render.yaml                    # Render.com deployment config
└── package.json
```

## Content Types (Strapi)

### 1. Team Member (Collection Type)
**API**: `/api/team-members`

Fields:
- `name` (string, required): Full name
- `title` (string, required): Role/certification (e.g., "RYT-500")
- `image` (media): Profile photo
- `bio` (richtext): Biography markdown
- `active` (boolean): Display on website
- `team_pages` (relation): Many-to-many with Team Page

### 2. Team Page (Single Type)
**API**: `/api/team-page`

Fields:
- `team_members` (relation): Ordered list with drag-and-drop interface

Purpose: Defines the order of team members on the website. Admins can drag team members to reorder them in the CMS.

### 3. Class (Collection Type)
**API**: `/api/classes`

Fields:
- Class types (yoga styles, heated classes, specialty classes)
- Duration, difficulty, description

### 4. Retreat (Collection Type)
**API**: `/api/retreats`

Fields:
- Retreat details, dates, locations

## Environment Variables

### Frontend (`.env` in `lovemore/`)
```bash
STRAPI_URL=https://lovemore-cms.onrender.com
```

### Backend (`.env` in `lovemore-cms/`)
```bash
# Server
HOST=0.0.0.0
PORT=1337

# Secrets (generated by Strapi)
APP_KEYS=<generated-keys>
API_TOKEN_SALT=<generated-salt>
ADMIN_JWT_SECRET=<generated-secret>
TRANSFER_TOKEN_SALT=<generated-salt>
ENCRYPTION_KEY=<generated-key>
JWT_SECRET=<generated-secret>

# Database (Development - SQLite)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Database (Production - PostgreSQL on Render.com)
DATABASE_CLIENT=postgres
DATABASE_URL=<render-postgres-connection-string>
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

### Netlify Environment Variables
Set in Netlify Dashboard > Site Settings > Environment Variables:
```
STRAPI_URL=https://lovemore-cms.onrender.com
```

## Development Workflow

### Frontend Development

```bash
cd /Users/joshuariley/Sites/lovemore

# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend (CMS) Development

```bash
cd /Users/joshuariley/Sites/lovemore-cms

# Install dependencies
npm install

# Start Strapi in development mode (http://localhost:1337/admin)
npm run dev

# Build admin panel
npm run build

# Start production server
npm run start
```

## Deployment Process

### Deploying Frontend Changes

1. Make changes to Astro pages/components
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update team page"
   git push origin master
   ```
3. Netlify automatically builds and deploys
4. Check build logs: https://app.netlify.com

### Deploying CMS Changes

1. Make changes to Strapi content types or configuration
2. Commit and push to GitHub:
   ```bash
   cd /Users/joshuariley/Sites/lovemore-cms
   git add .
   git commit -m "Add new content type"
   git push origin master
   ```
3. Render.com automatically rebuilds and redeploys
4. Check deploy logs: https://dashboard.render.com

### Content Updates (No Deployment Needed)

When editors update content in Strapi CMS:
1. Changes are saved directly to the PostgreSQL database
2. Frontend fetches fresh content on next build
3. To trigger a frontend rebuild: push a commit or manually trigger in Netlify

## API Integration

### Fetching Content from Strapi

The frontend uses a custom API client (`src/lib/strapi.ts`):

```typescript
import { fetchAPI, getStrapiMedia } from '../lib/strapi';

// Fetch team page with populated relations
const teamPageResponse = await fetchAPI<any>({
  endpoint: 'team-page',
  query: {
    'populate[team_members][populate][0]': 'image'
  },
  wrappedByKey: 'data'
});

// Get team members in CMS-defined order
const teamMembers = teamPageResponse?.team_members?.map((member: any) => ({
  name: member.name,
  title: member.title,
  image: getStrapiMedia(member.image?.url),
  bio: member.bio
}));
```

### Strapi API Permissions

Public (unauthenticated) access is enabled for:
- `team-page`: find, findOne
- `team-members`: find, findOne
- `classes`: find, findOne
- `retreats`: find, findOne

Configure in Strapi: Settings > Users & Permissions > Roles > Public

## Key Features

### 1. Drag-and-Drop Team Ordering
- Admins can reorder team members in Strapi using drag handles
- Order is preserved in the `Team Page` single type
- Frontend displays members in the exact order set in CMS

### 2. Static Site Generation with Dynamic Content
- Astro pre-renders all pages at build time
- Fetches latest content from Strapi during build
- Results in fast, CDN-cached static HTML

### 3. Scroll Animations
- Alpine.js `x-intersect` directive reveals content on scroll
- Staggered fade-in effects for visual polish
- No JavaScript frameworks needed

### 4. Netlify Forms
- Newsletter signup form with built-in spam protection
- Honeypot field for bot detection
- Form submissions appear in Netlify dashboard

### 5. Security Headers
- CSP, X-Frame-Options, HSTS configured in `netlify.toml`
- Asset caching (1 year) for CSS/JS/images
- HTTPS enforced across all services

## Common Tasks

### Adding a New Team Member

1. Go to Strapi admin: https://lovemore-cms.onrender.com/admin
2. Navigate to Content Manager > Team Members
3. Click "Create new entry"
4. Fill in name, title, upload image, write bio
5. Save and Publish
6. Go to Content Manager > Team Page (single type)
7. Add the new member to the ordered list
8. Save and Publish
9. Trigger Netlify rebuild (or wait for next deploy)

### Changing Team Member Order

1. Go to Strapi admin > Content Manager > Team Page
2. Drag team members to reorder using drag handles
3. Save and Publish
4. Trigger Netlify rebuild

### Updating Content Without Code Changes

Changes to team members, classes, or retreats in Strapi require a frontend rebuild to appear on the website. Options:

**Manual**: Push an empty commit to trigger build
```bash
git commit --allow-empty -m "Trigger rebuild for content update"
git push origin master
```

**Automatic**: Set up a webhook from Strapi to Netlify (Future Enhancement)

## Database Management

### Development (SQLite)
- Located at `lovemore-cms/.tmp/data.db`
- Easy to reset: delete the file and restart Strapi
- Not suitable for production (file-based, no backups)

### Production (PostgreSQL on Render.com)
- Managed database with automatic backups
- Connection string stored in Render.com environment variables
- Access via Render.com dashboard or `psql` CLI

### Accessing Production Database
```bash
# Get connection string from Render.com dashboard
# Then connect via psql:
psql <DATABASE_URL>
```

## Troubleshooting

### Frontend Not Showing Updated Content
1. Check if content is published in Strapi (not just saved as draft)
2. Verify API permissions are set to Public
3. Trigger a new Netlify build
4. Check browser console for API errors

### Images Not Displaying (404 Errors)
- **Cause**: Render.com free tier has ephemeral storage
- **Solution**: Configure Cloudinary for persistent media (see below)
- **Workaround**: Re-upload images after Render.com restarts

### Strapi Admin Panel Not Loading
- Check Render.com service status
- Verify PostgreSQL database is running
- Check deploy logs for build errors

### Build Failures on Netlify
- **Error**: "Failed to fetch team-page"
  - Verify `STRAPI_URL` environment variable is set in Netlify
  - Check if Strapi API is accessible and content is published
- **Error**: "Connection refused to localhost:1337"
  - `.env` file not committed (correct) but Netlify env vars not set

## Future Enhancements

### 1. Cloudinary Integration for Media Storage
Render.com free tier uses ephemeral disk storage, meaning uploaded images are lost when the service restarts. To fix this:

**Install Cloudinary Plugin:**
```bash
cd lovemore-cms
npm install @strapi/provider-upload-cloudinary
```

**Configure in `config/plugins.ts`:**
```typescript
export default {
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
      },
    },
  },
};
```

**Add to Render.com Environment Variables:**
- `CLOUDINARY_NAME`
- `CLOUDINARY_KEY`
- `CLOUDINARY_SECRET`

### 2. Automatic Content Sync
Set up webhooks so content updates in Strapi trigger automatic Netlify rebuilds:

1. In Netlify: Settings > Build & Deploy > Build Hooks > Add build hook
2. Copy the webhook URL
3. In Strapi: Settings > Webhooks > Create webhook
4. Paste Netlify URL and select trigger events (Entry create/update/delete)

### 3. Incremental Static Regeneration
Upgrade to Astro's SSR mode with on-demand rendering to show content updates without full rebuilds.

### 4. Image Optimization
Use Astro's built-in `<Image>` component with automatic responsive images and lazy loading.

### 5. Multi-Environment Setup
Create separate Strapi environments:
- `lovemore-cms-staging.onrender.com` (for testing)
- `lovemore-cms.onrender.com` (production)

## Design System

This project follows [Refactoring UI](https://www.refactoringui.com/) principles:

- **Hierarchy**: Font weight over size for emphasis
- **Spacing**: Non-linear scale (Tailwind's default)
- **Colors**: Grayscale-first with brand red (#ca2317) accents
- **Depth**: Two-part shadows with subtle colored tints
- **Typography**: Playfair Display (headings) + Inter (body)
- **Interactions**: Smooth hover states with transform/scale

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Resources

- **Astro Docs**: https://docs.astro.build
- **Strapi Docs**: https://docs.strapi.io
- **Netlify Docs**: https://docs.netlify.com
- **Render.com Docs**: https://render.com/docs

## License

Copyright © 2026 Love More. All rights reserved.
