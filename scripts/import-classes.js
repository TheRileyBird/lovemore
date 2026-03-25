/**
 * Import classes to Strapi
 * Run with: node scripts/import-classes.js
 */

const STRAPI_URL = process.env.STRAPI_URL || 'https://lovemore-cms.onrender.com';

// All class data
const classes = [
  // Heated Classes
  {
    name: "Power Flow (Hot)",
    type: "heated",
    temperature: "100-105°F",
    description: "Power Flow is a vinyasa yoga class that focuses on building strength, alignment, flexibility, core, and stamina. This faster paced class combines traditional yoga postures with more intense movements and cardiovascular exercises while promoting focused breathing and mindfulness. Power Flow includes a series of challenging sequences designed to challenge both the body and the mind. It'll help build muscle tone, aid in stress relief, and mental clarity. Each class will end with an extended period of relaxation (savasana) and cool lavender cloths. Power Flow (hot) is heated to above body temperature and approximately 40% humidity to maximize your flow, increase oxygen levels and improve the mind and body connection.",
    active: true,
    order: 1
  },
  {
    name: "Flow (Warm)",
    type: "heated",
    temperature: "90-95°F",
    description: "Flow (warm) is a yoga class that typically focuses on slow and smooth movements combined with deep breathing and relaxation techniques. It is great for all levels, including beginners, and those looking for a more soothing and grounding practice. You can expect gentle stretches, poses, and sequences that promote flexibility, balance, and stress relief. This class is a great way to unwind, release tensions, and connect with your body and breath. Each class will end with an extended period of relaxation (savasana) and cool lavender cloths. Flow (warm) is heated to below body temperature and approximately 40% humidity to maximize your flow, increase oxygen levels, and improve the mind and body connection.",
    active: true,
    order: 2
  },
  {
    name: "Functional Flow (Warm)",
    type: "heated",
    temperature: "90-95°F",
    description: "Come experience the combination of vinyasa, core, and mobility exercises to enhance balance, strength, and flexibility. Our Functional Flow practice focuses on creating stability and comfort through precise alignment and mindful movement. This class will help you further develop your physical stability which may positively impact your emotional and mental well-being. The practice encourages a dynamic yet grounded and expressive experience within each pose. Each class will end with an extended period of relaxation (savasana) and cool lavender cloths. (Warm) is heated to below body temperature.",
    active: true,
    order: 3
  },
  {
    name: "Bikram (Hot)",
    type: "heated",
    temperature: "105°F",
    description: "This is your Classic 26/2 Hot Yoga (Bikram style) class. It is a set sequence of 26 asanas (postures) and 2 pranayamas (breathing exercises). This sequence is completed twice throughout the 90-minute class. Designed to warm and stretch your muscles, ligaments, and tendons in the order that is most beneficial to the body. This is a 90-minute class practiced in a room heated to 105° F with 40% humidity.",
    active: true,
    order: 4
  },
  {
    name: "Yoga Sculpt (Warm)",
    type: "heated",
    temperature: "90-95°F",
    description: "Yoga Sculpt is a dynamic class that includes yoga poses with strength training exercises for a full-body workout. You may use light weights (dumbbells) to tone and define targeted muscle groups. This class is set to an upbeat playlist and often includes cardio bursts to raise the heart rate and get the body moving. The practice ends with a cool-down and relaxation period to calm the body and mind. This class is perfect for anyone looking for a challenging, full-body workout that combines the benefits of yoga and strength training. Whether you're a beginner or an experienced yogi, our Yoga Sculpt class is sure to leave you feeling energized and empowered.",
    active: true,
    order: 5
  },
  // Non-Heated Classes
  {
    name: "Yin Yoga",
    type: "non-heated",
    temperature: null,
    description: "Yin Yoga is a slow-paced, meditative practice where poses are held for 3-5 minutes or longer. This gentle approach targets the deep connective tissues, fascia, and joints in the body rather than the muscles. Yin practice promotes relaxation, improves flexibility, and encourages mindfulness. It's perfect for all levels and especially beneficial for those seeking stress relief and deeper body awareness. The extended holds create space for introspection and help release physical and emotional tension.",
    active: true,
    order: 6
  },
  {
    name: "Restorative Yoga",
    type: "non-heated",
    temperature: null,
    description: "Restorative Yoga is a deeply relaxing practice that uses props like bolsters, blankets, and blocks to support the body in restful poses. Each pose is held for extended periods, allowing the nervous system to shift into a state of deep rest and repair. This practice reduces stress, improves sleep quality, and supports overall healing. It's ideal for those recovering from injury, experiencing stress or burnout, or simply seeking profound relaxation and rejuvenation.",
    active: true,
    order: 7
  },
  {
    name: "Gentle Flow",
    type: "non-heated",
    temperature: null,
    description: "Gentle Flow is an accessible, beginner-friendly class that links breath with movement at a slower, more mindful pace. This practice emphasizes proper alignment, body awareness, and breath connection without the intensity of faster-paced classes. Perfect for those new to yoga, recovering from injury, or seeking a more meditative movement practice. You'll build strength and flexibility while maintaining a calm, centered mindset throughout the practice.",
    active: true,
    order: 8
  },
  {
    name: "Hatha Yoga",
    type: "non-heated",
    temperature: null,
    description: "Hatha Yoga is a traditional practice that balances strength and flexibility through a sequence of foundational poses. This class moves at a moderate pace, allowing time to explore alignment, build stability, and develop body awareness. Hatha emphasizes the balance of effort and ease, combining physical postures with breathwork and relaxation. Suitable for all levels, this practice provides a solid foundation for any yoga journey while promoting physical health and mental clarity.",
    active: true,
    order: 9
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

async function importClasses() {
  console.log(`🚀 Starting import of ${classes.length} classes to Strapi...\n`);
  console.log(`Target: ${STRAPI_URL}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const classItem of classes) {
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
  console.log(`3. Upload images for each class as needed`);
  console.log(`4. Verify all classes are active and published`);
}

importClasses();
