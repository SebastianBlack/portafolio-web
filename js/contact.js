// ─────────────────────────────────────────────────────────────
//  CONTACT — Single Source of Truth
// ─────────────────────────────────────────────────────────────
//  Cambiá UNA línea acá para actualizar todos los CTAs del sitio.
//  Cada <a data-cta="whatsapp"> recibe el href correcto al cargar.
//  El href hardcoded en HTML actúa como fallback (no-JS y SEO).
// ─────────────────────────────────────────────────────────────

window.CONTACT = Object.freeze({
  whatsapp: '51992325564',
  message:  'Hola Sebastian, me gustaría conversar sobre un proyecto.',
});

(function () {
  const WA  = window.CONTACT.whatsapp;
  const MSG = encodeURIComponent(window.CONTACT.message);
  const HREF = `https://wa.me/${WA}?text=${MSG}`;

  function apply() {
    document.querySelectorAll('[data-cta="whatsapp"]').forEach(el => {
      el.href = HREF;
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
