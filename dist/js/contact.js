// ─────────────────────────────────────────────────────────────
//  CONTACT — Single Source of Truth
// ─────────────────────────────────────────────────────────────
//  Cambiá UNA línea acá para actualizar todos los CTAs del sitio.
//  Cada <a data-cta="whatsapp"> recibe el href correcto al cargar.
//  El href hardcoded en HTML actúa como fallback (no-JS y SEO).
// ─────────────────────────────────────────────────────────────

window.CONTACT = Object.freeze({
  whatsapp:        '51992325564',
  whatsappMessage: 'Hola Sebastian, me gustaría conversar sobre un proyecto.',
  instagram:       'https://www.instagram.com/sebasblack.pe/',
  linkedin:        'https://www.linkedin.com/in/sebastianblack/',
});

(function () {
  const C = window.CONTACT;
  const HREFS = {
    whatsapp:  `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(C.whatsappMessage)}`,
    instagram: C.instagram,
    linkedin:  C.linkedin,
  };

  function apply() {
    document.querySelectorAll('[data-cta]').forEach(el => {
      const key = el.dataset.cta;
      if (!HREFS[key]) return;
      el.href = HREFS[key];
      if (!el.hasAttribute('target')) el.target = '_blank';
      if (!el.hasAttribute('rel'))    el.rel    = 'noopener';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();
