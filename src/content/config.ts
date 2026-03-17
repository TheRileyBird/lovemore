import { defineCollection, z } from 'astro:content';

const teamCollection = defineCollection({
	type: 'content',
	schema: z.object({
		name: z.string(),
		title: z.string(),
		image: z.string(),
		order: z.number().default(100),
		active: z.boolean().default(true)
	})
});

const classesCollection = defineCollection({
	type: 'content',
	schema: z.object({
		name: z.string(),
		type: z.enum(['heated', 'non-heated', 'specialty']),
		image: z.string(),
		description: z.string(),
		order: z.number().default(100),
		active: z.boolean().default(true)
	})
});

const retreatsCollection = defineCollection({
	type: 'content',
	schema: z.object({
		name: z.string(),
		location: z.string(),
		image: z.string(),
		description: z.string(),
		highlights: z.array(z.string()),
		active: z.boolean().default(true)
	})
});

export const collections = {
	team: teamCollection,
	classes: classesCollection,
	retreats: retreatsCollection
};
