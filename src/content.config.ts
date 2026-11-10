import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const research = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/research" }),
  schema: z.object({
    title: z.string().min(5).max(90),
    status: z.enum(["Active", "Ongoing", "Public call"]),
    summary: z.string().min(20).max(240),
    updated: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    externalLinks: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().min(5).max(90),
    description: z.string().min(20).max(240),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { research, blog };
