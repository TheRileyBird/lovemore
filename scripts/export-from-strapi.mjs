/**
 * One-time migration: pull all content from Strapi and generate local data files.
 * Downloads images to public/images/ and writes TypeScript data to src/data/.
 *
 * Run with: node scripts/export-from-strapi.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const STRAPI_URL = 'https://lovemore-cms.onrender.com';

// ── Utilities ─────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[®©™°]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getImageUrl(img, format = null) {
  if (!img) return null;
  if (typeof img === 'string') return img;
  if (format && img.formats?.[format]?.url) return img.formats[format].url;
  return img.url || null;
}

function escapeForTemplateLiteral(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

async function fetchAPI(endpoint, query = {}) {
  const url = new URL(`/api/${endpoint}`, STRAPI_URL);
  Object.entries(query).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`${endpoint}: HTTP ${res.status}`);
  return (await res.json()).data;
}

async function downloadImage(url, category, filename) {
  if (!url) return null;

  const dir = join(ROOT, 'public', 'images', category);
  ensureDir(dir);

  const pathExt = extname(new URL(url).pathname);
  const ext = pathExt && pathExt !== '.' ? pathExt : '.jpg';
  const destName = filename + ext;
  const dest = join(dir, destName);

  if (existsSync(dest)) {
    console.log(`  skip  /images/${category}/${destName}`);
  } else {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`  error ${url}: ${res.status}`);
      return url; // fall back to remote URL
    }
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    console.log(`  dl    /images/${category}/${destName}`);
  }

  return `/images/${category}/${destName}`;
}

// ── Team ─────────────────────────────────────────────────────────────────────

async function migrateTeam() {
  console.log('\n── Team Members');
  const members = await fetchAPI('team-members', { populate: '*', sort: 'sortOrder:asc' });

  const out = [];
  for (const m of members) {
    const imgPath = await downloadImage(getImageUrl(m.image, 'medium'), 'team', slugify(m.name));
    out.push({
      name: m.name,
      title: m.title,
      image: imgPath,
      bio: m.bio || '',
      socialLink: m.socialLink ? { label: m.socialLink.label, url: m.socialLink.url } : null,
    });
  }

  const lines = [
    'export interface TeamMember {',
    '  name: string;',
    '  title: string;',
    '  image: string | null;',
    '  bio: string;',
    '  socialLink: { label: string; url: string } | null;',
    '}',
    '',
    'export const team: TeamMember[] = [',
    ...out.map(m =>
      [
        '  {',
        `    name: ${JSON.stringify(m.name)},`,
        `    title: ${JSON.stringify(m.title)},`,
        `    image: ${m.image ? JSON.stringify(m.image) : 'null'},`,
        `    bio: \`${escapeForTemplateLiteral(m.bio)}\`,`,
        `    socialLink: ${m.socialLink ? JSON.stringify(m.socialLink) : 'null'},`,
        '  },',
      ].join('\n')
    ),
    '];',
  ];

  writeFileSync(join(ROOT, 'src', 'data', 'team.ts'), lines.join('\n') + '\n');
  console.log(`  → src/data/team.ts (${out.length} members)`);
}

// ── Classes ───────────────────────────────────────────────────────────────────

async function migrateClasses() {
  console.log('\n── Classes');
  const classes = await fetchAPI('classes', { populate: 'image', sort: 'sortOrder:asc' });

  const out = [];
  for (const c of classes) {
    const imgPath = await downloadImage(getImageUrl(c.image, 'medium'), 'classes', slugify(c.name));
    out.push({
      name: c.name,
      type: c.type,
      description: c.description || '',
      temperature: c.temperature || null,
      image: imgPath,
    });
  }

  const lines = [
    "export type ClassType = 'heated' | 'non-heated' | 'healing-room';",
    '',
    'export interface StudioClass {',
    '  name: string;',
    '  type: ClassType;',
    '  description: string;',
    '  temperature: string | null;',
    '  image: string | null;',
    '}',
    '',
    'export const classes: StudioClass[] = [',
    ...out.map(c =>
      [
        '  {',
        `    name: ${JSON.stringify(c.name)},`,
        `    type: ${JSON.stringify(c.type)},`,
        `    description: \`${escapeForTemplateLiteral(c.description)}\`,`,
        `    temperature: ${c.temperature ? JSON.stringify(c.temperature) : 'null'},`,
        `    image: ${c.image ? JSON.stringify(c.image) : 'null'},`,
        '  },',
      ].join('\n')
    ),
    '];',
  ];

  writeFileSync(join(ROOT, 'src', 'data', 'classes.ts'), lines.join('\n') + '\n');
  console.log(`  → src/data/classes.ts (${out.length} classes)`);
}

// ── Events ────────────────────────────────────────────────────────────────────

async function migrateEvents() {
  console.log('\n── Events');
  const events = await fetchAPI('events', {
    'filters[active][$eq]': true,
    populate: 'image',
    sort: 'date:asc',
  });

  const out = [];
  for (const e of events) {
    const imgPath = await downloadImage(getImageUrl(e.image), 'events', slugify(e.name));
    out.push({
      name: e.name,
      type: e.type,
      date: e.date,
      description: e.description || '',
      image: imgPath,
    });
  }

  const lines = [
    'export interface SpecialtyEvent {',
    '  name: string;',
    '  type: string;',
    '  date: string;',
    '  description: string;',
    '  image: string | null;',
    '}',
    '',
    'export const specialtyEvents: SpecialtyEvent[] = [',
    ...out.map(e =>
      [
        '  {',
        `    name: ${JSON.stringify(e.name)},`,
        `    type: ${JSON.stringify(e.type)},`,
        `    date: ${JSON.stringify(e.date)},`,
        `    description: \`${escapeForTemplateLiteral(e.description)}\`,`,
        `    image: ${e.image ? JSON.stringify(e.image) : 'null'},`,
        '  },',
      ].join('\n')
    ),
    '];',
  ];

  writeFileSync(join(ROOT, 'src', 'data', 'events.ts'), lines.join('\n') + '\n');
  console.log(`  → src/data/events.ts (${out.length} events)`);
}

// ── Retreats ──────────────────────────────────────────────────────────────────

async function migrateRetreats() {
  console.log('\n── Retreats');
  const retreats = await fetchAPI('retreats', { populate: '*', sort: 'startDate:asc' });

  const out = [];
  for (const r of retreats) {
    const flyerPath = await downloadImage(r.flyerImage?.url, 'retreats', `${r.slug}-flyer`);
    const headerPath = r.headerImage?.url
      ? await downloadImage(r.headerImage.url, 'retreats', `${r.slug}-header`)
      : flyerPath;

    const gallery = [];
    for (let i = 0; i < (r.gallery || []).length; i++) {
      const img = r.gallery[i];
      const gPath = await downloadImage(img.url, 'retreats', `${r.slug}-gallery-${i + 1}`);
      gallery.push({ url: gPath, alt: img.alternativeText || r.name });
    }

    out.push({
      name: r.name,
      subtitle: r.subtitle || null,
      slug: r.slug,
      location: r.location || null,
      startDate: r.startDate,
      endDate: r.endDate,
      flyerImage: flyerPath,
      headerImage: headerPath,
      body: r.body || '',
      gallery,
      ctaButtonLabel: r.ctaButtonLabel || null,
      ctaButtonUrl: r.ctaButtonUrl || null,
    });
  }

  const galleryToTS = (gallery) => {
    if (gallery.length === 0) return '[]';
    const items = gallery
      .map(g => `\n      { url: ${JSON.stringify(g.url)}, alt: ${JSON.stringify(g.alt)} },`)
      .join('');
    return `[${items}\n    ]`;
  };

  const lines = [
    'export interface RetreatGalleryImage {',
    '  url: string;',
    '  alt: string;',
    '}',
    '',
    'export interface Retreat {',
    '  name: string;',
    '  subtitle: string | null;',
    '  slug: string;',
    '  location: string | null;',
    '  startDate: string;',
    '  endDate: string;',
    '  flyerImage: string | null;',
    '  headerImage: string | null;',
    '  body: string;',
    '  gallery: RetreatGalleryImage[];',
    '  ctaButtonLabel: string | null;',
    '  ctaButtonUrl: string | null;',
    '}',
    '',
    'export const retreats: Retreat[] = [',
    ...out.map(r =>
      [
        '  {',
        `    name: ${JSON.stringify(r.name)},`,
        `    subtitle: ${r.subtitle ? JSON.stringify(r.subtitle) : 'null'},`,
        `    slug: ${JSON.stringify(r.slug)},`,
        `    location: ${r.location ? JSON.stringify(r.location) : 'null'},`,
        `    startDate: ${JSON.stringify(r.startDate)},`,
        `    endDate: ${JSON.stringify(r.endDate)},`,
        `    flyerImage: ${r.flyerImage ? JSON.stringify(r.flyerImage) : 'null'},`,
        `    headerImage: ${r.headerImage ? JSON.stringify(r.headerImage) : 'null'},`,
        `    body: \`${escapeForTemplateLiteral(r.body)}\`,`,
        `    gallery: ${galleryToTS(r.gallery)},`,
        `    ctaButtonLabel: ${r.ctaButtonLabel ? JSON.stringify(r.ctaButtonLabel) : 'null'},`,
        `    ctaButtonUrl: ${r.ctaButtonUrl ? JSON.stringify(r.ctaButtonUrl) : 'null'},`,
        '  },',
      ].join('\n')
    ),
    '];',
  ];

  writeFileSync(join(ROOT, 'src', 'data', 'retreats.ts'), lines.join('\n') + '\n');
  console.log(`  → src/data/retreats.ts (${out.length} retreats)`);
}

// ── Trainings ─────────────────────────────────────────────────────────────────

async function migrateTrainings() {
  console.log('\n── Trainings');
  const trainings = await fetchAPI('trainings', { populate: '*', sort: 'startDate:asc' });

  const out = [];
  for (const t of trainings) {
    const flyerPath = await downloadImage(t.flyerImage?.url, 'trainings', t.slug);
    const headerPath = t.headerImage?.url
      ? await downloadImage(t.headerImage.url, 'trainings', `${t.slug}-header`)
      : flyerPath;
    out.push({
      title: t.title,
      subtitle: t.subtitle || null,
      slug: t.slug,
      startDate: t.startDate,
      endDate: t.endDate,
      price: t.price !== null && t.price !== undefined ? t.price : null,
      flyerImage: flyerPath,
      headerImage: headerPath,
      ctaText: t.ctaText || null,
      ctaLink: t.ctaLink || null,
      body: t.body || '',
    });
  }

  const lines = [
    'export interface Training {',
    '  title: string;',
    '  subtitle: string | null;',
    '  slug: string;',
    '  startDate: string;',
    '  endDate: string;',
    '  price: number | null;',
    '  flyerImage: string | null;',
    '  headerImage: string | null;',
    '  ctaText: string | null;',
    '  ctaLink: string | null;',
    '  body: string;',
    '}',
    '',
    'export const trainings: Training[] = [',
    ...out.map(t =>
      [
        '  {',
        `    title: ${JSON.stringify(t.title)},`,
        `    subtitle: ${t.subtitle ? JSON.stringify(t.subtitle) : 'null'},`,
        `    slug: ${JSON.stringify(t.slug)},`,
        `    startDate: ${JSON.stringify(t.startDate)},`,
        `    endDate: ${JSON.stringify(t.endDate)},`,
        `    price: ${t.price !== null ? t.price : 'null'},`,
        `    flyerImage: ${t.flyerImage ? JSON.stringify(t.flyerImage) : 'null'},`,
        `    headerImage: ${t.headerImage ? JSON.stringify(t.headerImage) : 'null'},`,
        `    ctaText: ${t.ctaText ? JSON.stringify(t.ctaText) : 'null'},`,
        `    ctaLink: ${t.ctaLink ? JSON.stringify(t.ctaLink) : 'null'},`,
        `    body: \`${escapeForTemplateLiteral(t.body)}\`,`,
        '  },',
      ].join('\n')
    ),
    '];',
  ];

  writeFileSync(join(ROOT, 'src', 'data', 'trainings.ts'), lines.join('\n') + '\n');
  console.log(`  → src/data/trainings.ts (${out.length} trainings)`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Migrating content from Strapi → local data files\n');
  ensureDir(join(ROOT, 'src', 'data'));
  ensureDir(join(ROOT, 'public', 'images'));

  await migrateTeam();
  await migrateClasses();
  await migrateEvents();
  await migrateRetreats();
  await migrateTrainings();

  console.log('\nDone. Next step: update pages to import from src/data/ and delete src/lib/strapi.ts');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
