/**
 * Antigravity UI & 3D Spatial Motion Engine
 * Telangana Model School & Junior College, Somaram
 * Specializing in Spatial Depth, 3D Tilt Physics, Weightlessness & Glassmorphism
 */
'use strict';

(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Inject Ambient Spatial Mesh if not already present
  function initAmbientMesh() {
    if (prefersReduced || document.querySelector('.ag-ambient-mesh')) return;
    const mesh = document.createElement('div');
    mesh.className = 'ag-ambient-mesh';
    mesh.setAttribute('aria-hidden', 'true');

    const orb1 = document.createElement('div');
    orb1.className = 'ag-orb ag-orb-1';

    const orb2 = document.createElement('div');
    orb2.className = 'ag-orb ag-orb-2';

    const orb3 = document.createElement('div');
    orb3.className = 'ag-orb ag-orb-3';

    mesh.append(orb1, orb2, orb3);
    document.body.prepend(mesh);
  }

  // 2. Interactive 3D Spatial Tilt Physics
  function setup3DTilt() {
    if (prefersReduced || 'ontouchstart' in window) return;

    const cards = document.querySelectorAll(
      '.faculty-card:not([data-ag-tilt]), .principal-card:not([data-ag-tilt]), .photo-card:not([data-ag-tilt]), .cards .card:not([data-ag-tilt])'
    );

    cards.forEach(card => {
      card.setAttribute('data-ag-tilt', 'true');
      let rafId = null;

      card.addEventListener('mousemove', e => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const deltaX = (x - centerX) / centerX;
          const deltaY = (y - centerY) / centerY;

          const maxTilt = 7; // Max tilt angle in degrees
          const rotateX = -deltaY * maxTilt;
          const rotateY = deltaX * maxTilt;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
          card.style.setProperty('--pointer-x', `${(x / rect.width * 100).toFixed(1)}%`);
          card.style.setProperty('--pointer-y', `${(y / rect.height * 100).toFixed(1)}%`);
        });
      });

      card.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        setTimeout(() => {
          card.style.transition = '';
        }, 400);
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.12s ease-out, box-shadow 0.25s ease';
      });
    });
  }

  // 3. Staggered Entrance Reveal Controller
  function setupStaggeredReveals() {
    if (prefersReduced) return;

    const elements = document.querySelectorAll(
      '.faculty-card:not(.ag-reveal), .photo-card:not(.ag-reveal), .cards .card:not(.ag-reveal), .state-official:not(.ag-reveal)'
    );

    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('ag-in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const staggerDelay = (idx % 6) * 75; // Stagger up to 6 items in view
            setTimeout(() => {
              el.classList.add('ag-in-view');
            }, staggerDelay);
            obs.unobserve(el);
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );

    elements.forEach(el => {
      el.classList.add('ag-reveal');
      observer.observe(el);
    });
  }

  // 4. Subtle Magnetic Pull on Hero & Main CTAs
  function setupMagneticButtons() {
    if (prefersReduced || 'ontouchstart' in window) return;

    const buttons = document.querySelectorAll('.model-text-link:not([data-ag-mag]), .model-home-bulletin .news-pause:not([data-ag-mag])');
    buttons.forEach(btn => {
      btn.setAttribute('data-ag-mag', 'true');
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // 5. Floating Scroll-to-Top Action
  function setupScrollToTop() {
    if (document.querySelector('.ag-scroll-top')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ag-scroll-top';
    btn.setAttribute('aria-label', 'Scroll to top of page');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.append(btn);

    let scrollRaf = null;
    window.addEventListener('scroll', () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        if (window.scrollY > 300) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      });
    }, { passive: true });
  }

  // 6. Mobile Navigation Backdrop & Sheet dismiss
  function setupMobileNavBackdrop() {
    let backdrop = document.querySelector('.ag-nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'ag-nav-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      backdrop.addEventListener('click', () => {
        document.querySelectorAll('.model-nav-panel').forEach(p => p.hidden = true);
        document.querySelectorAll('.model-nav-trigger').forEach(b => b.setAttribute('aria-expanded', 'false'));
        backdrop.classList.remove('visible');
      });
      document.body.append(backdrop);
    }

    const anyOpen = Array.from(document.querySelectorAll('.model-nav-panel')).some(p => !p.hidden);
    if (anyOpen && window.innerWidth <= 768) {
      backdrop.classList.add('visible');
    } else {
      backdrop.classList.remove('visible');
    }
  }

  // 7. Lifecycle bootstrap & reactive updates on tab/content changes
  function refresh() {
    initAmbientMesh();
    setup3DTilt();
    setupStaggeredReveals();
    setupMagneticButtons();
    setupScrollToTop();
    setupMobileNavBackdrop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refresh);
  } else {
    refresh();
  }

  // Observe page shifts and dynamic hash routes (e.g. clicking Faculty or Gallery)
  window.addEventListener('hashchange', () => {
    setTimeout(refresh, 80);
    setTimeout(refresh, 350);
  });

  const observer = new MutationObserver(() => {
    refresh();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
