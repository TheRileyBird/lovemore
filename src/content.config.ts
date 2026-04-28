import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const teamCollection = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
	schema: z.object({
		name: z.string(),
		title: z.string(),
		image: z.string(),
		order: z.number().default(100),
		active: z.boolean().default(true)
	})
});

const classesCollection = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/classes' }),
	schema: z.object({
		name: z.string(),
		type: z.enum(['heated', 'non-heated', 'specialty', 'healing-room']),
		image: z.string(),
		description: z.string(),
		order: z.number().default(100),
		active: z.boolean().default(true)
	})
});

const retreatsCollection = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/retreats' }),
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
