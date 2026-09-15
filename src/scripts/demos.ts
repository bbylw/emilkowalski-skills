export {};

/** 页面里的动效对照装置：进入视口播放一次，按钮可重播。 */
function play(scope: HTMLElement) {
  const targets = scope.querySelectorAll<HTMLElement>('[data-anim]');
  targets.forEach((el) => el.classList.remove('is-run'));
  void scope.offsetWidth;
  targets.forEach((el) => el.classList.add('is-run'));
}

function boot() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scopes = document.querySelectorAll<HTMLElement>('[data-demo]');

  scopes.forEach((scope) => {
    const btn = scope.querySelector<HTMLButtonElement>('[data-demo-replay]');

    if (reduced) {
      // 静态终态：仍然加上 is-run，由 CSS 直接渲染到位（无动画）；重播按钮由 [data-demo-static] 样式隐藏
      scope.dataset.demoStatic = 'true';
      scope.querySelectorAll<HTMLElement>('[data-anim]').forEach((el) => el.classList.add('is-run'));
      return;
    }

    btn?.addEventListener('click', () => play(scope));

    if (!('IntersectionObserver' in window)) {
      play(scope);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          play(scope);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(scope);
  });
}

boot();
document.addEventListener('astro:after-swap', boot);
