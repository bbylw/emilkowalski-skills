<a href="https://aiforui.dev/">
<img width="360" height="202" alt="opengraph-image 2" src="https://github.com/user-attachments/assets/84fca9a6-0b2b-4927-8f48-f3ce194a5c47" />
</a>

# 面向设计师与工程师的 Skills

[![skills.sh](https://skills.sh/b/emilkowalski/skills)](https://skills.sh/emilkowalski/skills)

为设计师与工程师打造，助你构建更出色的用户界面。

判断自己关于动效——乃至广义上的设计——是否做了正确的选择，其实很难。这些 skills 旨在帮你更快地抵达那些正确的决定。

它们源自我多年在 Vercel、Linear 等公司工作的经验沉淀。

这里所有的 skills 都是领域专业能力的副产品。AI 不会取代这种专业能力，它只会放大你能从中获得的成果，让你相对他人变得更强。

所以，去学编程、学设计，或在任何其他领域沉淀专业能力吧。它极其有价值。

你可以在这里持续跟进我的 skills 更新：

[订阅资讯简报](https://aiforui.dev/newsletter)

## 安装

```bash
npx skills@latest add emilkowalski/skills
```

每个 skill 的页面在 [aiforui.dev/skills](https://aiforui.dev/skills) 上都会展示什么时候用它、一个效果示例，以及可以直接试的提示词。

## 为什么要用它？

智能体缺乏良好的品味

我见过太多次，智能体在为一处动效挑选合适「配料」时选错。本该是 `ease-out` 的入场动画，却用了 `ease-in` 缓动（[原因在此](https://emilkowal.ski/ui/7-practical-animation-tips#4.-choose-the-right-easing)）。又或者，它给你的界面选了实色边框，而不是半透明阴影。

所有这些细微之处会不断累积，最终让你的界面要么惊艳，要么……就那么平庸。

正如 [Agents with Taste](https://emilkowal.ski/ui/agents-with-taste) 中所言，这些 skills 会列出智能体可能犯的所有小错误，并解释如何修正。

这是你通往优秀界面的捷径。一条让你在「千篇一律的平庸」中脱颖而出的捷径。

## 参考

- **[emil-design-eng](https://aiforui.dev/skills/emil-design-eng)** — 核心 skill，以动效为主，也包含部分设计建议。
- **[animate](https://aiforui.dev/skills/animate)** — 从零构建一处动效，同时选对曲线、时长、属性等。
- **[animate-expo](https://aiforui.dev/skills/animate-expo)** — 同样的标准，但面向 React Native 与 Expo：手势、底部弹层、触觉反馈、页面切换，以及让动效脱离 JS 线程。
- **[review-animations](https://aiforui.dev/skills/review-animations)** — 按照我的规则，以严格的方式审查你的动效。
- **[improve-animations](https://aiforui.dev/skills/improve-animations)** — 审计代码库中所有的动效，给出任何智能体都可执行的、有优先级且自包含的改进方案。
- **[find-animation-opportunities](https://aiforui.dev/skills/find-animation-opportunities)** — 排查你的界面中真正能从动效中受益之处，同时告诉你哪些不该做动效。
- **[remove-animations](https://aiforui.dev/skills/remove-animations)** — 与「找机会」相反：删掉应用不需要的动效，比如键盘快捷方式上的动画、每个区块的淡入、一组提示里每个都延迟出现。
- **[choreograph](https://aiforui.dev/skills/choreograph)** — 协调同时发生的多个元素：谁领动、谁跟随、谁并行、谁根本不该动。
- **[animation-performance](https://aiforui.dev/skills/animation-performance)** — 修掉掉帧的动效，包含许多智能体容易漏掉的细微问题。
- **[animation-vocabulary](https://aiforui.dev/skills/animation-vocabulary)** — 用准确的措辞告诉 AI 你想要什么，从而获得更好的动效。
- **[apple-design](https://aiforui.dev/skills/apple-design)** — 提炼自 Apple WWDC 设计演讲的界面设计与流畅动效原则，并翻译为 Web 语境。
- **[gestures](https://aiforui.dev/skills/gestures)** — 做出 1:1 跟随手指、带上松手速度、并且能被中途接住的拖拽、侧滑与弹层交互。
- **[write-swift](https://github.com/emilkowalski/skills/blob/main/skills/write-swift/SKILL.md)** — 编写现代 Swift。涵盖：值类型、Swift 6 并发、泛型、性能，以及 Swift Testing。
- **[pick-ui-library](https://aiforui.dev/skills/pick-ui-library)** — 让智能体基于我使用并信赖的库来为任务挑选合适的库，而不是让 AI 手写一个 toast 组件或装一个已被废弃的包。
- **[prototype](https://aiforui.dev/skills/prototype)** — 针对你描述的 UI 片段构建多个不同版本，并通过切换器逐一浏览。
- **[mobile-native](https://aiforui.dev/skills/mobile-native)** — 让你的 Web 应用在手机上具备原生质感：顽固的 hover 态、点击高亮闪烁、100vh 的坑、导致页面缩放的输入框、迟钝的点击、安全区域，以及其他区分网站与 App 的小修小补。
- **[break-ui](https://aiforui.dev/skills/break-ui)** — 用最坏情况的数据试着弄坏你做的界面：超长名字、奇怪的邮箱、单字母名字、巨大数字、空列表、超长标签。
- **[learn-taste](https://aiforui.dev/skills/learn-taste)** — 在会话结束时运行：收集你做过的每一处设计纠正（包括你自己改的地方），把每一处变成一条带原因的规则写进 `DESIGN.md`，下一个智能体就不会再犯同样的错。
- **[ask-emil](https://aiforui.dev/skills/ask-emil)** — 不知道该用哪个 skill？描述你的处境，它指出合适的那一个，或者从想法到上线的正确顺序。
- **[ask-sonner](https://aiforui.dev/skills/ask-sonner)** — 我开发的 toast 库 [Sonner](https://sonner.emilkowal.ski) 的使用指南。涵盖常见问题的配置、样式、配方与修复。
