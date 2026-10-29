import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articulos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articulos' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    key: z.string(),
    categories: z.array(z.string()).default([]),
    image: z.string().optional(),
    audio: z.string().optional(),
    description: z.string().optional(),
    review: z.boolean().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { articulos };
