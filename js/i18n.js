(function () {
  const SUPPORTED = ['es', 'en'];
  const DEFAULT   = 'es';

  function getLang() {
    const stored = localStorage.getItem('lang');
    if (stored && SUPPORTED.includes(stored)) return stored;
    return DEFAULT;
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
  }

  function loadLang(lang, callback) {
    const existing = document.querySelector(`script[data-lang="${lang}"]`);
    if (existing) { callback(window.TRANSLATIONS); return; }

    const script = document.createElement('script');
    script.src        = `/lang/${lang}.js`;
    script.dataset.lang = lang;
    script.onload     = () => callback(window.TRANSLATIONS);
    script.onerror    = () => { if (lang !== DEFAULT) loadLang(DEFAULT, callback); };
    document.head.appendChild(script);
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    loadLang(lang, applyTranslations);

    document.querySelectorAll('[data-lang-toggle]').forEach(el => {
      el.textContent = el.dataset.langToggle;
      el.dataset.langToggle = lang === 'es' ? 'ES' : 'EN';
    });
  }

  function wireLangToggle(lang) {
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.textContent = lang === 'es' ? 'EN' : 'ES';
      btn.onclick = function () {
        const next = getLang() === 'es' ? 'en' : 'es';
        setLang(next);
        document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
          b.textContent = next === 'es' ? 'EN' : 'ES';
        });
      };
    });
  }

  function init() {
    const lang = getLang();
    document.documentElement.lang = lang;
    loadLang(lang, function (t) {
      applyTranslations(t);
      wireLangToggle(lang);
    });
  }

  window.i18n = { getLang, setLang, init };
  init();
})();
