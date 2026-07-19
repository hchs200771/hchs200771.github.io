import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // 已上線的作品填網址;還沒部署的留空,只放截圖
    url: z.string().url().optional(),
    // 放在 public/images/ 下的截圖路徑,例如 /images/project-a.svg
    cover: z.string(),
    tags: z.array(z.string()).default([]),
    // 數字越小排越前面
    order: z.number().default(99),
  }),
});

export const collections = { blog, portfolio };
