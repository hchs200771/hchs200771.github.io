// llms.txt／llms-full.txt 的共用邏輯（格式參考 https://llmstxt.org/）。
// 由內容集合自動產生，新增文章或作品不用另外維護。
import { getCollection } from 'astro:content';
import { SITE } from './consts';

export async function loadContent() {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  const projects = (await getCollection('portfolio')).sort((a, b) => a.data.order - b.data.order);
  return { posts, projects };
}

export const absolute = (path: string, site: URL) => new URL(path, site).toString();

export function header(site: URL) {
  return [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `作者：${SITE.author}（後端工程師出身的 AI Coding 教練）。網站語言：繁體中文（台灣）。`,
    '',
    '## 服務項目',
    '',
    '- 接案開發：網站、後端 API、自動化工具、資料處理',
    '- AI Coding 教學與諮詢',
    '',
    '## 主要頁面',
    '',
    `- [關於我](${absolute('/about/', site)})：技術背景與服務項目`,
    `- [聯絡](${absolute('/contact/', site)})：LINE 官方帳號、Email 與社群媒體連結`,
    `- [RSS](${absolute('/rss.xml', site)})：部落格文章訂閱`,
    `- [完整內容](${absolute('/llms-full.txt', site)})：所有文章與作品的全文，適合一次讀取`,
  ].join('\n');
}

/** MDX 的 import 與互動元件對純文字讀者沒有意義，換成一句說明 */
export function toPlainMarkdown(body: string) {
  return body
    .replace(/^import .+$/gm, '')
    .replace(/^<([A-Z]\w*)[^>]*\/>$/gm, '（此處為互動示範，請到原文頁面查看）')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
