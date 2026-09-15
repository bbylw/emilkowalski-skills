export {};

const SELECTOR = '.reveal';

function boot() {
  const targets = document.querySelectorAll<HTMLElement>(SELECTOR);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  );

  targets.forEach((el) => {
    const step = Number(el.dataset.revealStep ?? 0);
    if (step) {
      el.style.setProperty('--reveal-delay', `${step * 70}ms`);
    } else if (el.parentElement?.dataset.revealGroup !== undefined) {
      // 组内序号：同一 [data-reveal-group] 容器内的第 n 个，而不是全页第 n 个
      const siblings = Array.from(el.parentElement.querySelectorAll<HTMLElement>(`:scope > ${SELECTOR}`));
      const index = Math.max(0, siblings.indexOf(el));
      el.style.setProperty('--reveal-delay', `${(index % 6) * 60}ms`);
    }
    io.observe(el);
  });
}

boot();
document.addEventListener('astro:after-swap', boot);
