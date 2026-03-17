import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://lovemoremcc.com';

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/schedule', name: 'schedule' },
  { path: '/contact', name: 'contact' },
  { path: '/studio-classes', name: 'studio-classes' },
  { path: '/heated-classes', name: 'heated-classes' },
  { path: '/team', name: 'team' },
  { path: '/virtual-studio', name: 'virtual-studio' },
  { path: '/specialty-classes', name: 'specialty-classes' },
  { path: '/retreats', name: 'retreats' },
  { path: '/events', name: 'events' },
  { path: '/pricing-options', name: 'pricing' },
];

async function fetchPage(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return await response.text();
}

function extractContent($) {
  // Remove scripts, styles, and navigation elements
  $('script, style, nav, header, footer, .sqs-block-button').remove();

  const content = {
    title: $('title').text().trim(),
    metaDescription: $('meta[name="description"]').attr('content') || '',
    headings: [],
    sections: [],
    images: [],
    links: [],
  };

  // Extract all headings in order
  $('h1, h2, h3, h4, h5, h6').each((i, el) => {
    const $el = $(el);
    content.headings.push({
      level: parseInt(el.tagName.substring(1)),
      text: $el.text().trim(),
    });
  });

  // Extract main content sections
  const mainContent = $('.content-wrapper, .sqs-layout, main, article').first();
  if (mainContent.length) {
    mainContent.find('.sqs-block').each((i, block) => {
      const $block = $(block);
      const type = $block.attr('class')?.match(/sqs-block-(\w+)/)?.[1] || 'unknown';

      const section = {
        type,
        html: $block.html()?.trim() || '',
        text: $block.text().trim(),
      };

      // Extract structured data based on type
      if (type === 'html') {
        section.headings = [];
        $block.find('h1, h2, h3, h4, h5, h6').each((j, h) => {
          section.headings.push({
            level: parseInt(h.tagName.substring(1)),
            text: $(h).text().trim(),
          });
        });

        section.paragraphs = [];
        $block.find('p').each((j, p) => {
          const text = $(p).text().trim();
          if (text) section.paragraphs.push(text);
        });

        section.lists = [];
        $block.find('ul, ol').each((j, list) => {
          const items = [];
          $(list).find('li').each((k, li) => {
            items.push($(li).text().trim());
          });
          section.lists.push({
            type: list.tagName,
            items,
          });
        });
      }

      if (type === 'image') {
        const img = $block.find('img').first();
        if (img.length) {
          section.image = {
            src: img.attr('src') || img.attr('data-src'),
            alt: img.attr('alt') || '',
          };
        }
      }

      content.sections.push(section);
    });
  }

  // Extract all images
  $('img').each((i, img) => {
    const $img = $(img);
    const src = $img.attr('src') || $img.attr('data-src');
    if (src) {
      content.images.push({
        src,
        alt: $img.attr('alt') || '',
        title: $img.attr('title') || '',
      });
    }
  });

  // Extract internal links
  $('a[href]').each((i, link) => {
    const $link = $(link);
    const href = $link.attr('href');
    if (href && (href.startsWith('/') || href.includes('lovemoremcc.com'))) {
      content.links.push({
        href,
        text: $link.text().trim(),
      });
    }
  });

  return content;
}

async function scrapePage(page) {
  const url = `${BASE_URL}${page.path}`;
  console.log(`Scraping ${url}...`);

  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);
    const content = extractContent($);

    return {
      name: page.name,
      url,
      path: page.path,
      scrapedAt: new Date().toISOString(),
      ...content,
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return {
      name: page.name,
      url,
      path: page.path,
      error: error.message,
    };
  }
}

async function main() {
  console.log('Starting scrape of lovemoremcc.com...\n');

  const results = [];
  for (const page of PAGES) {
    const result = await scrapePage(page);
    results.push(result);
    // Be polite - add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Create output directory
  const outputDir = join(process.cwd(), 'scraped-content');
  mkdirSync(outputDir, { recursive: true });

  // Save individual page files
  for (const result of results) {
    const filename = `${result.name}.json`;
    const filepath = join(outputDir, filename);
    writeFileSync(filepath, JSON.stringify(result, null, 2));
    console.log(`✓ Saved ${filename}`);
  }

  // Save combined file
  const combinedPath = join(outputDir, 'all-pages.json');
  writeFileSync(combinedPath, JSON.stringify({
    scrapedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    pages: results,
  }, null, 2));
  console.log(`✓ Saved all-pages.json`);

  // Generate markdown summary
  let markdown = `# Scraped Content from lovemoremcc.com\n\n`;
  markdown += `Scraped on: ${new Date().toISOString()}\n\n`;
  markdown += `## Pages\n\n`;

  for (const result of results) {
    markdown += `### ${result.name}\n\n`;
    markdown += `- URL: ${result.url}\n`;
    markdown += `- Title: ${result.title || 'N/A'}\n`;
    markdown += `- Description: ${result.metaDescription || 'N/A'}\n`;
    markdown += `- Headings: ${result.headings?.length || 0}\n`;
    markdown += `- Sections: ${result.sections?.length || 0}\n`;
    markdown += `- Images: ${result.images?.length || 0}\n`;
    markdown += `- Links: ${result.links?.length || 0}\n\n`;

    if (result.error) {
      markdown += `**Error:** ${result.error}\n\n`;
    }
  }

  const markdownPath = join(outputDir, 'README.md');
  writeFileSync(markdownPath, markdown);
  console.log(`✓ Saved README.md`);

  console.log(`\n✓ Scraping complete! Results saved to ${outputDir}/`);
}

main().catch(console.error);
