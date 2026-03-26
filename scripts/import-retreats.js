// Import retreats to Strapi CMS
const STRAPI_URL = process.env.STRAPI_URL || 'https://lovemore-cms.onrender.com';

const retreats = [
  {
    name: 'Costa Rica Retreat',
    location: 'Costa Rica',
    body: `<p>Join us for an unforgettable journey to the lush rainforests and pristine beaches of Costa Rica. Immerse yourself in daily yoga practice, meditation, and adventure while surrounded by natural beauty.</p>

<h4>Experience Includes:</h4>
<ul>
<li>Daily yoga and meditation sessions</li>
<li>Beachfront accommodations</li>
<li>Excursions to waterfalls and wildlife reserves</li>
<li>Nourishing farm-to-table meals</li>
<li>Optional surf lessons and zip-lining</li>
</ul>`,
    order: 1,
    active: true
  },
  {
    name: 'Sedona Retreat',
    location: 'Sedona, Arizona',
    body: `<p>Experience the powerful energy vortexes and stunning red rock landscapes of Sedona. This transformative retreat combines yoga, hiking, and spiritual exploration in one of the world's most sacred destinations.</p>

<h4>Experience Includes:</h4>
<ul>
<li>Vortex site visits and energy work</li>
<li>Sunrise yoga in the red rocks</li>
<li>Guided meditation and sound healing</li>
<li>Hiking through breathtaking canyons</li>
<li>Spa treatments and wellness services</li>
</ul>`,
    order: 2,
    active: true
  }
];

async function importRetreats() {
  console.log('Starting retreat import to Strapi...\n');

  for (const retreat of retreats) {
    try {
      console.log(`Importing: ${retreat.name}`);

      const response = await fetch(`${STRAPI_URL}/api/retreats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: retreat
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Failed to import ${retreat.name}:`, error);
        continue;
      }

      const result = await response.json();
      console.log(`✓ Successfully imported: ${retreat.name}\n`);
    } catch (error) {
      console.error(`Error importing ${retreat.name}:`, error.message);
    }
  }

  console.log('Retreat import complete!');
}

importRetreats();
