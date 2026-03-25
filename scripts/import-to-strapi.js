/**
 * Import all content from local data into Strapi CMS
 * Run with: node scripts/import-to-strapi.js
 */

const STRAPI_URL = 'https://lovemore-cms.onrender.com';

// Team Members data
const teamMembers = [
  {
    name: "JoEllen Luke",
    title: "Founder & Lead Instructor",
    bio: "JoEllen is a passionate yoga instructor dedicated to helping students discover the transformative power of movement and mindfulness. With years of experience and a deep commitment to the Love More community, JoEllen creates a welcoming and supportive environment for practitioners of all levels. Her classes blend traditional wisdom with modern approaches, emphasizing the connection between breath, body, and spirit.",
    order: 1,
    active: true
  },
  {
    name: "Mackenzie Halloran",
    title: "Yoga Instructor",
    bio: "Mackenzie is a passionate yoga instructor dedicated to helping students discover the transformative power of movement and mindfulness. With years of experience and a deep commitment to the Love More community, Mackenzie creates a welcoming and supportive environment for practitioners of all levels.",
    order: 2,
    active: true
  }
];

// Classes data
const classes = [
  {
    name: "Power Flow (Hot)",
    type: "heated",
    description: "Power Flow is a vinyasa yoga class that focuses on building strength, alignment, flexibility, core, and stamina. This faster paced class combines traditional yoga postures with more intense movements and cardiovascular exercises while promoting focused breathing and mindfulness. Power Flow includes a series of challenging sequences designed to challenge both the body and the mind. It'll help build muscle tone, aid in stress relief, and mental clarity.\n\n* Each class will end with an extended period of relaxation (savasana) and cool lavender cloths. Power Flow (hot) is heated to above body temperature and approximately 40% humidity to maximize your flow, increase oxygen levels and improve the mind and body connection.",
    order: 1,
    active: true
  },
  {
    name: "Flow (Warm)",
    type: "heated",
    description: "Flow (warm) is a yoga class that typically focuses on slow and smooth movements combined with deep breathing and relaxation techniques. It is great for all levels, including beginners, and those looking for a more soothing and grounding practice. You can expect gentle stretches, poses, and sequences that promote flexibility, balance, and stress relief. This class is a great way to unwind, release tensions, and connect with your body and breath.\n\n*Each class will end with an extended period of relaxation (savasana) and cool lavender cloths. Flow (warm) is heated to below body temperature and approximately 40% humidity to maximize your flow, increase oxygen levels, and improve the mind and body connection.",
    order: 2,
    active: true
  },
  {
    name: "Functional Flow (Warm)",
    type: "non-heated",
    description: "Come experience the combination of vinyasa, core, and mobility exercises to enhance balance, strength, and flexibility. Our Functional Flow practice focuses on creating stability and comfort through precise alignment and mindful movement. This class will help you further develop your physical stability which may positively impact your emotional and mental well-being. The practice encourages a dynamic yet grounded and expressive experience within each pose.\n\n*Each class will end with an extended period of relaxation (savasana) and cool lavender cloths. (Warm) is heated to below body temperature.",
    order: 3,
    active: true
  },
  {
    name: "Bikram (Hot)",
    type: "heated",
    description: "This is your Classic 26/2 Hot Yoga (Bikram style) class. It is a set sequence of 26 asanas (postures) and 2 pranayamas (breathing exercises). This sequence is completed twice throughout the 90-minute class. Designed to warm and stretch your muscles, ligaments, and tendons in the order that is most beneficial to the body. This is a 90-minute class practiced in a room heated to 105° F with 40% humidity.",
    order: 4,
    active: true
  },
  {
    name: "Yoga Sculpt (Warm)",
    type: "specialty",
    description: "Yoga Sculpt is a dynamic class that includes yoga poses with strength training exercises for a full-body workout. You may use light weights (dumbells) to tone and define targeted muscle groups. This class is set to an upbeat playlist and often includes cardio bursts to raise the heart rate and get the body moving.\n\nThe practice ends with a cool-down and relaxation period to calm the body and mind. This class is perfect for anyone looking for a challenging, full-body workout that combines the benefits of yoga and strength training. Whether you're a beginner or an experienced yogi, our Yoga Sculpt class is sure to leave you feeling energized and empowered.",
    order: 5,
    active: true
  }
];

// Retreats data
const retreats = [
  {
    name: "ROOTED: A Rainforest Experience",
    location: "Finca Luna Nueva Lodge, Costa Rica",
    description: "Take a journey into the rainforest of Costa Rica to unveil your highest potential. Awaken your healing journey through breath work, yoga, sound, lymphatic releases, nervous system resets, adventure, and more!\n\nThis retreat offers you the opportunity to move and raise your awareness to a higher way of being, meet challenges for personal growth, and embody the truth of who you are.\n\nOur 7 Day/6 Night retreat will be spent offering you opportunities to deepen your connection with your higher self and take tools home with you to ensure you can continue to tap into your infinite potential. This is an all levels retreat with opportunities for multiple modalities of movement and body biohacking.\n\nWe will enjoy delicious, locally grown organic cuisine prepared from the farm we are staying on.",
    highlights: [
      "Transportation from and to the airport",
      "Room stay at the farm",
      "2/3 daily movement practices",
      "3 meals a day",
      "Meditations and Breathwork",
      "Farm tour and Cacao ceremony",
      "Ecstatic dance",
      "Waterfall tour and Nature hikes",
      "Ice bath and Pool workouts"
    ],
    order: 1,
    active: true
  },
  {
    name: "EmpowerU Women's Wellness and Empowerment Retreat",
    location: "Sedona, Arizona",
    description: "Join JoEllen and Jax (alongside other healing practitioners) for our next EmpowerU - Women's Wellness and Empowerment Retreat.\n\nThis transformative and healing retreat is 5 days and 4 nights surrounded by breathtaking red rock mountains and energy vortexes of Sedona, Arizona.\n\nEmpowerU will help you reconnect with yourself and tap into your inner truth and power. You'll have the opportunity to disconnect from the distractions of everyday life and focus on your personal growth and well-being.",
    highlights: [
      "Yoga and Meditation",
      "Breathwork and Journaling",
      "Ice baths and Ecstatic dance",
      "Hiking and Sound baths",
      "Sauna and Conscious conversations",
      "Empowering workshops",
      "Lodging, Meals, and Airport transportation"
    ],
    order: 2,
    active: true
  }
];

async function createEntry(collectionType, data) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/${collectionType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`✗ Failed to create ${collectionType}: ${response.status} ${response.statusText}`);
      console.error(`  Error: ${error}`);
      return null;
    }

    const result = await response.json();
    console.log(`✓ Created ${collectionType}:`, data.name);
    return result;
  } catch (error) {
    console.error(`✗ Error creating ${collectionType}:`, error.message);
    return null;
  }
}

async function importData() {
  console.log('🚀 Starting import to Strapi CMS...\n');
  console.log(`📍 Strapi URL: ${STRAPI_URL}\n`);

  let successCount = 0;
  let failCount = 0;

  // Import team members
  console.log('👥 Importing Team Members...');
  for (const member of teamMembers) {
    const result = await createEntry('team-members', member);
    if (result) successCount++;
    else failCount++;
  }

  // Import classes
  console.log('\n🧘 Importing Classes...');
  for (const classItem of classes) {
    const result = await createEntry('classes', classItem);
    if (result) successCount++;
    else failCount++;
  }

  // Import retreats
  console.log('\n🏔️  Importing Retreats...');
  for (const retreat of retreats) {
    const result = await createEntry('retreats', retreat);
    if (result) successCount++;
    else failCount++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully imported: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('='.repeat(50));

  if (successCount > 0) {
    console.log('\n🎉 Import complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to https://lovemore-cms.onrender.com/admin');
    console.log('2. Check Content Manager to see your imported content');
    console.log('3. Enable API permissions (Settings → Roles → Public)');
    console.log('   - Check "find" and "findOne" for each content type');
    console.log('4. Test your Astro site to fetch data from Strapi');
  } else {
    console.log('\n⚠️  No content was imported. Check the errors above.');
    console.log('Make sure the Strapi API is accessible and public permissions are enabled.');
  }
}

// Run import
importData().catch(console.error);
