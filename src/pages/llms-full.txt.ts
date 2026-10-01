// 全站內容的純文字版：AI 一次請求就能讀完所有文章與作品，不必解析 HTML
import type { APIContext } from 'astro';
import { absolute, header, loadContent, toPlainMarkdown } from '../llms';

export async function GET(context: APIContext) {
  const site = context.site!;
  const { posts, projects } = await loadContent();

  const sections = [
    header(site),
    ...projects.map((p) =>
      [
        '',
        '---',
        '',
        `# 作品：${p.data.title}`,
        '',
        `網址：${absolute(`/portfolio/${p.id}/`, site)}`,
        ...(p.data.url ? [`線上網站：${p.data.url}`] : []),
        `標籤：${p.data.tags.join('、')}`,
        '',
        `> ${p.data.description}`,
        '',
        toPlainMarkdown(p.body ?? ''),
      ].join('\n'),
    ),
    ...posts.map((p) =>
      [
        '',
        '---',
        '',
        `# 文章：${p.data.title}`,
        '',
        `網址：${absolute(`/blog/${p.id}/`, site)}`,
        `發佈日期：${p.data.pubDate.toISOString().slice(0, 10)}`,
        `標籤：${p.data.tags.join('、')}`,
        '',
        `> ${p.data.description}`,
        '',
        toPlainMarkdown(p.body ?? ''),
      ].join('\n'),
    ),
  ];

  return new Response(sections.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
