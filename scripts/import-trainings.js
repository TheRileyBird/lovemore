// Import teacher trainings to Strapi CMS
const STRAPI_URL = process.env.STRAPI_URL || 'https://lovemore-cms.onrender.com';

const trainings = [
  {
    title: '200-Hour Yoga Teacher Training',
    description: 'Our foundational training program provides a comprehensive introduction to teaching yoga. You\'ll learn anatomy, philosophy, teaching methodology, and develop your personal practice while building the confidence to lead your own classes.',
    features: [
      'Comprehensive study of yoga asana, pranayama, and meditation',
      'Anatomy and physiology for yoga teachers',
      'Teaching methodology and class sequencing',
      'Yoga philosophy and history',
      'Hands-on teaching practice and feedback'
    ],
    type: 'ryt200',
    certification: 'Yoga Alliance Certified RYT® 200',
    ctaText: 'Learn More',
    ctaLink: '/contact',
    variant: 'primary',
    order: 1,
    active: true
  },
  {
    title: 'Advanced Training & Workshops',
    description: 'Continue your education with specialized workshops and advanced training modules. Topics include advanced asana, adjustments and assists, specialty class formats, and business skills for yoga teachers.',
    features: [],
    type: 'advanced',
    certification: null,
    ctaText: 'View Upcoming Workshops',
    ctaLink: '/contact',
    variant: 'secondary',
    order: 2,
    active: true
  }
];

async function importTrainings() {
  console.log('Starting training import to Strapi...\n');

  for (const training of trainings) {
    try {
      console.log(`Importing: ${training.title}`);

      const response = await fetch(`${STRAPI_URL}/api/trainings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: training
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Failed to import ${training.title}:`, error);
        continue;
      }

      const result = await response.json();
      console.log(`✓ Successfully imported: ${training.title}\n`);
    } catch (error) {
      console.error(`Error importing ${training.title}:`, error.message);
    }
  }

  console.log('Training import complete!');
}

importTrainings();
