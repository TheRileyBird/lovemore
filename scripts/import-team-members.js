/**
 * Import team members to Strapi from scraped data
 * Run with: node scripts/import-team-members.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STRAPI_URL = process.env.STRAPI_URL || 'https://lovemore-cms.onrender.com';

// Load the extracted team members
const teamMembers = JSON.parse(readFileSync(join(__dirname, 'team-members-import.json'), 'utf8'));

async function createTeamMember(member) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/team-members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: member.name,
          title: member.title,
          bio: member.bio,
          active: true,
          image: null // No images for now
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`✗ Failed to create ${member.name}: ${response.statusText}`);
      console.error(`  Error: ${error}`);
      return null;
    }

    const result = await response.json();
    console.log(`✓ Created: ${member.name}`);
    return result;
  } catch (error) {
    console.error(`✗ Error creating ${member.name}:`, error.message);
    return null;
  }
}

async function importTeamMembers() {
  console.log(`🚀 Starting import of ${teamMembers.length} team members to Strapi...\n`);
  console.log(`Target: ${STRAPI_URL}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const member of teamMembers) {
    const result = await createTeamMember(member);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n✅ Import complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`\nNext steps:`);
  console.log(`1. Go to ${STRAPI_URL}/admin`);
  console.log(`2. Open Content Manager → Team Page`);
  console.log(`3. Add team members to the Team Page using drag-and-drop ordering`);
  console.log(`4. Upload images for each team member as needed`);
}

importTeamMembers();
