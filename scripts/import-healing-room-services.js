/**
 * Import healing room services to Strapi
 * Run with: node scripts/import-healing-room-services.js
 */

const STRAPI_URL = process.env.STRAPI_URL || 'https://lovemore-cms.onrender.com';

const healingRoomServices = [
  {
    name: "Compression Therapy",
    type: "healing-room",
    temperature: null,
    description: "Compression therapy supports circulation, recovery, and overall restoration through targeted pneumatic compression sessions.",
    active: true,
    order: 10
  },
  {
    name: "Red Light Therapy",
    type: "healing-room",
    temperature: null,
    description: "Red light therapy offers a gentle, non-invasive wellness service designed to support recovery, skin health, and cellular renewal.",
    active: true,
    order: 11
  },
  {
    name: "Reiki",
    type: "healing-room",
    temperature: null,
    description: "Reiki is an energy-based healing practice intended to encourage relaxation, balance, and nervous system support.",
    active: true,
    order: 12
  },
  {
    name: "Sound Healing",
    type: "healing-room",
    temperature: null,
    description: "Sound healing sessions use resonance and vibration to create space for rest, grounding, and inner calm.",
    active: true,
    order: 13
  },
  {
    name: "Coaching",
    type: "healing-room",
    temperature: null,
    description: "Coaching provides guided support for personal growth, clarity, and sustainable next steps in your wellness journey.",
    active: true,
    order: 14
  }
];

async function createService(serviceData) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/classes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: serviceData.name,
          type: serviceData.type,
          temperature: serviceData.temperature,
          description: serviceData.description,
          active: serviceData.active,
          order: serviceData.order,
          image: null
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`✗ Failed to create ${serviceData.name}: ${response.statusText}`);
      console.error(`  Error: ${error}`);
      return null;
    }

    const result = await response.json();
    console.log(`✓ Created: ${serviceData.name}`);
    return result;
  } catch (error) {
    console.error(`✗ Error creating ${serviceData.name}:`, error.message);
    return null;
  }
}

async function importServices() {
  console.log(`🚀 Starting import of ${healingRoomServices.length} healing room services to Strapi...\n`);
  console.log(`Target: ${STRAPI_URL}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const service of healingRoomServices) {
    const result = await createService(service);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n✅ Import complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`\nNext steps:`);
  console.log(`1. Update the Class type enum in Strapi to include "healing-room" before running this import`);
  console.log(`2. Go to ${STRAPI_URL}/admin`);
  console.log(`3. Open Content Manager → Classes`);
  console.log(`4. Upload images and expand descriptions as needed`);
  console.log(`5. Verify all services are active and published`);
}

importServices();
