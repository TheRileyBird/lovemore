/**
 * Migration script to import content from scraped JSON into Strapi
 * Run with: node scripts/migrate-to-strapi.js
 */

const STRAPI_URL = 'http://127.0.0.1:1337';

// Sample team members data from your existing markdown files
const teamMembers = [
  {
    name: "JoEllen Luke",
    title: "Yoga Instructor",
    image: "https://images.squarespace-cdn.com/content/v1/59d53a9459cc683b30818a39/1698857060735-KPQLXCVVP8IFKKFKMVXB/J.Luke+%281%29.JPG",
    order: 1,
    active: true,
    bio: "JoEllen is the heart and soul of Love More. With years of dedication to the practice and community, she brings warmth, wisdom, and transformative energy to every class."
  },
  {
    name: "Mackenzie Halloran",
    title: "Yoga Instructor",
    image: "https://images.squarespace-cdn.com/content/v1/59d53a9459cc683b30818a39/1698857026829-W1FZTHXFGDGLBKJMNP4D/Mackenzie+Halloran+%281%29.JPG",
    order: 2,
    active: true,
    bio: "Mackenzie is a passionate yoga instructor dedicated to helping students discover the transformative power of movement and mindfulness. With years of experience and a deep commitment to the Love More community, Mackenzie creates a welcoming and supportive environment for practitioners of all levels."
  }
];

// Sample classes data extracted from scraped JSON
const classes = [
  {
    name: "Power Flow (Hot)",
    type: "heated",
    image: "https://images.squarespace-cdn.com/content/v1/59d53a9459cc683b30818a39/42328285-f262-4c19-8a9d-9dcb021513f0/8N7A9310.jpg",
    order: 1,
    active: true,
    description: "Power Flow is a vinyasa yoga class that focuses on building strength, alignment, flexibility, core, and stamina. This faster paced class combines traditional yoga postures with more intense movements and cardiovascular exercises while promoting focused breathing and mindfulness. Power Flow includes a series of challenging sequences designed to challenge both the body and the mind. It'll help build muscle tone, aid in stress relief, and mental clarity.\n\n* Each class will end with an extended period of relaxation (savasana) and cool lavender cloths. Power Flow (hot) is heated to above body temperature and approximately 40% humidity to maximize your flow, increase oxygen levels and improve the mind and body connection."
  },
  {
    name: "Flow (Warm)",
    type: "heated",
    image: "https://images.squarespace-cdn.com/content/v1/59d53a9459cc683b30818a39/7a370992-6f9d-46cf-8ee0-9a864a5fc181/8N7A8115.jpg",
    order: 2,
    active: true,
    description: "Flow (warm) is a yoga class that typically focuses on slow and smooth movements combined with deep breathing and relaxation techniques. It is great for all levels, including beginners, and those looking for a more soothing and grounding practice. You can expect gentle stretches, poses, and sequences that promote flexibility, balance, and stress relief. This class is a great way to unwind, release tensions, and connect with your body and breath.\n\n*Each class will end with an extended period of relaxation (savasana) and cool lavender cloths. Flow (warm) is heated to below body temperature and approximately 40% humidity to maximize your flow, increase oxygen levels, and improve the mind and body connection."
  },
  {
    name: "Functional Flow (Warm)",
    type: "non-heated",
    image: "https://images.squarespace-cdn.com/content/v1/59d53a9459cc683b30818a39/62967832-200e-42d3-87a8-9f5b4b31baf6/8N7A9056.jpg",
    order: 3,
    active: true,
    description: "Come experience the combination of vinyasa, core, and mobility exercises to enhance balance, strength, and flexibility. Our Functional Flow practice focuses on creating stability and comfort through precise alignment and mindful movement. This class will help you further develop your physical stability which may positively impact your emotional and mental well-being. The practice encourages a dynamic yet grounded and expressive experience within each pose.\n\n*Each class will end with an extended period of relaxation (savasana) and cool lavender cloths. (Warm) is heated to below body temperature."
  },
  {
    name: "Bikram (Hot)",
    type: "heated",
    image: "https://images.squarespace-cdn.com/content/v1/59d53a9459cc683b30818a39/afd67ec5-62c0-4a9b-bfd8-fd2b9c27c0c0/8N7A9098.jpg",
    order: 4,
    active: true,
    description: "This is your Classic 26/2 Hot Yoga (Bikram style) class. It is a set sequence of 26 asanas (postures) and 2 pranayamas (breathing exercises). This sequence is completed twice throughout the 90-minute class. Designed to warm and stretch your muscles, ligaments, and tendons in the order that is most beneficial to the body. This is a 90-minute class practiced in a room heated to 105° F with 40% humidity."
  },
  {
    name: "Yoga Sculpt (Warm)",
    type: "specialty",
    image: "https://images.squarespace-cdn.com/content/v1/59d53a9459cc683b30818a39/3d490ee4-5e45-4c72-ab50-158b8b336d15/8N7A8590.jpg",
    order: 5,
    active: true,
    description: "Yoga Sculpt is a dynamic class that includes yoga poses with strength training exercises for a full-body workout. You may use light weights (dumbells) to tone and define targeted muscle groups. This class is set to an upbeat playlist and often includes cardio bursts to raise the heart rate and get the body moving.\n\nThe practice ends with a cool-down and relaxation period to calm the body and mind. This class is perfect for anyone looking for a challenging, full-body workout that combines the benefits of yoga and strength training. Whether you're a beginner or an experienced yogi, our Yoga Sculpt class is sure to leave you feeling energized and empowered."
  }
];

// Sample retreats data
const retreats = [
  {
    name: "ROOTED: A Rainforest Experience",
    location: "Finca Luna Nueva Lodge, Costa Rica",
    image: "https://images.squarespace-cdn.com/content/v1/59d53a9459cc683b30818a39/c830c2d9-3530-405d-91ef-4e8a5c44fb00/rooted.jpg",
    order: 1,
    active: true,
    highlights: [
      "Transportation from and to the airport",
      "Room stay at the farm",
      "2/3 daily movement practices",
      "3 meals a day",
      "Meditations",
      "Breathwork",
      "Farm tour",
      "Cacao tour and ceremony",
      "Ecstatic dance",
      "Waterfall tour",
      "Nature hikes",
      "Ice bath",
      "Pool workouts"
    ],
    description: "Take a journey into the rainforest of Costa Rica to unveil your highest potential. Awaken your healing journey through breath work, yoga, sound, lymphatic releases, nervous system resets, adventure, and more!\n\nThis retreat offers you the opportunity to move and raise your awareness to a higher way of being, meet challenges for personal growth, and embody the truth of who you are.\n\nOur 7 Day/6 Night retreat will be spent offering you opportunities to deepen your connection with your higher self and take tools home with you to ensure you can continue to tap into your infinite potential."
  },
  {
    name: "EmpowerU Women's Wellness and Empowerment Retreat",
    location: "Sedona, Arizona",
    image: "https://images.squarespace-cdn.com/content/v1/59d53a9459cc683b30818a39/719765eb-6c91-4e6e-812b-6f75814cf58a/image.png",
    order: 2,
    active: true,
    highlights: [
      "Yoga",
      "Meditation",
      "Breathwork",
      "Journaling",
      "Ice baths",
      "Ecstatic dance",
      "Hiking",
      "Sound baths",
      "Sauna",
      "Conscious conversations",
      "Empowering workshops",
      "Lodging",
      "Meals",
      "Transportation to/from the airport"
    ],
    description: "Join JoEllen and Jax (alongside other healing practitioners) for our next EmpowerU - Women's Wellness and Empowerment Retreat.\n\nThis transformative and healing retreat is 5 days and 4 nights surrounded by breathtaking red rock mountains and energy vortexes of Sedona, Arizona.\n\nEmpowerU will help you reconnect with yourself and tap into your inner truth and power. You'll have the opportunity to disconnect from the distractions of everyday life and focus on your personal growth and well-being."
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
      throw new Error(`Failed to create ${collectionType}: ${response.statusText} - ${error}`);
    }

    const result = await response.json();
    console.log(`✓ Created ${collectionType}:`, data.name);
    return result;
  } catch (error) {
    console.error(`✗ Error creating ${collectionType}:`, error.message);
    return null;
  }
}

async function migrate() {
  console.log('🚀 Starting migration to Strapi...\n');

  // Migrate team members
  console.log('📋 Migrating Team Members...');
  for (const member of teamMembers) {
    await createEntry('team-members', member);
  }

  // Migrate classes
  console.log('\n📋 Migrating Classes...');
  for (const classItem of classes) {
    await createEntry('classes', classItem);
  }

  // Migrate retreats
  console.log('\n📋 Migrating Retreats...');
  for (const retreat of retreats) {
    await createEntry('retreats', retreat);
  }

  console.log('\n✅ Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Open http://localhost:1337/admin');
  console.log('2. Go to Settings → Users & Permissions → Roles → Public');
  console.log('3. Enable "find" and "findOne" permissions for team-members, classes, and retreats');
  console.log('4. Update your Astro pages to fetch from Strapi API');
}

migrate();
