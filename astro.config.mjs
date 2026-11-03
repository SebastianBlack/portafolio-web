// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.sebasblack.com',
  // El case study de KuyraPet es un link oculto: no va en el sitemap
  integrations: [sitemap({ filter: (page) => !page.includes('kuyrapet-coderhouse') })],
});
