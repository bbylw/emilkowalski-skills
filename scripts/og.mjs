/**
 * 生成社交分享卡片 og.png（1200×630）。
 * 用本站自己的设计语言渲染：冷灰纸底、单一朱红、缓动曲线母题。
 * 用法：node scripts/og.mjs   （产物提交进仓库，部署时不需要重跑）
 * 需要本机已安装 Chrome（playwright-core 使用 channel: 'chrome'）。
 */
import { chromium } from 'playwright-core';
import { writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

// 站点令牌的十六进制近似（og 图是静态产物，不随 CSS 变量走）
const paper = '#fbfbfc';
const ink = '#232529';
const muted = '#787b84';
const accent = '#d94b3a';
const line = '#e3e4e8';

const mono = resolve(root, 'node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2');
const monoUrl = 'file:///' + mono.replace(/\\/g, '/');

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: 'Geist Mono Var';
    src: url('${monoUrl}') format('woff2-variations');
    font-weight: 100 900;
  }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    background: ${paper};
    color: ${ink};
    font-family: 'Geist Mono Var', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    position: relative;
    overflow: hidden;
  }
  .arc {
    position: absolute;
    inset: 0;
  }
  .frame {
    position: absolute;
    inset: 28px;
    border: 1px solid ${line};
    border-radius: 18px;
  }
  .inner {
    position: absolute;
    inset: 0;
    padding: 88px 96px 76px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .kicker {
    font-size: 21px;
    letter-spacing: 0.14em;
    color: ${muted};
    text-transform: uppercase;
  }
  .kicker b { color: ${accent}; font-weight: 500; }
  h1 {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-size: 108px;
    line-height: 1.08;
    letter-spacing: -0.035em;
    font-weight: 500;
  }
  h1 .accent { position: relative; color: ${accent}; }
  h1 .accent svg {
    position: absolute;
    left: -1%;
    bottom: -0.1em;
    width: 102%;
    height: 0.26em;
    overflow: visible;
  }
  h1 .accent svg path {
    fill: none;
    stroke: ${accent};
    stroke-width: 5px;
    stroke-linecap: round;
  }
  .foot {
    display: flex;
    align-items: center;
    gap: 18px;
    font-size: 22px;
    color: ${muted};
  }
  .foot .sep { width: 1px; height: 22px; background: ${line}; }
  .foot .cmd { color: ${ink}; }
  .foot .cmd::before { content: '$ '; color: ${accent}; }
</style>
</head>
<body>
  <svg class="arc" viewBox="0 0 1200 630" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 560 C 300 560, 520 120, 1200 40" fill="none" stroke="${line}" stroke-width="2" />
  </svg>
  <div class="frame"></div>
  <div class="inner">
    <p class="kicker">emilkowalski / skills <b>&middot;</b> 中文整理</p>
    <h1>给智能体<br />补上<span class="accent">品味<svg viewBox="0 0 120 14" preserveAspectRatio="none"><path d="M2 11 C 34 12, 74 4, 118 2" /></svg></span></h1>
    <p class="foot">
      <span>13 个 skill</span>
      <span class="sep"></span>
      <span>组合手册</span>
      <span class="sep"></span>
      <span class="cmd">npx skills@latest add emilkowalski/skills</span>
    </p>
  </div>
</body>
</html>`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.waitForTimeout(400); // 等 woff2 落地
const png = await page.screenshot({ type: 'png' });
await browser.close();

await writeFile(resolve(root, 'public/og.png'), png);
console.log('public/og.png written:', png.length, 'bytes');
