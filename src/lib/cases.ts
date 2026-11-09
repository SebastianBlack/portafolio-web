import { getCollection, type CollectionEntry } from 'astro:content';

export type Case = CollectionEntry<'cases'>;
export type Lang = 'es' | 'en';
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

export const caseUrl = (c: Case) => `/projects/${c.id}/`;
export const mediaUrl = (c: Case, file: string) => c.data.images + file;
export const isVideo = (src: string) => /\.mp4$/i.test(src);

/** Etiqueta de categoría para filtrar: product | branding (mismos tags que usa el menú). */
export const caseTag = (c: Case) => (c.data.type === 'producto' ? 'product' : 'branding');

/**
 * Diccionario de traducciones de un caso. La página se genera en español y el
 * botón ES/EN cambia los textos con estas claves (ver public/js/i18n.js).
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

/** Título y categoría de todos los casos listados, para tarjetas y "siguiente proyecto". */
export function cardDict(cases: Case[], dict = new Dict()) {
  for (const c of cases) {
    dict.add(`project.${c.id}.title`, c.data.title);
    dict.add(`project.${c.id}.category`, c.data.category);
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
