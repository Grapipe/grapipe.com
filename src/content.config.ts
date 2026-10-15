import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Posts live in src/content/blog/<lang>/<slug>.md
// or src/content/blog/<lang>/<slug>/index.md (to keep images next to the post).
const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/blog",
    generateId: ({ entry }) => entry.replace(/\.md$/, "").replace(/\/index$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // Same value on the Korean and English versions of one post links them together.
    translationKey: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
