# skills-cn 站点说明

> 本文件是本站（项目与部署）的说明。`README.md` 保持 emilkowalski/skills 官方中文 README 原样，不要往里面掺项目内容。

## 项目是什么

[emilkowalski/skills](https://github.com/emilkowalski/skills)（Emil Kowalski 面向设计师与工程师的 Agent Skills 集）的中文整理站：不是逐字翻译仓库文档，而是把每个 skill 的「定位、什么时候用、具体做什么、怎么提要求、常与谁组合」整理成结构化数据，再用「组合手册」把 skill 串成可执行的工作流。

## 技术栈

- Astro 7（静态输出）+ TypeScript
- Tailwind CSS v4（`@tailwindcss/vite`，仅作工具类与 preflight；组件样式全部走 scoped CSS）
- `@fontsource-variable/geist` / `geist-mono` 自托管字体（仅 preload 两个 latin woff2，其余子集靠 `unicode-range` 懒加载）
- 图标：`@phosphor-icons/core` 的 SVG `?raw` 内联（见 `src/lib/icons.ts`），不用图标字体、不整包引 CSS
- `simple-icons` 仅取 5 个品牌 path 渲染「经验沉淀自」一行
- `@astrojs/sitemap` 生成 sitemap，`robots.txt` 指向它
- 社交分享卡片 `public/og.png`（1200×630）由 `bun run og`（`scripts/og.mjs`，playwright 渲染本站设计语言）生成，产物提交进仓库，部署不需要重跑

## 目录

```
src/
  data/        skills.ts（13 个 skill 的结构化内容）、playbooks.ts（6 条组合链）、site.ts（站点常量，描述文案由 skills.length 派生）
  layouts/     Base.astro（head、主题 boot 脚本、字体 preload、JSON-LD 之外的公共壳）
  components/  Nav / Footer / Icon / CopyButton / Breadcrumbs（JSON-LD）
               MotionRace、CompareRows（动效对照装置）、SkillBrowser、ComboConsole（两个交互式浏览器）
  pages/       index、playbook、skills/index、skills/[slug]、404
  scripts/     reveal / tabs / copy / demos —— 每个增强独立 try/catch 与降级路径
  styles/      global.css：设计令牌（纸/墨/朱砂系双主题）+ 组件层工具类
public/        favicon.svg、robots.txt
scripts/verify.mjs  无头验收（见下）
```

## 设计语言

- 冷灰中性底 + 单一朱红强调（`--accent`），明暗两套令牌在 `html[data-theme]` 上整组翻转；boot 脚本先读 localStorage 再回退 `prefers-color-scheme`，首帧定主题防闪烁。
- 分节用发丝线（`.band`），不堆卡片；标签/眉题一律 Geist Mono 小字号大 letter-spacing。
- 产品的核心视觉是缓动曲线本身：MotionRace 每条轨道内用 1px 非缩放描边画出该道真实跑的 cubic-bezier（viewBox 时间→x、进度→y），是数据可视化不是装饰。
- eyebrow 限额：眉题只放真实数据（「共 N 个」），标题本身能说明的节不加眉题。
- 标题即导航，不加装饰性序号；数字只出现在真实数据（个数、时长、次数）里。
- 正文禁 em dash / en dash（verify 会扫）。
- 触屏纪律：hover 位移全部关 `@media (hover: hover)`；无 JS / reduced-motion 各有静态呈现路径。
- 滚动驱动动效（`animation-timeline: scroll(root)`）必须拆成两条规则写：`animation` 简写一条，`animation-timeline` 单独一条且用 `body ` 前缀抬高特异度。同一选择器里连着写，压缩器会把 timeline 折进简写变成 `animation: nav-lift linear both scroll(root)`，而 Chrome 的简写解析不接受 `scroll()`，整条声明作废、动画根本不创建（进度条因为早先就拆开写而幸存）。
- 中文排版渐进增强：`text-autospace`（中英/数字间自动加隙，Chrome 128+）与标题 `word-break: auto-phrase`（按短语断行，Chrome 119+），旧引擎整条忽略、无副作用。
- 系统级「更高对比度」偏好（`prefers-contrast: more`）只提令牌档位（`--muted` / `--line` / `--line-strong`），不产生第二套组件样式。

## 交互与降级契约

- `tabs.ts`：`[data-tabs]` 内 `[data-tab]/[data-panel]` 配对，ARIA tabs 模式（roving tabindex、方向键 + Home/End）、`/playbook#场景` 深链自动选中。
- `copy.ts`：剪贴板失败有 shake 视觉反馈 + `role="status"` 播报，任何一步不抛未捕获异常。
- `demos.ts`：动效装置进入视口播放一次；reduced-motion 下直接渲染静态终态并隐藏重播按钮。
- `reveal.ts`：无 JS 时内容全显（`.js` 前缀）；reduced-motion 下直接 `is-in`。

## 验收

```bash
bun run build && bun run check
# 起一个源端口服务（默认 4321），然后：
bun run verify            # 或 node scripts/verify.mjs [baseUrl]
```

`verify.mjs` 的量化检查（双主题 × 桌面/移动 × 6 条路由，含 `/404`；404 页主文档本身就是 404 状态，该条控制台错误按预期过滤，其余报错照常捕获）：

1. 横向溢出 / 元素越界（滚动容器内越界视为设计意图）；
2. 每页恰好一个 `h1`、空链接、无 alt 图、破折号扫描、全角标点旁多余空格扫描（模板换行落在全角标点后会被渲染成空格，正文行必须整行书写）；
3. JSON-LD 可解析性；
4. **逐元素 WCAG 对比度**：canvas 像素回读归一化 `oklch` 等现代色（注意：`getComputedStyle` 原样返回 oklch 字符串，正则解析会静默漏检，必须画像素读 `getImageData`），正文/大字按 4.5/3 阈值判，多背景层按 alpha 混合；
5. 交互回归：主题切换读写、深链选中、键盘切 tab、复制反馈 + live region、reduced-motion 静态终态；
6. 滚动驱动回归：`.nav` 的 `getAnimations()` 必须非空（专抓「声明被压缩器折废」这类静默死亡），且滚动 400px 后 `--nav-lift` 到 1、hero 弧线 opacity 下降、进度条 `scaleX` 增长。

截图输出到 `.shots/`（不入库）：fullPage 截图前会强制 reveal 显示，避免长图空白。

## 部署

- 线上：GitHub Pages（Actions 部署，`.github/workflows/deploy.yml`），仓库 `bbylw/emilkowalski-skills`，默认分支 `main`。
- 自定义域：`https://emilkowalski-skills.ndjp.net`（`site`、robots sitemap、canonical 已对齐；CNAME 经 `gh api PUT /pages --input` 设置，HTTPS 证书签发后 GitHub 自动启用）。
- 发布铁律仍然成立：任何改动走 本地构建 → 用户预览验收 → 明确同意 → push（push 到 main 即触发部署）。
- 本地预览统一走 portless（命名 HTTPS 域名），无头验收直连本地源端口（`node scripts/verify.mjs`，线上验收可 `node scripts/verify.mjs https://emilkowalski-skills.ndjp.net`）。

## 包管理

仓带有 `bun.lock`，遵循既有锁文件用 bun（`bun install` / `bun run ...`）。
