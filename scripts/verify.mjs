/**
 * 验收脚本：溢出、横向滚动、结构、控制台、破折号 +
 * 正文对比度扫描（WCAG AA）+ 交互回归（主题切换 / 深链选中 / 键盘切 tab / 复制反馈）
 * + reduced-motion 静态终态。
 * 用法：node scripts/verify.mjs [baseUrl]（默认 http://localhost:4321，直连源端口而非 portless 域名）
 * 需要本机已安装 Chrome（playwright-core 使用 channel: 'chrome'）。
 */
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] ?? 'http://localhost:4321';
const outDir = '.shots';

const routes = ['/', '/playbook', '/skills', '/skills/animate', '/skills/ask-sonner'];
const viewports = [
  { name: 'desktop', width: 1440, height: 960 },
  { name: 'mobile', width: 390, height: 844 },
];
const themes = ['light', 'dark'];

const problems = [];
const fail = (line) => problems.push(line);

const browser = await chromium.launch({ channel: 'chrome' });
await mkdir(outDir, { recursive: true });

/** 页面内测量：溢出 + 结构 + 对比度扫描（背景带 alpha 的元素跳过，避免半透明叠加误报） */
const measure = () => {
  const vw = document.documentElement.clientWidth;

  const inScroller = (el) => {
    let node = el.parentElement;
    while (node && node !== document.body) {
      const style = getComputedStyle(node);
      if ((style.overflowX === 'auto' || style.overflowX === 'scroll') && node.scrollWidth > node.clientWidth) {
        return true;
      }
      node = node.parentElement;
    }
    return false;
  };

  const off = document.createElement('canvas');
  off.width = 1;
  off.height = 1;
  const offCtx = off.getContext('2d', { willReadFrequently: true });
  const parseColor = (value) => {
    if (!value || value === 'none') return null;
    // 直接画一个像素再读回：任何 CSS 颜色（含 oklch）都会归一化为 RGBA 字节
    offCtx.clearRect(0, 0, 1, 1);
    offCtx.fillStyle = '#000';
    offCtx.fillStyle = value;
    if (String(offCtx.fillStyle) === '#000' && !/^#000+$|^rgb\(0[, ]/.test(value)) return null; // 无法解析的值会保留上一个填充色
    offCtx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = offCtx.getImageData(0, 0, 1, 1).data;
    if (a === 0) return null;
    return { r, g, b, a: a / 255 };
  };

  const luma = ({ r, g, b }) => {
    const f = (c) => {
      const s = c / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };

  const ratio = (fg, bg) => {
    const a = luma(fg);
    const b = luma(bg);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };

  const blend = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });

  const effectiveBg = (el) => {
    let node = el;
    const stack = [];
    while (node && node !== document.documentElement.parentElement) {
      const bg = parseColor(getComputedStyle(node).backgroundColor);
      if (bg && bg.a > 0) {
        stack.push(bg);
        if (bg.a >= 0.999) break;
      }
      node = node.parentElement;
    }
    if (!stack.length) return null;
    let acc = stack.pop();
    while (stack.length) acc = blend(stack.pop(), acc);
    return acc;
  };

  const overflowing = [];
  for (const el of document.querySelectorAll('body *')) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (el.closest('svg')) continue; // SVG 子几何被 svg 视口裁切，越界不代表布局问题
    if (rect.right > vw + 1.5 || rect.left < -1.5) {
      const style = getComputedStyle(el);
      if (style.position === 'fixed' || inScroller(el)) continue;
      overflowing.push({
        tag: el.tagName.toLowerCase(),
        cls: el.getAttribute('class') ?? '',
        right: Math.round(rect.right),
      });
    }
  }

  const lowContrast = [];
  for (const el of document.querySelectorAll('body *:not(svg):not(script):not(style)')) {
    const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!text) continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.opacity === '0') continue;
    const fg = parseColor(style.color);
    const bg = effectiveBg(el);
    if (!fg || !bg) continue;
    const alphaFg = fg.a < 0.999 ? blend(fg, bg) : fg;
    const size = parseFloat(style.fontSize);
    const weight = Number(style.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const min = large ? 3 : 4.5;
    const r = ratio(alphaFg, bg);
    if (r < min) {
      lowContrast.push({
        cls: el.getAttribute('class') ?? el.tagName.toLowerCase(),
        ratio: Math.round(r * 100) / 100,
        min,
        text: el.textContent.trim().slice(0, 24),
      });
    }
  }

  return {
    vw,
    docWidth: document.documentElement.scrollWidth,
    h1: document.querySelectorAll('h1').length,
    overflowing: overflowing.slice(0, 6),
    dashes: (document.body.innerText.match(/[—–]/g) ?? []).length,
    punctSpaces: [
      ...(document.body.innerText.match(/[，。、；：！？）」][ \u00a0]/g) ?? []),
      ...(document.body.innerText.match(/[ \u00a0][，。、；：！？）」]/g) ?? []),
    ],
    emptyLinks: [...document.querySelectorAll('a')].filter((a) => !a.textContent.trim() && !a.getAttribute('aria-label')).length,
    imgsWithoutAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
    jsonLdErrors: [...document.querySelectorAll('script[type="application/ld+json"]')].filter((s) => {
      try {
        JSON.parse(s.textContent);
        return false;
      } catch {
        return true;
      }
    }).length,
    lowContrast: lowContrast.slice(0, 8),
    lowContrastCount: lowContrast.length,
  };
};

for (const viewport of viewports) {
  for (const theme of themes) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    await context.addInitScript((value) => {
      window.localStorage.setItem('theme', value);
    }, theme);

    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(String(err)));

      await page.goto(base + route, { waitUntil: 'load' });
      await page.waitForTimeout(350);

      const report = await page.evaluate(measure);
      const label = `${viewport.name}/${theme}${route}`;

      if (report.docWidth > report.vw + 1) fail(`${label}: 页面横向可滚动（doc ${report.docWidth} > vw ${report.vw}）`);
      for (const el of report.overflowing) {
        const tag = `${el.tag}${el.cls ? '.' + el.cls.split(/\s+/).slice(0, 2).join('.') : ''}`;
        if (el.right > report.vw + 1.5) fail(`${label}: 元素越界 ${tag} right=${el.right}`);
      }
      if (report.h1 !== 1) fail(`${label}: h1 数量为 ${report.h1}`);
      if (report.dashes > 0) fail(`${label}: 正文出现破折号 ${report.dashes} 处`);
      for (const s of report.punctSpaces.slice(0, 5)) {
        fail(`${label}: 全角标点旁出现多余空格「${s.replace(/\u00a0/g, ' ')}」`);
      }
      if (report.emptyLinks > 0) fail(`${label}: 有 ${report.emptyLinks} 个空链接`);
      if (report.imgsWithoutAlt > 0) fail(`${label}: 有 ${report.imgsWithoutAlt} 张图缺少 alt`);
      if (report.jsonLdErrors > 0) fail(`${label}: JSON-LD 无法解析 ${report.jsonLdErrors} 处`);
      for (const c of report.lowContrast) {
        fail(`${label}: 对比度 ${c.ratio} < ${c.min} 「${c.text}」 .${c.cls}`);
      }
      for (const err of errors) fail(`${label}: 控制台报错 ${err.slice(0, 160)}`);

      if (viewport.name === 'desktop' && theme === 'light') {
        // reveal 依赖真实滚动触发、hero 有入场动画：截图前统一钉成静态，避免长图空白/半程状态
        await page.addStyleTag({
          content: [
            '.js .reveal{opacity:1!important;transform:none!important}',
            '.hero__line-in{transform:none!important;animation:none!important}',
            '.hero__sub,.hero__cta,.hero__device{opacity:1!important;transform:none!important;animation:none!important}',
            '.hero__arc path,.hero__swoosh path{stroke-dashoffset:0!important;animation:none!important}',
          ].join(''),
        });
        const safe = route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-/, '');
        await page.screenshot({ path: `${outDir}/${safe}.png`, fullPage: true });
      }

      await page.close();
    }

    await context.close();
  }
}

/* ---- 交互回归（桌面 light） ---- */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();
  const label = 'interactions';

  // 1. 主题切换：点按钮 → data-theme 翻转且写入 localStorage；日月按钮任何时刻只亮一个
  const swapState = () =>
    page.evaluate(() => {
      const op = (s) => Number(getComputedStyle(document.querySelector(s)).opacity);
      return { theme: document.documentElement.dataset.theme, sun: op('.theme-swap__sun'), moon: op('.theme-swap__moon') };
    });
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.evaluate(() => localStorage.removeItem('theme'));
  await page.reload({ waitUntil: 'load' });
  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  {
    const s = await swapState();
    const lit = (s.sun > 0.5 ? 1 : 0) + (s.moon > 0.5 ? 1 : 0);
    if (lit !== 1) fail(`${label}: 初始主题下日月按钮点亮 ${lit} 个图标（应为 1）`);
    if (s.theme === 'light' && !(s.sun > 0.5 && s.moon < 0.5)) fail(`${label}: light 主题应只亮太阳图标`);
    if (s.theme === 'dark' && !(s.moon > 0.5 && s.sun < 0.5)) fail(`${label}: dark 主题应只亮月亮图标`);
  }
  await page.click('[data-theme-toggle]');
  await page.waitForTimeout(600);
  const after = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    stored: localStorage.getItem('theme'),
  }));
  if (before === after.theme) fail(`${label}: 主题切换未翻转 data-theme`);
  if (after.stored !== after.theme) fail(`${label}: 主题未按预期写入 localStorage（${after.stored}）`);
  {
    const s = await swapState();
    const lit = (s.sun > 0.5 ? 1 : 0) + (s.moon > 0.5 ? 1 : 0);
    if (lit !== 1) fail(`${label}: 切换后日月按钮点亮 ${lit} 个图标（应为 1）`);
  }
  await page.close();

  // 2. 深链选中 + roving tabindex：/playbook#native-feel
  const deep = await context.newPage();
  await deep.goto(base + '/playbook#native-feel', { waitUntil: 'load' });
  await deep.waitForTimeout(250);
  const deepState = await deep.evaluate(() => ({
    selected: document.querySelector('[data-tab="native-feel"]')?.getAttribute('aria-selected'),
    panelShown: !document.querySelector('[data-panel="native-feel"]')?.hasAttribute('hidden'),
    inSequence: [...document.querySelectorAll('[data-tab]')].filter((t) => t.getAttribute('tabindex') === '0').length,
  }));
  if (deepState.selected !== 'true') fail(`${label}: 深链未选中共 tab native-feel`);
  if (!deepState.panelShown) fail(`${label}: 深链面板未展示`);
  if (deepState.inSequence !== 1) fail(`${label}: roving tabindex 不在序列的 tab 数应为 1，实际 ${deepState.inSequence}`);
  await deep.close();

  // 3. 键盘导航：聚焦第一个 tab → ArrowRight 切换选中（SkillBrowser 在首页）
  const kb = await context.newPage();
  await kb.goto(base + '/', { waitUntil: 'load' });
  await kb.waitForTimeout(200);
  await kb.evaluate(() => document.querySelector('.sb [data-tab]')?.focus());
  await kb.keyboard.press('ArrowRight');
  const kbState = await kb.evaluate(() => {
    const active = [...document.querySelectorAll('.sb [data-tab]')].find((t) => t.getAttribute('aria-selected') === 'true');
    return { slug: active?.dataset.tab, focused: document.activeElement?.dataset.tab };
  });
  if (kbState.slug !== 'animate' || kbState.focused !== 'animate') {
    fail(`${label}: 键盘 ArrowRight 未把选中移到第二项（选中 ${kbState.slug} / 焦点 ${kbState.focused}）`);
  }
  await kb.close();

  // 4. 复制反馈：点击安装命令复制 → is-copied + live region 文案
  const cp = await context.newPage();
  await cp.context().grantPermissions(['clipboard-write', 'clipboard-read']);
  await cp.goto(base + '/#install', { waitUntil: 'load' });
  await cp.click('.install .copy');
  await cp.waitForTimeout(120);
  const cpState = await cp.evaluate(() => ({
    copied: !!document.querySelector('.install .copy.is-copied'),
    live: document.getElementById('copy-live')?.textContent ?? '',
  }));
  if (!cpState.copied) fail(`${label}: 复制后按钮没有进入 is-copied 状态`);
  if (!cpState.live.includes('已复制')) fail(`${label}: 复制结果没有写入 aria-live 区域（${cpState.live}）`);
  await cp.close();

  // 5. reduced-motion：hero 演示圆点应静态停在终点
  const rmContext = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 960 } });
  const rm = await rmContext.newPage();
  await rm.goto(base + '/', { waitUntil: 'load' });
  await rm.waitForTimeout(250);
  const rmState = await rm.evaluate(() => {
    const dot = document.querySelector('.race__dot');
    const transform = dot ? getComputedStyle(dot).transform : '';
    const match = transform.match(/matrix\(1, 0, 0, 1, ([-\d.]+)/);
    return {
      run: dot?.classList.contains('is-run'),
      tx: match ? Number(match[1]) : 0,
      replayHidden: getComputedStyle(document.querySelector('.race__replay')).display === 'none',
    };
  });
  if (!rmState.run) fail(`${label}: reduced-motion 下演示点未进入静态终态（is-run 缺失）`);
  if (!(rmState.tx > 10)) fail(`${label}: reduced-motion 下演示点没有停在终点（translateX=${rmState.tx}）`);
  if (!rmState.replayHidden) fail(`${label}: reduced-motion 下重播按钮没有隐藏`);
  await rm.close();
  await rmContext.close();

  await context.close();
}

await browser.close();

const unique = [...new Set(problems)];
if (unique.length) {
  console.log(`发现 ${unique.length} 个问题：`);
  for (const line of unique) console.log(' - ' + line);
  process.exit(1);
}
console.log('全部检查通过：溢出 / 结构 / 对比度 / 控制台 / 交互回归 均无问题。');
