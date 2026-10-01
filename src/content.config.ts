import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // 內容有實質更新時填寫，會成為結構化資料的 dateModified 與頁面上的「更新於」
    updatedDate: z.coerce.date().optional(),
    // 分享預覽圖（public/ 底下的路徑，建議 1200×630），沒填就用全站預設圖
    cover: z.string().optional(),
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
    // GitHub repo 連結
    repo: z.string().url().optional(),
    // 私人接案:不放 Demo 與 repo,顯示「私人接案」標示
    client: z.boolean().default(false),
    // 放在 public/images/ 下的截圖路徑,例如 /images/project-a.svg
    cover: z.string(),
    tags: z.array(z.string()).default([]),
    // 數字越小排越前面
    order: z.number().default(99),
  }),
});

export const collections = { blog, portfolio };
