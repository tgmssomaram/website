// Floating "Apply on Official CGG Portal" button directly above the first (X) icon of the right-hand social rail (see cgg-apply-button.css).
(() => {
  const URL_APPLY = 'https://telanganams.cgg.gov.in/TGMSWEB20/#/';
  let link = null, queued = 0;
  const label = () => (document.documentElement.lang === 'te' ? 'అధికారిక CGG పోర్టల్ లో దరఖాస్తు ↗' : document.documentElement.lang === 'hi' ? 'आधिकारिक CGG पोर्टल पर आवेदन ↗' : 'Apply on Official CGG Portal ↗');
  function place() {
    queued = 0;
    const rail = document.querySelector('.school-social-rail');
    if (!rail) return;
    if (!link) {
      link = document.createElement('a');
      link.className = 'school-cgg-apply';
      link.href = URL_APPLY;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.append(link);
    }
    const text = label();
    if (link.textContent !== text) { link.textContent = text; link.setAttribute('aria-label', text.replace(' \u2197', '') + ' (opens in a new tab)'); }
    // bottom edge sits 6 px above the top of the rail
    link.style.bottom = Math.max(0, Math.round(innerHeight - rail.getBoundingClientRect().top + 6)) + 'px';
  }
  const schedule = () => { if (!queued) queued = setTimeout(place, 60); };
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['lang'] });
  window.addEventListener('resize', schedule);
  schedule();
})();
