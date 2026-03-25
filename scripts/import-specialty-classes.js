/**
 * Import specialty classes to Strapi
 * Run with: node scripts/import-specialty-classes.js
 */

const STRAPI_URL = process.env.STRAPI_URL || 'https://lovemore-cms.onrender.com';

// Specialty class data
const specialtyClasses = [
  {
    name: "Aerial Yoga",
    type: "specialty",
    temperature: null,
    description: "Defy gravity and explore yoga in a whole new dimension using suspended silk hammocks. Build strength, increase flexibility, and experience the therapeutic benefits of inversion. Our aerial yoga classes provide a fun, challenging way to develop body awareness while suspended in the air. Perfect for those looking to add playfulness to their practice while building upper body and core strength.",
    active: true,
    order: 1
  },
  {
    name: "Sound Healing",
    type: "specialty",
    temperature: null,
    description: "Immerse yourself in the therapeutic vibrations of crystal singing bowls, gongs, and other sound instruments. Experience deep relaxation and energetic alignment through the power of sound meditation. These healing sessions help reduce stress, promote emotional release, and restore balance to your nervous system. Allow the resonant frequencies to guide you into a state of profound peace and restoration.",
    active: true,
    order: 2
  },
  {
    name: "Inversion Workshops",
    type: "specialty",
    temperature: null,
    description: "Learn the foundations and progressions of arm balances, handstands, and headstands in a safe, supportive environment. Build confidence while developing strength and body awareness through structured instruction. Our workshops break down complex inversions into achievable steps, helping you overcome fear and build the skills needed for advanced practice. Suitable for all levels with modifications provided.",
    active: true,
    order: 3
  },
  {
    name: "Outdoor Classes & Charity Events",
    type: "specialty",
    temperature: null,
    description: "Join us for special outdoor yoga sessions and community charity events. Practice in nature while giving back to our community through fundraising classes and wellness events. Experience the unique energy of practicing yoga outdoors, connecting with nature, and supporting meaningful causes. These special events bring our community together for movement, mindfulness, and making a positive impact.",
    active: true,
    order: 4
  },
  {
    name: "Teacher Training",
    type: "specialty",
    temperature: null,
    description: "Deepen your practice and share your passion with our comprehensive yoga teacher training programs. Transform your life while preparing to guide others on their yoga journey. Our immersive training combines philosophy, anatomy, teaching methodology, and personal development. Whether you want to teach professionally or simply deepen your understanding, our program provides the knowledge, skills, and confidence to share yoga authentically.",
    active: true,
    order: 5
  }
];

async function createClass(classData) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/classes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: classData.name,
          type: classData.type,
          temperature: classData.temperature,
          description: classData.description,
          active: classData.active,
          order: classData.order,
          image: null // Images can be added later via CMS
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`✗ Failed to create ${classData.name}: ${response.statusText}`);
      console.error(`  Error: ${error}`);
      return null;
    }

    const result = await response.json();
    console.log(`✓ Created: ${classData.name}`);
    return result;
  } catch (error) {
    console.error(`✗ Error creating ${classData.name}:`, error.message);
    return null;
  }
}

async function importSpecialtyClasses() {
  console.log(`🚀 Starting import of ${specialtyClasses.length} specialty classes to Strapi...\n`);
  console.log(`Target: ${STRAPI_URL}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const classItem of specialtyClasses) {
    const result = await createClass(classItem);
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
  console.log(`2. Open Content Manager → Classes`);
  console.log(`3. Upload images for each specialty class as needed`);
  console.log(`4. Verify all classes are active and published`);
}

importSpecialtyClasses();
