// Parameters chosen in the local-field preview.
const settings = { spacing: 18, length: 12, radius: 150, contrast: 0.75, interior: 0.24, feather: 76 };
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function initHeroField(hero, reducedMotion) {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-field';
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  if (!context) return;
  hero.prepend(canvas);

  const content = [...hero.querySelectorAll('h1, .hero-description, .competition-board, .hero-actions')];
  const artwork = hero.querySelector('.signal-art');
  let width = 0;
  let height = 0;
  let nodes = [];
  let frame = 0;
  let previousTime = 0;
  let pointer = { x: 0, y: 0, active: false };

  function boxOf(element, origin) {
    const box = element.getBoundingClientRect();
    return { left: box.left - origin.left, top: box.top - origin.top, right: box.right - origin.left, bottom: box.bottom - origin.top };
  }

  function distanceToBox(x, y, box) {
    return Math.hypot(Math.max(box.left - x, 0, x - box.right), Math.max(box.top - y, 0, y - box.bottom));
  }

  function schedule() {
    if (!frame && !document.hidden && !hero.closest('[hidden]')) frame = requestAnimationFrame(draw);
  }

  function resize() {
    if (hero.closest('[hidden]')) return;
    const box = hero.getBoundingClientRect();
    width = box.width;
    height = box.height;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const boxes = content.map(element => boxOf(element, box));
    const artBox = boxOf(artwork, box);
    nodes = [];
    for (let y = 14; y < height; y += settings.spacing) {
      for (let x = 14; x < width; x += settings.spacing) {
        let opacity = 1;
        boxes.forEach(region => {
          const t = clamp(distanceToBox(x, y, region) / settings.feather, 0, 1);
          const smooth = t * t * (3 - 2 * t);
          opacity = Math.min(opacity, settings.interior + (1 - settings.interior) * smooth);
        });
        if (distanceToBox(x, y, artBox) === 0) opacity *= 0.52;
        nodes.push({ x, y, opacity, vx: 0, vy: 0, activation: 0 });
      }
    }
    schedule();
  }

  function draw(now) {
    frame = 0;
    const delta = previousTime ? Math.min(50, now - previousTime) : 16;
    previousTime = now;
    const blend = reducedMotion.matches ? 1 : 1 - Math.exp(-delta / 85);
    const active = pointer.active && !reducedMotion.matches && !hero.classList.contains('motion-paused');
    context.clearRect(0, 0, width, height);
    context.lineCap = 'round';
    context.lineWidth = 1.15;
    let moving = false;
    nodes.forEach(node => {
      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const distance = Math.hypot(dx, dy);
      const influence = active ? Math.exp(-Math.pow(distance / settings.radius, 2) * 1.9) : 0;
      const length = settings.length * influence * clamp((distance - 12) / 36, 0, 1);
      const vx = distance ? dx / distance * length : 0;
      const vy = distance ? dy / distance * length : 0;
      node.vx += (vx - node.vx) * blend;
      node.vy += (vy - node.vy) * blend;
      node.activation += (influence - node.activation) * blend;
      if (Math.abs(vx - node.vx) + Math.abs(vy - node.vy) + Math.abs(influence - node.activation) > 0.025) moving = true;
      const alpha = node.opacity * (0.18 + settings.contrast * 0.48 * node.activation);
      context.fillStyle = context.strokeStyle = `rgba(45,83,132,${alpha.toFixed(3)})`;
      const extent = Math.hypot(node.vx, node.vy);
      context.beginPath();
      if (extent < 0.7) {
        context.arc(node.x, node.y, 1, 0, Math.PI * 2);
        context.fill();
      } else {
        context.moveTo(node.x - node.vx * 0.35, node.y - node.vy * 0.35);
        context.lineTo(node.x + node.vx * 0.65, node.y + node.vy * 0.65);
        context.stroke();
      }
    });
    if (moving) schedule();
  }

  function reset() {
    pointer.active = false;
    schedule();
  }
  hero.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const box = hero.getBoundingClientRect();
    pointer = { x: event.clientX - box.left, y: event.clientY - box.top, active: true };
    schedule();
  });
  hero.addEventListener('pointerleave', reset);
  hero.addEventListener('pointercancel', reset);
  window.addEventListener('scroll', reset, { passive: true });
  document.addEventListener('visibilitychange', () => { reset(); resize(); });
  reducedMotion.addEventListener('change', reset);
  new ResizeObserver(resize).observe(hero);
  new MutationObserver(() => { reset(); resize(); }).observe(hero, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(() => { reset(); resize(); }).observe(hero.closest('article'), { attributes: true, attributeFilter: ['hidden'] });
  const copyObserver = new MutationObserver(resize);
  content.forEach(element => copyObserver.observe(element, { subtree: true, childList: true, characterData: true }));
  document.fonts.ready.then(resize);
  resize();
}
