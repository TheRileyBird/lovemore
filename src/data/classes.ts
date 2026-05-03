export type ClassType = 'heated' | 'non-heated' | 'healing-room';

export interface StudioClass {
  name: string;
  type: ClassType;
  description: string;
  temperature: string | null;
  image: string | null;
}

export const classes: StudioClass[] = [
  {
    name: "Bikram (Hot)",
    type: "heated",
    description: `This is your Classic 26/2 Hot Yoga (Bikram style) class. It is a set sequence of 26 asanas (postures) and 2 pranayamas (breathing exercises). This sequence is completed twice throughout the 90-minute class. Designed to warm and stretch your muscles, ligaments, and tendons in the order that is most beneficial to the body. This is a 90-minute class practiced in a room heated to 104° F with 40% humidity.`,
    temperature: "104°F",
    image: "/images/classes/bikram-hot.jpg",
  },
  {
    name: "Functional Flow (Warm)",
    type: "heated",
    description: `Come experience the combination of vinyasa, core, and mobility exercises to enhance balance, strength, and flexibility. Our Functional Flow practice focuses on creating stability and comfort through precise alignment and mindful movement. This class will help you further develop your physical stability which may positively impact your emotional and mental well-being. The practice encourages a dynamic yet grounded and expressive experience within each pose. Each class will end with an extended period of relaxation (savasana) and cool lavender cloths. (Warm) is heated to below body temperature.`,
    temperature: "90-94°F",
    image: "/images/classes/functional-flow-warm.jpg",
  },
  {
    name: "Compression Therapy",
    type: "healing-room",
    description: `Through the compression pant sleeves and Hyperice compression system, this 20 minute recovery session is flushing the toxins and allowing new oxygen and blood into your lower extremities. With the lights drawn low, you are allowed to lay in comfort and extend your savassana practice an extra 10 or 20 minutes while getting amazing recovery benefits.`,
    temperature: null,
    image: "/images/classes/compression-therapy.jpg",
  },
  {
    name: "Reiki",
    type: "healing-room",
    description: `Reiki is a gentle, energy-based healing experience designed to promote relaxation, balance, and overall well-being. Reiki is often used to:
- Reduce stress and anxiety
- Support emotional release
- Improve sleep and relaxation
- Enhance overall energy flow
After a session, you may feel lighter, more grounded, or deeply calm. Some people also notice shifts in mood, clarity, or physical tension over the following days. It’s a subtle yet powerful practice that meets you exactly where you are—whether you’re seeking rest, healing, or simply a moment to reconnect with yourself.`,
    temperature: null,
    image: "/images/classes/reiki.jpg",
  },
  {
    name: "Intuitive Guidance & Coaching",
    type: "healing-room",
    description: `This 90-minute 1:1 session is for moms, creators, entrepreneurs, or anyone feeling the pull toward a more aligned and intentional life. Together, we’ll explore what’s holding you back, clarify your next steps, and build practical tools you can use in your daily life.`,
    temperature: null,
    image: "/images/classes/intuitive-guidance-coaching.jpg",
  },
  {
    name: "Flow (Warm)",
    type: "heated",
    description: `Flow (warm) is a yoga class that typically focuses on slow and smooth movements combined with deep breathing and relaxation techniques. It is great for all levels, including beginners, and those looking for a more soothing and grounding practice. You can expect gentle stretches, poses, and sequences that promote flexibility, balance, and stress relief. This class is a great way to unwind, release tensions, and connect with your body and breath. 

*Each class will end with an extended period of relaxation (savasana) and cool lavender cloths. Flow (warm) is heated to below body temperature and approximately 40% humidity to maximize your flow, increase oxygen levels, and improve the mind and body connection.`,
    temperature: "90-94°F",
    image: "/images/classes/flow-warm.jpg",
  },
  {
    name: "Flow",
    type: "non-heated",
    description: `Flow (Non-Heated)  is a yoga class that typically focuses on slow and smooth movements combined with deep breathing and relaxation techniques without worrying about a heated room. It is great for all levels, including beginners, and those looking for a more soothing and grounding practice. You can expect gentle stretches, poses, and sequences that promote flexibility, balance, and stress relief. This class is a great way to unwind, release tensions, and connect with your body and breath. 

*Each class will end with an extended period of relaxation (savasana) and cool lavender cloths. `,
    temperature: null,
    image: "/images/classes/flow.jpg",
  },
  {
    name: "Yin Yoga",
    type: "non-heated",
    description: `A gentle practice intended to stretch the body, using longer holds to get beyond the muscle tissue into the connective tissue. Most poses are floor based with various props available for support throughout your Yin practice. The slower nature of this class is often described as a “moving meditation”. A great compliment to your strengthening practice. All levels are welcome!`,
    temperature: null,
    image: "/images/classes/yin-yoga.jpg",
  },
  {
    name: "Power Flow (Hot)",
    type: "heated",
    description: `Power Flow is a vinyasa yoga class that focuses on building strength, alignment, flexibility, core, and stamina. This faster paced class combines traditional yoga postures with more intense movements and cardiovascular exercises while promoting focused breathing and mindfulness. Power Flow includes a series of challenging sequences designed to challenge both the body and the mind. It’ll help build muscle tone, aid in stress relief, and mental clarity.  

Each class will end with an extended period of relaxation (savasana) and cool lavender cloths.  Power Flow (hot) is heated to above body temperature and approximately 40% humidity to maximize your flow, increase oxygen levels and improve the mind and body connection.`,
    temperature: "104",
    image: "/images/classes/power-flow-hot.jpg",
  },
  {
    name: "Red Light Therapy",
    type: "healing-room",
    description: `Red light sessions are 15 mins, red light blankets, which incorporate red light therapy, offer a variety of potential benefits, including muscle recovery, pain relief, improved skin health, and enhanced sleep. They work by exposing the body to specific wavelengths of light that can stimulate various cellular processes, promoting healing and overall well-being.`,
    temperature: null,
    image: "/images/classes/red-light-therapy.jpg",
  },
  {
    name: "Long, Slow, Deep (LSD)",
    type: "non-heated",
    description: `This 90-minute set sequence is designed to open up and work into the muscles all around the hip joint.  In this non-heated class, you will release all muscle groups surrounding the hip joint, which in turn leads to more mobility, less compression, healthier pelvis and spinal alignment.  All poses are floor based with various props available to support your body throughout your practice. All levels are welcome!`,
    temperature: null,
    image: "/images/classes/long-slow-deep-lsd.jpg",
  },
  {
    name: "Yoga Sculpt (Warm)",
    type: "heated",
    description: `Yoga Sculpt is a dynamic class that includes yoga poses with strength training exercises for a full-body workout. You may use light weights (dumbbells) to tone and define targeted muscle groups. This class is set to an upbeat playlist and often includes cardio bursts to raise the heart rate and get the body moving. 

The practice ends with a cool-down and relaxation period to calm the body and mind. This class is perfect for anyone looking for a challenging, full-body workout that combines the benefits of yoga and strength training. Whether you're a beginner or an experienced yogi, our Yoga Sculpt class is sure to leave you feeling energized and empowered.`,
    temperature: "90-94°F",
    image: "/images/classes/yoga-sculpt-warm.jpg",
  },
  {
    name: "Sri Yantra Sound Healing",
    type: "healing-room",
    description: `This personalized session combines VoiceBio Voice Analysis, prescribed sound bath therapy, and Tuning Fork Therapy to support your healing journey. Using Cymatic Frequencies through Body Pod body speakers and the Sound Lounge Sound Bed (included in the first session), the therapy is designed to restore balance and well-being. Each private, 60-90 minute session equips you with resources and quidance to continue your on practice of healing.`,
    temperature: null,
    image: "/images/classes/sri-yantra-sound-healing.jpg",
  },
];
