export {};

/** 复制结果统一播报：视觉之外，读屏也依赖这个 role=status 区域。 */
function ensureLive(): HTMLElement {
  let live = document.getElementById('copy-live');
  if (!live) {
    live = document.createElement('span');
    live.id = 'copy-live';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    live.className = 'sr-only';
    document.body.append(live);
  }
  return live;
}

function announce(text: string) {
  const live = ensureLive();
  live.textContent = '';
  // 隔一帧再写入，保证同文案重复时仍会被播报
  window.setTimeout(() => {
    live.textContent = text;
  }, 30);
}

function feedback(button: HTMLButtonElement, ok: boolean) {
  const cls = ok ? 'is-copied' : 'is-failed';
  button.classList.add(cls);
  window.setTimeout(() => button.classList.remove(cls), 1600);
  announce(ok ? '已复制到剪贴板' : '复制失败，请手动选择文本复制');
}

async function write(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();
  // execCommand 已废弃，只在 clipboard API 不可用时兜底
  const legacy: (cmd: string) => boolean = document.execCommand.bind(document);
  legacy('copy');
  area.remove();
}

function boot() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const from = button.dataset.copyFrom;
      const text = from
        ? (document.querySelector(from)?.textContent ?? '').trim()
        : (button.dataset.copyValue ?? '');
      if (!text) return;
      try {
        await write(text);
        feedback(button, true);
      } catch {
        feedback(button, false);
      }
    });
  });
}

boot();
document.addEventListener('astro:after-swap', boot);
