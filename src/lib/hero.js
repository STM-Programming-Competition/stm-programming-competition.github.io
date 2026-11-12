import { initHeroField } from './hero-field.js';

export function initHero(hero) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pause = hero.querySelector('[data-hero-pause]');
  const rows = [...hero.querySelectorAll('[data-code]')];
  let paused = false, elapsed = 0, last = performance.now(), step = -1;
  function syncPause() {
    hero.classList.toggle('motion-paused', paused || document.hidden || hero.closest('[hidden]') !== null);
    pause.setAttribute('aria-pressed', String(paused));
  }
  pause.addEventListener('click', () => { paused = !paused; syncPause(); });
  function type(complete = false) {
    const t = elapsed / 1000 % 9.5;
    const next = Math.floor(t * 17);
    if (!complete && step === next) return;
    step = next;
    let remaining = complete ? Infinity : t < 7.8 ? next : Math.max(0, Math.floor((9.5 - t) * 53));
    let cursor = false;
    rows.forEach(row => {
      const text = row.dataset.code, count = Math.min(text.length, remaining);
      remaining = Math.max(0, remaining - text.length - 3);
      row.textContent = text.slice(0, count);
      if (!cursor && count < text.length) { const caret = document.createElement('span'); caret.className = 'caret'; row.append(caret); cursor = true; }
    });
  }
  function frame(now) {
    const delta = Math.min(now - last, 100); last = now;
    if (!paused && !document.hidden && !hero.closest('[hidden]') && !motion.matches) { elapsed += delta; type(); }
    requestAnimationFrame(frame);
  }
  type(motion.matches); requestAnimationFrame(frame);
  motion.addEventListener('change', () => { step = -1; type(motion.matches); });
  document.addEventListener('visibilitychange', syncPause);
  new MutationObserver(syncPause).observe(hero.closest('article'), { attributes: true, attributeFilter: ['hidden'] });
  initHeroField(hero, motion);
}
