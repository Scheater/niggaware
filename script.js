'use strict';

/* Activate JS mode (disables the validator-safe no-JS fallback styles) */
document.documentElement.classList.remove('no-js');

(function () {
  const qs  = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initTooltips();
  });

  /* =========================
     Slider (viewport model, no-peek, equal steps)
     ========================= */
  function initSlider() {
    const slider   = qs('#feature-preview');
    if (!slider) return;

    const viewport = qs('.slider-viewport', slider);
    const track    = qs('.slider-track', viewport);
    const slides   = qsa('.slide', track);
    const btnPrev  = qs('.slider-nav.prev', slider);
    const btnNext  = qs('.slider-nav.next', slider);
    const dotsRoot = qs('.slider-dots', slider);

    if (!viewport || !track || !slides.length || !btnPrev || !btnNext || !dotsRoot) return;

    /* Tell CSS how many slides exist -> exact widths, no drift */
    track.style.setProperty('--count', String(slides.length));

    /* Build dots (accessible) */
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.setAttribute('aria-selected', 'true');
      dot.addEventListener('click', () => goTo(i));
      dotsRoot.appendChild(dot);
    });
    const dots = qsa('button', dotsRoot);

    /* Image hints & graceful fallback */
    qsa('img', track).forEach((img, i) => {
      try {
        img.decoding = 'async';
        if (i > 0) img.loading = 'lazy';
        img.setAttribute('draggable', 'false');
      } catch {}
      img.addEventListener('error', () => {
        const px = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        img.src = px;
        img.style.background = 'repeating-linear-gradient(45deg,#1e1e1e,#1e1e1e 10px,#222 10px,#222 20px)';
        img.style.minHeight = '180px';
        img.alt = (img.alt || 'Image') + ' (not loaded)';
      });
    });

    let index = 0;
    let allowTransition = false; // first render without animation
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer = null;

    /* Autoplay every 3s (as requested) */
    const AUTOPLAY_MS = 3000;

    /* Equal percentage step per slide (no peeking/drift) */
    const STEP = 100 / slides.length;

    function render() {
      const pct = (index * STEP).toFixed(5);
      track.style.transition = allowTransition ? 'transform .5s ease-in-out' : 'none';
      track.style.transform  = `translate3d(-${pct}%,0,0)`;

      slides.forEach((el, i) => {
        const active = i === index;
        el.setAttribute('aria-current', active ? 'true' : 'false');
        el.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      dots.forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
    }

    function goTo(i) { index = (i + slides.length) % slides.length; render(); }
    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    /* Controls */
    btnPrev.addEventListener('click', prev);
    btnNext.addEventListener('click', next);

    /* Keyboard navigation (on the whole slider region) */
    if (!slider.hasAttribute('tabindex')) slider.tabIndex = 0;
    slider.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowRight': e.preventDefault(); next(); break;
        case 'ArrowLeft':  e.preventDefault(); prev(); break;
        case 'Home':       e.preventDefault(); goTo(0); break;
        case 'End':        e.preventDefault(); goTo(slides.length - 1); break;
      }
    });

    /* Autoplay with smart pause */
    function start() { if (!prefersReducedMotion) { stop(); timer = setInterval(next, AUTOPLAY_MS); } }
    function stop()  { if (timer) { clearInterval(timer); timer = null; } }

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', () => {
      setTimeout(() => { if (!slider.contains(document.activeElement)) start(); }, 0);
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });

    /* Pause when slider not visible in viewport (optional but nice) */
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) start(); else stop(); }),
      { threshold: 0.25 }
    );
    io.observe(slider);

    /* Touch swipe (LEFT => next, RIGHT => prev) */
    let sx = 0, sy = 0, moved = false;
    track.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; moved = false; stop();
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - sx;
      const dy = e.touches[0].clientY - sy;
      if (Math.abs(dx) > Math.abs(dy)) { e.preventDefault(); moved = true; }
    }, { passive: false });

    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const TH = 40; // px threshold
      if (moved) { if (dx > TH) prev(); else if (dx < -TH) next(); }
      start();
    }, { passive: true });

    /* Resize/orientation: re-sync without jump, then re-enable transition */
    let raf = 0;
    const resync = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        allowTransition = false;
        render();
        requestAnimationFrame(() => { allowTransition = true; });
      });
    };
    window.addEventListener('resize', resync);
    window.addEventListener('orientationchange', resync);
    window.addEventListener('load', resync);

    /* Boot */
    allowTransition = false;
    render();
    requestAnimationFrame(() => { allowTransition = true; start(); });
  }

  /* =========================
     Tooltips — single instance, delegated
     ========================= */
  function initTooltips() {
    const tip = document.createElement('div');
    tip.className = 'tooltip';
    document.body.appendChild(tip);

    let active = null, timer = null;
    const DELAY = 300, PAD = 12;

    function position(x, y) {
      const tw = tip.offsetWidth, th = tip.offsetHeight;
      const vw = window.innerWidth, vh = window.innerHeight;
      let left = x + 16, top = y - th / 2;
      if (left + tw + PAD > vw) left = x - tw - 16; // flip to left side
      if (top < PAD) top = PAD;
      if (top + th + PAD > vh) top = vh - th - PAD;
      tip.style.left = `${left}px`;
      tip.style.top  = `${top}px`;
    }
    const show = (t) => {
      const s = t.getAttribute('data-tooltip'); if (!s) return;
      tip.textContent = s;
      tip.style.opacity = '1';
      tip.style.transform = 'translateY(0)';
    };
    const hide = () => { tip.style.opacity = '0'; tip.style.transform = 'translateY(-4px)'; };

    // Hover (delegated)
    document.addEventListener('mouseover', (e) => {
      const li = e.target.closest('li[data-tooltip]'); if (!li) return;
      active = li; clearTimeout(timer); timer = setTimeout(() => show(li), DELAY);
    });
    document.addEventListener('mouseout', (e) => {
      const li = e.target.closest('li[data-tooltip]'); if (!li) return;
      clearTimeout(timer); hide(); active = null;
    });

    // Follow pointer
    document.addEventListener('mousemove', (e) => { if (active) position(e.clientX, e.clientY); });

    // Keyboard focus
    document.addEventListener('focusin', (e) => {
      const li = e.target.closest && e.target.closest('li[data-tooltip]'); if (!li) return;
      active = li; show(li);
      const r = li.getBoundingClientRect();
      position(r.left + r.width / 2, r.top);
    });
    document.addEventListener('focusout', () => {
      if (!document.activeElement.closest('li[data-tooltip]')) { hide(); active = null; }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { hide(); active = null; } });
  }
})();
