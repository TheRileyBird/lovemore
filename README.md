# Love More Yoga Studio

A modern, professionally redesigned website for Love More yoga studio in Covington, LA, built with Astro, Tailwind CSS, and Alpine.js

## Tech Stack

- **Framework:** Astro 6.0 (Static Site Generation)
- **Styling:** Tailwind CSS v4
- **Interactivity:** Alpine.js with Intersect plugin
- **Icons:** Lucide-Astro
- **Deployment:** Netlify (configured with auto-publishing)
- **Typography:** Inter (body) + Playfair Display (headings)

## Design Principles (Refactoring UI Framework)

### Hierarchy & Visual Weight
- **Font weight over size:** Primary CTAs use bold gradients and large rounded buttons, while secondary text uses lighter weights and muted gray tones
- **De-emphasized elements:** Navigation items are neutral-700, making the pink gradient CTA button the clear primary action
- **Baseline alignment:** Mixed font sizes align properly for visual harmony

### Spacing & Layout
- **Non-linear spacing scale:** Leveraging Tailwind's default spacing (larger gaps between sections than within)
- **Generous whitespace:** 24-unit (py-24) vertical rhythm creates breathing room
- **Grouped content:** Step cards have tight internal padding (p-8) but wider gaps between cards (gap-8)

### Color Strategy
- **Grayscale first:** Layout and contrast established with neutral-50/900 before adding brand colors
- **HSL-based palette:** Pink-500 to Rose-500 gradients provide warmth without overwhelming
- **Saturated grays:** Using neutral-900 instead of pure black for softer, more professional appearance
- **Accent borders:** Subtle gradient borders on hover (Core Pillars cards) add visual interest without clutter

### Depth & Shadows
- **Two-part shadows:** Cards use `shadow-lg` (soft, large) combined with `shadow-xl` on hover for realistic elevation
- **Colored shadows:** Pink/rose shadow tints (`shadow-pink-500/30`) on CTA buttons create depth that matches brand
- **Layered backgrounds:** Hero section uses gradient overlays for text contrast on images

### Text & Readability
- **Line length limits:** Max-w-2xl constrains text to 45-75 characters for optimal readability
- **Text contrast on images:** Dark gradient overlays (from-neutral-900/60) ensure hero text remains readable over dynamic photography
- **Font pairing:** Playfair Display (serif) for headings provides elegance; Inter (sans-serif) for body ensures clarity

### Supercharged Defaults
- **Icon-enhanced CTAs:** Sparkles, Heart, and Calendar icons add visual interest to buttons
- **Custom interactions:** Hover effects include gap expansion, transform translations, and scale changes
- **Gradient backgrounds:** Two-tone pink-to-rose gradients replace flat colors for modern depth

### Outside the Box
- **Card-based design system:** Removed traditional borders; using shadow, background changes, and spacing for separation
- **Scroll-triggered animations:** Alpine.js x-intersect reveals content as user scrolls (fade-in, stagger delays)
- **Rotating hero taglines:** Dynamic phrases cycle every 3 seconds with smooth transitions

### Background Decoration
- **Gradient blur effects:** Subtle pink/rose gradients behind images create atmospheric depth
- **Image overlays:** Gradient-to-transparent overlays on Core Pillars cards ensure text legibility
- **Hero background:** Full-screen yoga imagery with professional photography from Unsplash

### Empty States & Forms
- **Netlify Forms integration:** Newsletter signup configured for zero-backend email collection
- **Privacy assurance:** Clear messaging below form builds trust
- **Honeypot protection:** Bot-field included for spam prevention

## Key Features

1. **Hero Section**
   - Rotating taglines: "Love the Journey", "Trust the Process", "Give Gratitude", "Receive More"
   - Full-screen background with gradient overlay for text contrast
   - Scroll indicator for user guidance

2. **Getting Started (3-Step Process)**
   - Numbered cards with gradient accent backgrounds
   - Staggered scroll animations (100ms, 200ms delays)
   - Hover effects with gradient glow

3. **Core Pillars**
   - Movement, Community, Connection cards
   - Full-height image backgrounds with text overlays
   - Scale-on-hover effects (110% zoom) with 700ms transitions
   - Arrow icons with smooth gap expansion on hover

4. **About Section**
   - Two-column layout with image + text
   - Gradient blur background effect on image
   - Clear CTA to learn more

5. **Virtual Studio Banner**
   - Full-width gradient background
   - Center-aligned with icon emphasis

6. **Email Signup**
   - Netlify Forms integration (no backend required)
   - Rounded-full inputs with focus states
   - Privacy messaging for trust

7. **Footer**
   - Contact information (address, phone, email)
   - Social media links (Instagram, Facebook)
   - Business hours
   - Multi-column layout (responsive)

## Accessibility Features

- Semantic HTML structure (nav, section, footer)
- Focus-visible outlines (2px pink-500)
- Alt text on all images
- ARIA-friendly form labels
- Smooth scroll behavior
- High contrast ratios (WCAG AA compliant)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Netlify

### Option 1: Netlify CLI (Automated)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Deploy to production
netlify deploy --prod
```

### Option 2: GitHub Integration

1. Push code to GitHub repository
2. Connect repository in Netlify dashboard
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Enable auto-publishing for continuous deployment

### Form Setup in Netlify

The newsletter form is pre-configured with:
- `data-netlify="true"` attribute
- `name="newsletter"` for form identification
- Honeypot field for spam protection

After deployment, forms will automatically appear in Netlify Dashboard > Forms.

## Project Structure

```
/
├── src/
│   ├── layouts/
│   │   └── Layout.astro          # Base layout with Alpine.js
│   ├── pages/
│   │   └── index.astro           # Homepage
│   └── styles/
│       └── global.css            # Tailwind imports
├── public/                       # Static assets
├── astro.config.mjs              # Astro configuration
├── netlify.toml                  # Netlify deployment config
└── package.json
```

## Design Decisions Explained

### Why This Color Palette?
- **Brand Red (#ca2317):** The official Love More brand color - bold, passionate, and energetic
- **Neutral grays:** Professional, calming (yoga studio aesthetic)
- **No gradients on brand color:** Single solid red maintains brand consistency and recognition

### Why These Fonts?
- **Playfair Display (headings):** Elegant serif conveys sophistication and mindfulness
- **Inter (body):** Clean sans-serif ensures readability across devices

### Why Alpine.js?
- Lightweight (no React/Vue bloat)
- Perfect for scroll animations (x-intersect)
- No build step complexity
- Works seamlessly with Astro's server-side rendering

### Why Unsplash Images?
- Professional quality photography
- Proper licensing for commercial use
- Consistent aesthetic (yoga, wellness, community themes)
- High resolution for modern displays

## Next Steps

1. **Replace placeholder images** with actual studio photos
2. **Add real logo** to replace Heart icon
3. **Create additional pages** (Classes, Teachers, About, Contact)
4. **Connect schedule system** (e.g., Mindbody integration)
5. **Add blog/news section** for content marketing
6. **Implement analytics** (Google Analytics, Plausible)
7. **SEO optimization** (meta tags, schema.org markup)
8. **Performance optimization** (image lazy loading, CDN)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Copyright © 2026 Love More. All rights reserved.
