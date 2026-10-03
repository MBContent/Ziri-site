// Shared: nav toggle, scroll reveal, current page highlight, form handler
document.addEventListener('DOMContentLoaded', () => {

  // Inject logo and mascot from shared assets
  document.querySelectorAll('img[data-asset]').forEach(img => {
    const key = img.dataset.asset;
    if (key === 'logo' && typeof ZIRI_LOGO !== 'undefined') img.src = ZIRI_LOGO;
    if (key === 'icon' && typeof ZIRI_ICON !== 'undefined') img.src = ZIRI_ICON;
    if (key === 'mascot' && typeof ZIRI_MASCOT !== 'undefined') img.src = ZIRI_MASCOT;
  });

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.textContent = open ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = '☰';
    }));
  }

  // Active nav link
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.setAttribute('aria-current', 'page');
  });

  // Scroll reveal (all three variants)
  const revealAll = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window && revealAll.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealAll.forEach(el => obs.observe(el));
  } else {
    revealAll.forEach(el => el.classList.add('is-visible'));
  }

  // Contact / booking form — show success message
  const form = document.getElementById('main-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const msg = document.getElementById('form-msg');
      if (msg) { msg.style.display = 'block'; }
      form.reset();
    });
  }

  // Nav shadow on scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(42,25,31,.12)' : '';
    }, { passive: true });
  }
});
