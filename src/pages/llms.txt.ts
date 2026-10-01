// 給 AI 看的網站導覽：列出每篇文章與作品的網址與一句話摘要
import type { APIContext } from 'astro';
import { absolute, header, loadContent } from '../llms';

export async function GET(context: APIContext) {
  const site = context.site!;
  const { posts, projects } = await loadContent();

  const body = [
    header(site),
    '',
    '## 作品集',
    '',
    ...projects.map((p) => `- [${p.data.title}](${absolute(`/portfolio/${p.id}/`, site)})：${p.data.description}`),
    '',
    '## 部落格文章',
    '',
    ...posts.map(
      (p) =>
        `- [${p.data.title}](${absolute(`/blog/${p.id}/`, site)})（${p.data.pubDate.toISOString().slice(0, 10)}）：${p.data.description}`,
    ),
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
