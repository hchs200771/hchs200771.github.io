---
title: 讓 Google 和 AI 都讀得懂你的網站：個人網站的 SEO 與 AEO 實作
description: 從一次自我健檢開始，替這個 Astro 個人網站補上分享預覽圖、BlogPosting 結構化資料、RSS，以及自動產生的 llms.txt 與 llms-full.txt。每一項都說明為什麼要做、怎麼做、怎麼驗證。
pubDate: 2026-10-01
tags: [SEO, AEO, Astro, 網站經營]
---

以前寫網站，SEO 的目標很單純：讓 Google 搜得到。現在多了一群讀者：ChatGPT、Claude、Perplexity 這些 AI 搜尋工具。使用者不再點十個藍色連結，而是直接問 AI，AI 讀完一堆網頁後整理出答案，最後附上幾個來源。

**AEO（Answer Engine Optimization，答案引擎最佳化）** 要處理的就是這件事：讓 AI 讀得懂你的網站、信得過你的內容，並且在回答裡引用你。

這篇記錄我替這個網站做的一次健檢。先講結論：基本功其實都有，但有幾個地方對「被分享」和「被 AI 引用」不夠友善。下面一項一項說明。

## 一、健檢：原本做了什麼、缺了什麼

這個網站用 Astro 建置，部署在 GitHub Pages。檢查完的結果：

| 項目 | 原本 | 說明 |
| --- | --- | --- |
| 語言標示、標題、描述 | ✅ | 每頁都有 `lang="zh-TW"`、`<title>`、`description` |
| 標準網址（canonical） | ✅ | 避免同一頁被當成好幾頁 |
| Sitemap、robots.txt | ✅ | 所有爬蟲都允許，也指向 sitemap |
| 作者與文章結構化資料 | ⚠️ | 有，但文章資料太簡略，作品集頁完全沒有 |
| 分享預覽圖 | ❌ | 貼到 LINE、Facebook 沒有圖 |
| 文章的發佈時間標示 | ❌ | 社群平台把文章當一般網頁 |
| RSS 訂閱 | ❌ | 沒有 |
| llms.txt | ⚠️ | 有，但是手寫的，沒有列出任何一篇文章 |

下面依照「影響大小」的順序補起來。

## 二、分享預覽圖：被分享時的第一印象

把網址貼到 LINE 或 Facebook，平台會讀網頁上的 Open Graph 標籤來產生預覽卡片。原本網站有標題和描述，但沒有 `og:image`，所以卡片上只有一行字，很不起眼。

改法是讓版型（`Base.astro`）接受 `image` 參數，沒給就用全站預設圖：

```astro
<meta property="og:type" content={type} />
<meta property="og:image" content={imageUrl} />
<meta property="og:image:alt" content={imageAlt} />
{publishedTime && (
  <meta
    property="article:published_time"
    content={publishedTime.toISOString()}
  />
)}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content={imageUrl} />
```

幾個細節：

- **圖片網址要是完整網址**，社群平台不會幫你補網域，所以用 `new URL(image, Astro.site)` 組出絕對路徑
- **預設圖的尺寸用 1200×630**，這是 Facebook、LINE、X 都能完整顯示的比例
- **作品集頁直接用作品截圖當分享圖**；但如果封面是 SVG 就改用預設圖，因為多數社群平台不支援 SVG
- **文章頁的 `og:type` 改成 `article`**，再加上 `article:published_time`，平台就知道這是一篇有發佈時間的文章

## 三、結構化資料：直接告訴機器「這頁是什麼」

搜尋引擎和 AI 可以從內文猜出一頁在講什麼，但猜就可能猜錯。**結構化資料（JSON-LD）** 是把關鍵資訊用固定格式直接寫給機器看：這是一篇文章、標題是什麼、誰寫的、什麼時候發佈、屬於哪個網站。

原本文章頁只有最基本的 `Article`，沒有網址、圖片和更新日期。這次改成更精確的 `BlogPosting`：

```ts
const postingLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  '@id': `${url}#article`,
  headline: title,
  description,
  url,
  mainEntityOfPage: url,
  image: new URL(image, site).toString(),
  datePublished: pubDate.toISOString(),
  dateModified: (updatedDate ?? pubDate).toISOString(),
  author: authorRef(site),
  publisher: authorRef(site),
  keywords: tags.join(', '),
  inLanguage: 'zh-TW',
};
```

這裡最值得一提的是 `authorRef`。全站每一頁都有一份 `Person` 資料描述作者，我給它一個固定的 `@id`（`/#person`），文章、作品集裡的作者都用這個 `@id` 指回去：

```ts
export function authorRef(site: URL) {
  return {
    '@type': 'Person',
    '@id': personId(site),
    name: SITE.author,
    url: new URL('/about/', site).toString(),
  };
}
```

這樣搜尋引擎就知道「每一篇文章的作者，和首頁介紹的那個人是同一個人」，而且這個人有 GitHub、Facebook 等社群連結可以佐證。對 AI 來說，**能確認作者是誰、有什麼背景**，是判斷內容可不可信的重要依據（也就是 Google 常說的 E-E-A-T：經驗、專業、權威、可信）。

其他頁面也補上對應的類型：

- **首頁**：`WebSite`，說明網站名稱、語言、作者
- **作品集頁**：`CreativeWork`，附上作品截圖、標籤，已上線的作品用 `sameAs` 標出實際網址
- **文章與作品頁**：`BreadcrumbList` 麵包屑（首頁 › 部落格 › 文章標題），讓搜尋結果顯示網站層級，也讓 AI 知道這頁在網站裡的位置

### 結構化資料要和畫面一致

結構化資料不能只寫給機器看，畫面上也要看得到相同的資訊，否則可能被視為不實標記。所以文章頁的標題下方，現在明確顯示作者和日期，日期用 `<time>` 標籤包起來：

```astro
<p class="meta">
  <a href="/about/" rel="author">{SITE.author}</a>
  {' · '}
  <time datetime={pubDate.toISOString()}>{formatDate(pubDate)}</time>
</p>
```

另外在內容設定裡加了選填的 `updatedDate`：文章有實質更新時填上，就會同時出現在畫面上的「更新於」和結構化資料的 `dateModified`。AI 回答問題時很在意資訊新不新，有明確的更新日期比沒有好。

## 四、RSS：最古老、但依然有效的訂閱格式

RSS 看起來是上個時代的東西，但它其實是**最容易被機器讀取的文章清單**：標題、摘要、日期、網址、分類，全部是標準格式。閱讀器、內容聚合服務，以及部分 AI 爬蟲都會用它來發現新內容。

Astro 官方有 `@astrojs/rss`，幾行就能產生：

```ts
export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
  });
}
```

最後在每一頁的 `<head>` 加上 `<link rel="alternate" type="application/rss+xml">`，讓瀏覽器和爬蟲知道訂閱網址在哪。

## 五、llms.txt：寫給 AI 的網站導覽

`llms.txt` 是一個新提出的慣例（[llmstxt.org](https://llmstxt.org/)）：在網站根目錄放一份 Markdown，用 AI 好讀的方式介紹網站內容。它還不是正式標準，各家 AI 是否採用也不一定，但成本很低，而且對使用 AI 寫程式工具、會主動抓網頁的人很實用。

原本網站已經有一份 `llms.txt`，但它是手寫的靜態檔，只寫了「作品集」「部落格」幾個大分類，**沒有列出任何一篇文章或作品**，連結也是相對路徑。每新增一篇文章就得記得回來改，遲早會忘記。

這次改成從內容集合自動產生（以下是簡化過的版本）：

```ts
export async function GET(context: APIContext) {
  const site = context.site!;
  const { posts, projects } = await loadContent();

  const body = [
    header(site),
    '',
    '## 作品集',
    '',
    ...projects.map((p) => {
      const url = absolute(`/portfolio/${p.id}/`, site);
      return `- [${p.data.title}](${url})：${p.data.description}`;
    }),
    '',
    '## 部落格文章',
    '',
    ...posts.map((p) => {
      const url = absolute(`/blog/${p.id}/`, site);
      return `- [${p.data.title}](${url})：${p.data.description}`;
    }),
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

另外多了一份 **`llms-full.txt`**：所有文章和作品介紹的全文，接在同一個檔案裡。AI 只要讀一次就能掌握整個網站，不用一頁一頁解析 HTML、略過導覽列和頁尾。

有一個小細節：部分文章是 MDX，裡面有 `import` 和互動元件，純文字讀者看不懂。所以產生全文時，會把這些換成一句「此處為互動示範，請到原文頁面查看」：

```ts
export function toPlainMarkdown(body: string) {
  return body
    .replace(/^import .+$/gm, '')
    .replace(/^<([A-Z]\w*)[^>]*\/>$/gm, '（此處為互動示範，請到原文頁面查看）')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
```

## 六、要不要擋 AI 爬蟲？

有些網站會在 `robots.txt` 裡擋掉 GPTBot、ClaudeBot 這類 AI 爬蟲，不讓內容被拿去訓練。這是合理的選擇，但對個人品牌網站來說，我的考量剛好相反：**我希望別人問 AI「誰在教 AI Coding」時，AI 知道我**。所以 `robots.txt` 維持全部允許。

如果你的內容是付費課程、獨家報告這類不想被摘要的東西，就該另外評估。重點是這是一個「有意識的決定」，而不是不知道有這回事。

## 七、怎麼驗證做對了

改完之後不要只看程式碼，用工具實際驗證：

- **結構化資料**：把網址貼到 Google 的[複合式搜尋結果測試](https://search.google.com/test/rich-results)，確認 BlogPosting、BreadcrumbList 都被正確解析、沒有錯誤
- **分享預覽**：用 Facebook 的[分享偵錯工具](https://developers.facebook.com/tools/debug/)看卡片長什麼樣子；LINE 可以直接傳給自己看預覽
- **RSS 與 llms.txt**：直接打開 `/rss.xml`、`/llms.txt`、`/llms-full.txt`，確認新文章有出現、連結都是完整網址
- **最直接的方法**：把文章網址丟給 AI，問它「這篇文章誰寫的、什麼時候發佈、在講什麼」，看它答不答得出來

## 小結：個人網站的 SEO／AEO 檢查清單

1. 每頁都有清楚的**標題、描述、語言、標準網址**
2. 每頁都有**分享預覽圖**，文章頁標成 `article` 並附發佈時間
3. 用**結構化資料**說明頁面類型，並用固定的 `@id` 把所有內容連回同一個作者
4. 結構化資料的內容，**畫面上也要看得到**
5. 提供 **RSS**，讓機器用標準格式發現新文章
6. 用**自動產生**的 `llms.txt`／`llms-full.txt` 給 AI 一份導覽和全文，不要手動維護
7. 對 AI 爬蟲的態度做**有意識的決定**
8. 改完用工具**實際驗證**，而不是只看程式碼

這些設定大多一次做好就不用再管，之後每寫一篇文章，分享圖、結構化資料、RSS、llms.txt 都會自動跟上。想替自己的網站做一樣的健檢，歡迎透過[聯絡頁](/contact/)找我聊。
