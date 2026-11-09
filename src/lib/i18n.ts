// Textos del sitio en el servidor. La fuente sigue siendo public/lang/es.js y en.js
// (cada idioma con su propio texto); aquí solo se leen para escribir el HTML de cada página.
import esSrc from '../../public/lang/es.js?raw';
import enSrc from '../../public/lang/en.js?raw';

export type Lang = 'es' | 'en';
export const LANGS: Lang[] = ['es', 'en'];
export const DEFAULT_LANG: Lang = 'es';
export const SITE = 'https://www.sebasblack.com';

/** Código para hreflang y og:locale. */
export const LOCALE: Record<Lang, { hreflang: string; og: string }> = {
  es: { hreflang: 'es', og: 'es_PE' },
  en: { hreflang: 'en', og: 'en_US' },
};

// es.js y en.js son `window.TRANSLATIONS = { ... }`: se evalúan con un window falso.
const load = (src: string): Record<string, string> => {
  const win: { TRANSLATIONS?: Record<string, string> } = {};
  new Function('window', src)(win);
  return win.TRANSLATIONS ?? {};
};
const DICT: Record<Lang, Record<string, string>> = { es: load(esSrc), en: load(enSrc) };

/** Texto de una clave. Si falta en un idioma, el build falla para que no salga una página a medias. */
export function t(lang: Lang, key: string): string {
  const value = DICT[lang][key];
  if (value === undefined) throw new Error(`Falta la clave "${key}" en public/lang/${lang}.js`);
  return value;
}

/** El texto en el idioma de la página, para campos { es, en } de los case.yaml. */
export const pick = <V>(lang: Lang, value: { es: V; en: V }): V => value[lang];

/** Ruta en el idioma pedido: /projects/ → /en/projects/. */
export const localePath = (lang: Lang, path: string) => (lang === DEFAULT_LANG ? path : `/${lang}${path}`);

/** Quita el prefijo de idioma: /en/projects/ → /projects/. */
export const basePath = (path: string) => path.replace(/^\/en(?=\/|$)/, '') || '/';

export const otherLang = (lang: Lang): Lang => (lang === 'es' ? 'en' : 'es');

/** getStaticPaths para páginas con [...lang]: "/" en español y "/en/" en inglés. */
export const langPaths = () =>
  LANGS.map((lang) => ({ params: { lang: lang === DEFAULT_LANG ? undefined : lang }, props: { lang } }));
