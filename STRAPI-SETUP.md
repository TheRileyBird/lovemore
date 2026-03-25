# Strapi CMS Setup for Love More

## ✅ What's Complete

### 1. Strapi Installation
- **Location**: `/Users/joshuariley/Sites/lovemore-cms`
- **Admin URL**: http://localhost:1337/admin
- **API URL**: http://localhost:1337/api

### 2. Content Types Created
All content types include **drag-and-drop ordering** via the `order` field:

**Team Members** (`api::team-member.team-member`)
- name (string, required)
- title (string, required)
- image (media - images only)
- bio (rich text)
- active (boolean, default: true)
- order (integer, default: 100)

**Classes** (`api::class.class`)
- name (string, required)
- type (enum: heated, non-heated, specialty)
- image (media - images only)
- description (rich text)
- active (boolean, default: true)
- order (integer, default: 100)

**Retreats** (`api::retreat.retreat`)
- name (string, required)
- location (string, required)
- image (media - images only)
- highlights (JSON array)
- description (rich text)
- active (boolean, default: true)
- order (integer, default: 100)

### 3. Astro Integration
- **API Client**: `src/lib/strapi.ts`
- **Environment**: `.env` with `STRAPI_URL`
- **Type Support**: `src/env.d.ts`
- **Team Page**: Updated to fetch from Strapi

## 🚀 Quick Start

### Step 1: Create Admin User
1. Open http://localhost:1337/admin
2. Create your first admin account
3. This will activate the CMS

### Step 2: Add Content

#### Adding Team Members:
1. Go to "Team Members" in sidebar
2. Click "Create new entry"
3. Fill in:
   - Name (e.g., "JoEllen Luke")
   - Title (e.g., "Yoga Instructor")
   - Upload Image (instant preview!)
   - Bio (rich text editor)
   - Order (1, 2, 3... for sorting)
   - Active (checked)
4. Click "Save" then "Publish"
5. **Drag and drop** entries to reorder them!

#### Adding Classes:
1. Go to "Classes" in sidebar
2. Click "Create new entry"
3. Fill in:
   - Class Name (e.g., "Power Flow (Hot)")
   - Type (heated/non-heated/specialty)
   - Upload Image
   - Description
   - Order number
   - Active (checked)
4. Save and Publish

#### Adding Retreats:
1. Go to "Retreats" in sidebar
2. Click "Create new entry"
3. Fill in all fields
4. For highlights, add as JSON array:
   ```json
   ["Transportation", "Meals", "Yoga sessions", "etc"]
   ```
5. Save and Publish

### Step 3: Enable API Access
For Astro to fetch data from Strapi:

1. Go to **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Expand each content type:
   - Team-member: Check ☑ `find` and ☑ `findOne`
   - Class: Check ☑ `find` and ☑ `findOne`
   - Retreat: Check ☑ `find` and ☑ `findOne`
3. Click **Save**

### Step 4: Start Development
```bash
# Terminal 1: Start Strapi
cd /Users/joshuariley/Sites/lovemore-cms
npm run develop

# Terminal 2: Start Astro
cd /Users/joshuariley/Sites/lovemore
npm run dev
```

Visit http://localhost:4321/team to see your team members!

## 📋 Sample Data

### Team Members
```
1. JoEllen Luke - Yoga Instructor (Order: 1)
2. Mackenzie Halloran - Yoga Instructor (Order: 2)
```

### Classes
```
1. Power Flow (Hot) - heated (Order: 1)
2. Flow (Warm) - heated (Order: 2)
3. Functional Flow (Warm) - non-heated (Order: 3)
4. Bikram (Hot) - heated (Order: 4)
5. Yoga Sculpt (Warm) - specialty (Order: 5)
```

### Retreats
```
1. ROOTED: A Rainforest Experience - Costa Rica (Order: 1)
2. EmpowerU Women's Wellness Retreat - Sedona, AZ (Order: 2)
```

## 🎨 Key Features You'll Love

### 1. Drag-and-Drop Reordering
- In the Strapi admin, just drag entries to reorder
- The `order` field updates automatically
- No more manual number management!

### 2. Instant Image Preview
- Upload images and see them immediately
- No waiting for Git commits or deployments
- Built-in image optimization

### 3. Rich Text Editor
- WYSIWYG editor for bios and descriptions
- Markdown support
- Easy formatting without code

### 4. Better Content Management
- Intuitive UI (way better than Decap!)
- Draft/Publish workflow
- Version history
- Multi-user support

## 🔄 Migration from Decap CMS

Your old content is still in:
- `src/content/team/*.md` - Can be deleted after migration
- `public/admin/config.yml` - Decap config (can be removed)
- `src/pages/admin/index.astro` - Decap admin page (can be removed)

## 📝 Next Steps

1. **Create admin account** at http://localhost:1337/admin
2. **Add your content** using the sample data above as reference
3. **Enable API permissions** (Step 3 above)
4. **Test the team page** at http://localhost:4321/team
5. **Update other pages** (classes, retreats) to use Strapi

Need help? The Strapi admin interface is very intuitive - just click around and explore!
