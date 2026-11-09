// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, existsSync } from 'node:fs';

// Casos que no van al sitemap: los que no están en status "published" (hidden o draft).
const CASES_DIR = './src/content/cases';
const unlistedCases = existsSync(CASES_DIR)
  ? readdirSync(CASES_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(`${CASES_DIR}/${d.name}/case.yaml`))
      .filter((d) => {
        const yaml = readFileSync(`${CASES_DIR}/${d.name}/case.yaml`, 'utf8');
        return !/^status:\s*published\s*(#.*)?$/m.test(yaml);
      })
      .map((d) => `/projects/${d.name}/`)
  : [];

// https://astro.build/config
export default defineConfig({
  site: 'https://www.sebasblack.com',
  integrations: [
    sitemap({
      // Cada URL lista su versión en el otro idioma (/en/...) para Google.
      i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } },
      filter: (page) =>
        // El case study de KuyraPet es un link oculto: no va en el sitemap
        !page.includes('kuyrapet-coderhouse') &&
        !unlistedCases.some((path) => page.endsWith(path)),
    }),
  ],
});
