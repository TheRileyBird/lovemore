export interface SpecialtyEvent {
  name: string;
  type: string;
  date: string;
  description: string;
  image: string | null;
}

export const specialtyEvents: SpecialtyEvent[] = [
  {
    name: "Aerial Yoga",
    type: "special-event",
    date: "2026-04-17",
    description: `Join Danielle for a fun and supportive aerial yoga class designed for all levels from first-timers to seasoned yogis.`,
    image: "/images/events/aerial-yoga.jpg",
  },
  {
    name: "Ecstatic Dance Event",
    type: "special-event",
    date: "2026-05-01",
    description: `An evening of movement in a welcoming, judgment-free space. Let the rhythm guide you to self-expression, connection, and release. 
No experience needed!
$15`,
    image: "/images/events/ecstatic-dance-event.png",
  },
  {
    name: "Inner-G",
    type: "community-gathering",
    date: "2026-05-09",
    description: `You are invited into a living, breathing circle of beauty, expression, and remembrance- where daughters, mothers, grandmothers, aunties, and women of all ages come together.
Saturday May 9th at 4pm - $33`,
    image: "/images/events/inner-g.png",
  },
  {
    name: "Gong Soundbath",
    type: "special-event",
    date: "2026-05-30",
    description: `Experience the power of gongs, sound bowls and other instruments as you relax and enjoy the powerful healing benefits.
Join Joe Saturday, May 30th @ 6:00 pm
$35`,
    image: "/images/events/gong-soundbath.png",
  },
  {
    name: "Yoga on the Patio @ Meribo",
    type: "special-event",
    date: "2026-05-31",
    description: `Join us at Meribo for a donation based class and outdoor flow. All donations will go to NAMI! 
Sunday, May 31st @ 9:00 am - Donations based`,
    image: "/images/events/yoga-on-the-patio-meribo.png",
  },
  {
    name: "Kids Camp",
    type: "special-event",
    date: "2026-06-22",
    description: `Our camp offers a blend of activities, including movement exercises, crafts, cooking, gardening, social-emotional development, mindfulness, and plenty of playtime, encouraging kids to explore their potential.

Monday, June 22nd- Friday, June 26th
9:00 AM - 2:00 PM`,
    image: "/images/events/kids-camp.png",
  },
];
