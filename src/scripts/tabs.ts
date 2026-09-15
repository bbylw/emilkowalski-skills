/**
 * 通用切换器：[data-tabs] 容器内的 [data-tab] / [data-panel] 按同名 data 值配对。
 * [data-goto] 按钮可从任意位置切到某个面板。
 * 遵循 ARIA tabs 模式：同一时刻只有选中项进入 Tab 序列（roving tabindex），
 * 方向键 + Home/End 在列表内移动焦点并联动选中，支持 /playbook#场景 深链。
 */
type Root = HTMLElement;

function select(root: Root, slug: string, moveFocus: boolean) {
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-tab]'));

  for (const tab of tabs) {
    const on = tab.dataset.tab === slug;
    tab.classList.toggle('is-active', on);
    tab.setAttribute('aria-selected', on ? 'true' : 'false');
    tab.setAttribute('tabindex', on ? '0' : '-1');
    if (on) {
      if (moveFocus) tab.focus();
      // 移动端是横向滚动条：让选中项滚入视野；桌面纵向 sticky 列表同理
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  for (const panel of root.querySelectorAll<HTMLElement>('[data-panel]')) {
    const on = panel.dataset.panel === slug;
    panel.classList.toggle('is-active', on);
    if (on) panel.removeAttribute('hidden');
    else panel.setAttribute('hidden', '');
  }
}

function init() {
  document.querySelectorAll<Root>('[data-tabs]').forEach((root) => {
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-tab]'));
    if (!tabs.length) return;

    // 初始 roving：确保有且只有一个 tab 在 Tab 序列里
    const selected = tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0]!;
    for (const tab of tabs) {
      tab.setAttribute('tabindex', tab === selected ? '0' : '-1');
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => select(root, tab.dataset.tab!, false));
      tab.addEventListener('keydown', (event) => {
        const current = tabs.indexOf(tab);
        let next: HTMLButtonElement | undefined;
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            next = tabs[(current + 1) % tabs.length];
            break;
          case 'ArrowUp':
          case 'ArrowLeft':
            next = tabs[(current - 1 + tabs.length) % tabs.length];
            break;
          case 'Home':
            next = tabs[0];
            break;
          case 'End':
            next = tabs[tabs.length - 1];
            break;
          default:
            return;
        }
        event.preventDefault();
        if (next) select(root, next.dataset.tab!, true);
      });
    });

    root.querySelectorAll<HTMLButtonElement>('[data-goto]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slug = btn.dataset.goto!;
        select(root, slug, false);
        root.querySelector(`[data-panel="${slug}"]`)?.scrollIntoView({ block: 'nearest' });
      });
    });

    // 支持 /playbook#one-motion 这类带锚点的深链
    const hash = decodeURIComponent(location.hash.replace('#', ''));
    if (hash && root.querySelector(`[data-tab="${hash}"]`)) {
      select(root, hash, false);
      root.querySelector<HTMLElement>(`[data-tab="${hash}"]`)?.scrollIntoView({ block: 'center' });
    }
  });
}

init();
document.addEventListener('astro:after-swap', init);
