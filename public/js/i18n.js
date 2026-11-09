(function () {
  const SUPPORTED = ['es', 'en'];
  const DEFAULT   = 'es';

  function getLang() {
    try {
      const stored = localStorage.getItem('lang');
      if (stored && SUPPORTED.includes(stored)) return stored;
    } catch (e) {}
    return document.documentElement.lang === 'en' ? 'en' : DEFAULT;
  }

  function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (translations[key] !== undefined) el.innerHTML = translations[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (translations[key] !== undefined) el.placeholder = translations[key];
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.dataset.i18nTitle;
      if (translations[key] !== undefined) el.title = translations[key];
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.dataset.i18nAlt;
      if (translations[key] !== undefined) el.alt = translations[key];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.dataset.i18nAria;
      if (translations[key] !== undefined) el.setAttribute('aria-label', translations[key]);
    });
  }

  const CACHE = {};

  function loadLang(lang, callback) {
    if (CACHE[lang]) {
      window.TRANSLATIONS = CACHE[lang];
      callback(CACHE[lang]);
      return;
    }
    const script = document.createElement('script');
    script.src          = `/lang/${lang}.js`;
    script.dataset.lang = lang;
    script.onload  = () => {
      // Suma los textos de los casos (los inyecta SiteData.astro desde src/content/cases).
      const cases = (window.CASE_I18N || {})[lang] || {};
      window.TRANSLATIONS = Object.assign({}, window.TRANSLATIONS, cases);
      CACHE[lang] = window.TRANSLATIONS;
      callback(CACHE[lang]);
    };
    script.onerror = () => { if (lang !== DEFAULT) loadLang(DEFAULT, callback); };
    document.head.appendChild(script);
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    try { localStorage.setItem('lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
    loadLang(lang, applyTranslations);

    document.querySelectorAll('[data-lang-toggle]').forEach(el => {
      el.textContent = el.dataset.langToggle;
      el.dataset.langToggle = lang === 'es' ? 'ES' : 'EN';
    });
  }

  // El botón muestra el idioma al que cambia y lo anuncia en ese idioma.
  function labelLangBtn(btn, current) {
    const target = current === 'es' ? 'en' : 'es';
    btn.textContent = target.toUpperCase();
    btn.lang = target;
    btn.setAttribute('aria-label', target === 'en' ? 'Switch to English' : 'Cambiar a español');
  }

  function wireLangToggle(lang) {
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      labelLangBtn(btn, lang);
      btn.onclick = function () {
        const next = getLang() === 'es' ? 'en' : 'es';
        setLang(next);
        document.querySelectorAll('[data-lang-btn]').forEach(function (b) { labelLangBtn(b, next); });
      };
    });
  }

  function init() {
    const start = () => {
      const lang = getLang();
      document.documentElement.lang = lang;
      loadLang(lang, function (t) {
        applyTranslations(t);
        wireLangToggle(lang);
      });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
      start();
    }
  }

  window.i18n = { getLang, setLang, init };
  init();
})();
