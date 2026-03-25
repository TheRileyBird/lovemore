import { defineCollection, z } from 'astro:content';

const team = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    image: z.string(),
    order: z.number().default(100),
    active: z.boolean().default(true),
  }),
});

const classes = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    type: z.enum(['heated', 'non-heated', 'specialty']),
    image: z.string(),
    order: z.number().default(100),
    active: z.boolean().default(true),
  }),
});

const retreats = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    location: z.string(),
    image: z.string(),
    highlights: z.array(z.string()),
    active: z.boolean().default(true),
  }),
});

export const collections = {
  team,
  classes,
  retreats,
};
