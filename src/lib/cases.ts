import { getCollection, type CollectionEntry } from 'astro:content';
import { localePath, type Lang } from './i18n';

export type Case = CollectionEntry<'cases'>;
export type { Lang };
type T = { es: string; en: string };

const byOrder = (a: Case, b: Case) => a.data.order - b.data.order;

/** Casos que se generan como página (published + hidden). */
export async function getBuiltCases() {
  return (await getCollection('cases', (c) => c.data.status !== 'draft')).sort(byOrder);
}

/** Casos visibles en la portada, los listados y "siguiente proyecto". */
export async function getListedCases() {
  return (await getCollection('cases', (c) => c.data.status === 'published')).sort(byOrder);
}

export const caseUrl = (c: Case, lang: Lang = 'es') => localePath(lang, `/projects/${c.id}/`);
export const mediaUrl = (c: Case, file: string) => c.data.images + file;
export const isVideo = (src: string) => /\.mp4$/i.test(src);

/** Etiqueta de categoría para filtrar: product | branding (mismos tags que usa el menú). */
export const caseTag = (c: Case) => (c.data.type === 'producto' ? 'product' : 'branding');

/**
 * Textos ES/EN para el botón que cambia el idioma en el navegador (public/js/i18n.js).
 * Hoy solo lo usa KuyraPet, que no tiene versión en inglés.
 */
export class Dict {
  es: Record<string, string> = {};
  en: Record<string, string> = {};
  add(key: string, value: T) {
    this.es[key] = value.es;
    this.en[key] = value.en;
    return key;
  }
}

/** Título y categoría de los casos listados, para el "siguiente proyecto" de KuyraPet. */
export function cardDict(cases: Case[], dict = new Dict()) {
  for (const c of cases) {
    dict.add(`project.${c.id}.title`, c.data.title);
    dict.add(`project.${c.id}.category`, c.data.category);
    dict.add(`project.${c.id}.card-alt`, c.data.card.alt ?? c.data.title);
  }
  return dict;
}

/** Datos mínimos que usan los scripts del sitio (estela de imágenes de la portada y KuyraPet). */
export function projectsGlobal(cases: Case[]) {
  return cases.map((c) => ({
    id: c.id,
    tags: [caseTag(c)],
    url: caseUrl(c),
    trail: c.data.card.trail.map((f) => mediaUrl(c, f)),
    published: true,
  }));
}
