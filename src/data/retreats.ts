export interface RetreatGalleryImage {
  url: string;
  alt: string;
}

export interface Retreat {
  name: string;
  subtitle: string | null;
  slug: string;
  location: string | null;
  startDate: string;
  endDate: string;
  flyerImage: string | null;
  headerImage: string | null;
  body: string;
  gallery: RetreatGalleryImage[];
  ctaButtonLabel: string | null;
  ctaButtonUrl: string | null;
}

export const retreats: Retreat[] = [
  {
    name: "EmpowerU",
    subtitle: "Women's Wellness and Empowerment Retreat",
    slug: "empoweru-sedona-retreat",
    location: "Sedona, Arizona",
    startDate: "2026-09-17",
    endDate: "2026-09-21",
    flyerImage: "/images/retreats/empoweru-sedona-retreat-flyer.png",
    headerImage: "/images/retreats/empoweru-sedona-retreat-header.jpg",
    body: `Join JoEllen and Jax (alongside other healing practitioners) September 17-21, 2026 for our next EmpowerU - Women's Wellness and Empowerment Retreat. This transformative and healing retreat is 5 days and 4 nights surrounded by breathtaking red rock mountains and energy vortexes of Sedona, Arizona. EmpowerU will help you reconnect with yourself and tap into your inner truth and power. You'll have the opportunity to disconnect from the distractions of everyday life and focus on your personal growth and well-being.

### Activities Include:
- Yoga
- Meditation
- Breathwork
- Journaling
- Ice baths
- Ecstatic dance
- Hiking
- Sound baths
- Sauna
- Conscious conversations
- Empowering workshops

### Other Opportunities include:
- Connect with like-minded women
- Experience transformative workshops and classes
- Explore, hike, and take in the breathtaking views of Sedona's red rocks
- Cook and nourish your body/soul with delicious, healthy meals
- Participate in yoga, meditation, breathwork, and ecstatic dance sessions to recharge and rejuvenate your whole beingLearn powerful tools and techniques to shift your mindset and fill up your cup
- Overcome limiting beliefs that are holding you back through guided journaling and energy readings
- Plus ice baths, conscious conversations, sound baths, healing arts and crafts, and so much more

### Your Stay also includes:
- lodging
- meals
- transportation to/from the airport

Don't miss out on this life-changing opportunity and investment in yourself by joining today! You must submit at least a $500 deposit to reserve a spot and start your journey toward a more confident and authentic you! Remaining retreat cost is due a month before the start of the retreat! 

### Investment: 
Practitioner Price: **$2000 Earlybird (Ends 6/17) / $2200 After**

Participant Price: **$2400 Early bird (Ends 6/17) / $2600 After**

*Rooming options vary

*Double occupancy casita available at an additional price @ $300 per person (1 King Bed)

**IF YOU PREFER TO PAY VIA VENMO (@JoEllen Luke) OR ZELLE (Love More Hot Yoga, LLC 702-727-7265) TO AVOID CC FEES; SEND WITH YOUR NAME AND EMPOWERU AS A NOTE**


Have Questions? Please send us an email at theinvitationbyjax@gmail.com or text Jax at 504-908-5736.`,
    gallery: [
      { url: "/images/retreats/empoweru-sedona-retreat-gallery-1.jpg", alt: "EmpowerU" },
      { url: "/images/retreats/empoweru-sedona-retreat-gallery-2.jpg", alt: "EmpowerU" },
      { url: "/images/retreats/empoweru-sedona-retreat-gallery-3.jpg", alt: "EmpowerU" },
      { url: "/images/retreats/empoweru-sedona-retreat-gallery-4.jpg", alt: "EmpowerU" },
      { url: "/images/retreats/empoweru-sedona-retreat-gallery-5.jpg", alt: "EmpowerU" },
      { url: "/images/retreats/empoweru-sedona-retreat-gallery-6.jpg", alt: "EmpowerU" },
      { url: "/images/retreats/empoweru-sedona-retreat-gallery-7.jpg", alt: "EmpowerU" },
      { url: "/images/retreats/empoweru-sedona-retreat-gallery-8.jpg", alt: "EmpowerU" },
    ],
    ctaButtonLabel: "Book Now",
    ctaButtonUrl: "https://www.wellnessliving.com/rs/event/lovemore?k_class=915306&k_class_tab=39794",
  },
  {
    name: "ROOTED",
    subtitle: "A Rainforest Experience",
    slug: "rooted-costa-rica-retreat",
    location: "Costa Rica",
    startDate: "2026-10-03",
    endDate: "2026-10-09",
    flyerImage: "/images/retreats/rooted-costa-rica-retreat-flyer.jpg",
    headerImage: "/images/retreats/rooted-costa-rica-retreat-header.jpg",
    body: `This retreat will take place at Finca Luna Nueva Lodge in the beautiful rainforest of Costa Rica. Take a journey into the rainforest of Costa Rica to unveil your highest potential. Awaken your healing journey through breath work, yoga, sound, lymphatic releases, nervous system resets, adventure, and more! This retreat offers you the opportunity to move and raise your awareness to a higher way of being, meet challenges for personal growth, and embody the truth of who you are. 

Our 7 Day/6 Night retreat will be spent offering you opportunities to deepen your connection with your higher self and take tools home with you to ensure you can continue to tap into your infinite potential. This is an all levels retreat with opportunities for multiple modalities of movement and body biohacking. 

We will enjoy delicious, locally grown organic cuisine prepared from the farm we are staying on.   

### Retreat price includes:
- Transportation from and to the airport (within given timeframe)
- Room stay at the farm
- 2/3 daily movement practices (flow, yin, restorative, soundbath, Nidra, roll outs, lymphatic drainage, facial conditioning, vagus nerve reset )
- 3 meals a day
- Meditations
- Breathwork
- Farm tour
- Cacao tour and ceremony
- Ecstatic dance
- Waterfall tour
- Nature hikes
- Free time
- Ice bath
- Pool workouts

### Exlcudes:
- International Airfare
- Private sessions
- Massage/Bodywork
- Your own excursions not included with this retreat
- 1 night Dinner in town
- Alcoholic Beverages

Private/Single Person: **$2350 (Earlybird) / $2500**

Shared/2Person: **$1950pp (Earlybird) / $2200pp**

Shared/3-5 Person: **$1800 (Earlybird) / $2000pp**

***$500 deposit/Retaining Fee per person is refundable until Feb 2026, non-refundable after Feb 2026 to book spot.  Earlybird pricing ends April 15th.  Total must be paid in full by April 15th to receive Earlybird price point. Payment plans available. 

Call 985-900-2468 for more information`,
    gallery: [],
    ctaButtonLabel: "Book Now",
    ctaButtonUrl: "https://www.wellnessliving.com/rs/event/lovemore?k_class=489371&k_class_tab=39794",
  },
];
