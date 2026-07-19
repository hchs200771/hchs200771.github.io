// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: 買好網域後,把 site 換成你的正式網址(sitemap 與 canonical 都依賴它)
export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap()],
});
