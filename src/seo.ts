// 結構化資料（JSON-LD）的共用片段。搜尋引擎與 AI 搜尋靠這些資料理解「這頁是什麼、誰寫的、屬於哪裡」。
import { SITE } from './consts';

/** 全站唯一的作者實體；其他結構化資料用 @id 指回這裡，讓搜尋引擎知道是同一個人 */
export function personId(site: URL) {
  return new URL('/#person', site).toString();
}

export function authorRef(site: URL) {
  return { '@type': 'Person', '@id': personId(site), name: SITE.author, url: new URL('/about/', site).toString() };
}

/** 麵包屑：例如 首頁 › 部落格 › 文章標題 */
export function breadcrumbLd(site: URL, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.path, site).toString(),
    })),
  };
}
