export type GroupId = 'motion' | 'design' | 'platform' | 'craft';

export type Skill = {
  slug: string;
  name: string;
  title: string;
  group: GroupId;
  /** 一句话定位，用于列表与卡片 */
  tagline: string;
  /** 它把哪件事做完了 */
  job: string;
  summary: string;
  when: string[];
  does: { k: string; v: string }[];
  prompt: string;
  pairs: string[];
  href: string;
  core?: boolean;
};

export const groups: { id: GroupId; label: string; note: string }[] = [
  { id: 'motion', label: '动效', note: '曲线、时长、属性，以及判断它们对不对的规则' },
  { id: 'design', label: '设计判断', note: '界面层级、平台语汇，以及动手前先看几个方向' },
  { id: 'platform', label: '平台与端', note: '把同一套标准带到手机、原生与 Swift' },
  { id: 'craft', label: '工程细节', note: '选库与收尾，把最后一段做到位' },
];

export const skills: Skill[] = [
  {
    slug: 'emil-design-eng',
    name: 'emil-design-eng',
    title: '设计与动效总纲',
    group: 'motion',
    core: true,
    tagline: '核心 skill，品味的基线',
    job: '把「什么是对的」写成可引用的规则',
    summary:
      '这是整套 skills 的地基。它以动效为主，也覆盖界面层级、材质与留白。把它装上的意义不在于多一条命令，而在于你的智能体从此有一份可以反复引用的标准，而不是每次临场发挥。',
    when: [
      '开工之前，想先给这个项目立一套判断标准',
      '对某处界面「说不上哪里别扭」，需要一个解释',
      '要向同事说明为什么这个方案比那个好',
    ],
    does: [
      { k: '缓动', v: '入场用 ease-out，离场用 ease-in，手指拖拽用 spring，不用一套曲线打天下' },
      { k: '层级', v: '用半透明阴影建立前后关系，而不是给每个卡片加一圈 1px 实色描边' },
      { k: '属性', v: '只动 transform 与 opacity，避免每帧触发布局与重绘' },
      { k: '降级', v: '为 prefers-reduced-motion 准备等价的静态表现，而不是直接砍掉' },
    ],
    prompt: '按 emil-design-eng 的规则，检查这个页面的动效与层级关系，逐条说明哪里不对。',
    pairs: ['review-animations', 'improve-animations', 'apple-design'],
    href: 'https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md',
  },
  {
    slug: 'animate',
    name: 'animate',
    title: '从零构建动效',
    group: 'motion',
    tagline: '一处动效，从意图到参数',
    job: '把一句需求变成曲线、时长与属性都选对的实现',
    summary:
      '给你需要的那一处动效配齐所有配料：该用什么缓动、多长、动哪些属性、要不要错峰。它不会先给你一个默认值再让你自己调，而是在生成时就按规则把选择做完。',
    when: [
      '要新写一处入场、展开或状态切换',
      '已有动效但参数全靠手感试出来的',
      '想同时拿到实现和它为什么这么写的解释',
    ],
    does: [
      { k: '选曲线', v: '依据动效语义挑 ease-out / ease-in / spring，而不是默认 ease-in-out' },
      { k: '定时长', v: '按位移距离与元素大小定时长，小元素短、大位移略长' },
      { k: '选属性', v: '优先 transform 与 opacity，避免动画 width、top、box-shadow' },
      { k: '排顺序', v: '多个元素时给出错峰节奏，而不是整齐划一地同时出现' },
    ],
    prompt: '用 animate 为这个筛选面板做展开与收起，说明每条曲线与时长的选择理由。',
    pairs: ['animation-vocabulary', 'review-animations', 'apple-design'],
    href: 'https://github.com/emilkowalski/skills/blob/main/skills/animate/SKILL.md',
  },
  {
    slug: 'animate-expo',
    name: 'animate-expo',
    title: 'Expo 与 RN 动效',
    group: 'platform',
    tagline: '同一套标准，跑到原生线程上',
    job: '让移动端动效跟手、不掉帧、有触觉',
    summary:
      '面向 React Native 与 Expo 的同标准实现：手势、底部弹层、页面切换、触觉反馈，以及最关键的让动效脱离 JS 线程。Web 上可用的直觉在这里大部分要改写。',
    when: [
      '在 RN / Expo 里做手势驱动的交互',
      '动效在真机上掉帧，模拟器里却正常',
      '需要底部弹层、页面切换、触觉反馈这些原生语汇',
    ],
    does: [
      { k: '离线程', v: '把动画交给 UI 线程执行，JS 线程忙时也保持 60fps' },
      { k: '手势', v: '手势与动画共享同一个驱动源，跟手且可中断' },
      { k: '原生件', v: '底部弹层、页切换、键盘避让按平台习惯实现' },
      { k: '触觉', v: '为关键反馈配轻触感，与视觉节奏对齐' },
    ],
    prompt: '用 animate-expo 实现这个底部弹层的拖拽关闭，确保动画运行在 UI 线程。',
    pairs: ['apple-design', 'review-animations', 'mobile-native'],
    href: 'https://github.com/emilkowalski/skills/blob/main/skills/animate-expo/SKILL.md',
  },
  {
    slug: 'review-animations',
    name: 'review-animations',
    title: '动效审查',
    group: 'motion',
    tagline: '按规则挑错，不留情面',
    job: '把已经写好的动效逐条对照规则检查',
    summary:
      '一次严格的复核。它会把你的动效拆成缓动、时长、属性、编排、降级几个维度，逐条指出哪里违反了规则，以及正确的写法是什么。适合在合并之前跑一遍。',
    when: [
      '动效写完了，不确定有没有踩坑',
      '想让审查意见可复现，而不是靠个人感觉',
      '审查别人提交的代码，需要一份具体的清单',
    ],
    does: [
      { k: '逐条对照', v: '缓动、时长、属性、编排、降级五个维度分别给结论' },
      { k: '指出代价', v: '说明问题会造成什么观感后果，而不是只说「不太好」' },
      { k: '给出替换', v: '每个问题都附一个可直接替换的写法' },
      { k: '守住底线', v: '减少动效与可访问性相关的问题一律不降级处理' },
    ],
    prompt: '用 review-animations 审查这个 PR 里新增的三处动效，按严重程度排序。',
    pairs: ['emil-design-eng', 'improve-animations', 'animate'],
    href: 'https://github.com/emilkowalski/skills/blob/main/skills/review-animations/SKILL.md',
  },
  {
    slug: 'improve-animations',
    name: 'improve-animations',
    title: '全库动效审计',
    group: 'motion',
    tagline: '一次扫完，按优先级排队',
    job: '把代码库里所有动效变成可执行的改进清单',
    summary:
      '面向整个代码库的审计。产出不是一份观感报告，而是一组有优先级、彼此独立、任何智能体都能直接领走执行的改进项。适合接手老项目或准备大规模翻新。',
    when: [
      '接手一个动效风格不统一的老项目',
      '要在一次迭代里批量修掉最刺眼的问题',
      '需要把改进工作拆给多个智能体并行做',
    ],
    does: [
      { k: '全量盘点', v: '扫出所有动画实现，按影响面与观感代价排序' },
      { k: '自包含', v: '每条改进都自带上下文，换一个智能体也能直接执行' },
      { k: '排优先级', v: '先修用户每天都会看到的，再修角落里的' },
      { k: '不扩大', v: '不做搭便车的重构，改动范围锁定在动效本身' },
    ],
    prompt: '用 improve-animations 审计 src/ 下所有动效，输出十条按优先级排列的改进项。',
    pairs: ['find-animation-opportunities', 'review-animations', 'emil-design-eng'],
    href: 'https://github.com/emilkowalski/skills/blob/main/skills/improve-animations/SKILL.md',
  },
  {
    slug: 'find-animation-opportunities',
    name: 'find-animation-opportunities',
    title: '找出该动的地方',
    group: 'motion',
    tagline: '也告诉你哪些不该动',
    job: '在动效之外，先把该不该做判断清楚',
    summary:
      '排查界面里真正能从动效中受益的位置。它的价值一半在建议做什么，另一半在拦住你：列表滚动、大段文本、高频重复的操作，加动效只会让人更累。',
    when: [
      '界面「很平」，但不知道该从哪开始加动效',
      '担心动效加多了，反而显得吵',
      '要给一个成熟产品补动效，需要先排点',
    ],
    does: [
      { k: '找机会', v: '定位状态变化、空间关系、因果反馈这三类真正受益的场景' },
      { k: '劝退', v: '明确列出不该做动效的位置，并说明原因' },
      { k: '排次序', v: '按用户感知强度排序，先做能被注意到的' },
      { k: '控预算', v: '给出这一版建议做几处，避免一次全上' },
    ],
    prompt: '用 find-animation-opportunities 看这个设置页，指出该加动效的三处和不该动的两处。',
    pairs: ['improve-animations', 'animate', 'emil-design-eng'],
    href: 'https://github.com/emilkowalski/skills/blob/main/skills/find-animation-opportunities/SKILL.md',
  },
  {
    slug: 'animation-vocabulary',
    name: 'animation-vocabulary',
    title: '动效措辞',
    group: 'motion',
    tagline: '先说准，才能做对',
    job: '把模糊的感觉翻译成 AI 能执行的描述',
    summary:
      '多数糟糕的动效不是写坏的，是描述坏的。这个 skill 给你一套准确的词汇：回弹、跟随、迟滞、错峰、惯性。用这些词提需求，智能体第一次就能生成接近你想要的结果。',
    when: [
      '只会说「顺滑一点」「高级一点」',
      '反复生成都不满意，但说不清差在哪',
      '团队协作时需要一套共同语言',
    ],
    does: [
      { k: '给词汇', v: '把常见观感映射到具体的曲线、时长与编排方式' },
      { k: '改说法', v: '把你原本的模糊描述改写成可执行的需求' },
      { k: '对齐', v: '让设计、前端与智能体说的是同一件事' },
      { k: '避坑', v: '点出那些听起来专业但无人能执行的描述' },
    ],
    prompt: '帮我把「弹出来的时候要有点高级感」改写成 animation-vocabulary 里的准确描述。',
    pairs: ['animate', 'prototype', 'review-animations'],
    href: 'https://github.com/emilkowalski/skills/blob/main/skills/animation-vocabulary/SKILL.md',
  },
  {
    slug: 'apple-design',
    name: 'apple-design',
    title: 'Apple 设计原则',
    group: 'design',
    tagline: 'WWDC 的原则，翻成 Web 能用的',
    job: '把平台级的界面与流畅度原则落到 Web 语境',
    summary:
      '提炼自 Apple WWDC 设计演讲的界面与动效原则，并翻译成 Web 上能执行的写法。重点不是模仿 iOS 的外观，而是理解它为什么流畅：视觉连续性、层级清晰、响应即时。',
    when: [
      '想做出那种「连续的」而不是「切页」的体验',
      '需要一套关于层级与深度的可靠做法',
      '要把移动端的手感迁移到 Web',
    ],
    does: [
      { k: '连续性', v: '状态之间保留视觉关联，不要整块替换' },
      { k: '深度', v: '用阴影、缩放与模糊表达前后，而不是加边框' },
      { k: '即时响应', v: '先给反馈再等结果，避免空等待' },
      { k: '平台感', v: '尊重各平台既有的手势与返回习惯' },
    ],
    prompt: '用 apple-design 的原则重做这个列表到详情的过渡，保证视觉连续性。',
    pairs: ['animate', 'mobile-native', 'animate-expo'],
    href: 'https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md',
  },
  {
    slug: 'write-swift',
    name: 'write-swift',
    title: '现代 Swift',
    group: 'platform',
    tagline: '写今天该写的 Swift',
    job: '把 Swift 的现代写法变成默认写法',
    summary:
      '面向 Swift 本身的工程 skill：值类型优先、Swift 6 并发、泛型设计、性能取舍，以及用 Swift Testing 写测试。让智能体输出符合当前语言习惯的代码，而不是 Objective-C 时代的直译。',
    when: [
      '在写或重写 Swift 代码，希望符合现代习惯',
      '要把旧代码迁到 Swift 6 并发模型',
      '不确定某个抽象该用结构体还是类',
    ],
    does: [
      { k: '值语义', v: '优先结构体与枚举，明确什么时候才需要引用语义' },
      { k: '并发', v: '按 Swift 6 的隔离与 Sendable 规则组织代码' },
      { k: '泛型', v: '用泛型消除重复，同时不过度抽象' },
      { k: '测试', v: '用 Swift Testing 写可读的断言与参数化用例' },
    ],
    prompt: '用 write-swift 重写这个网络层，遵循 Swift 6 并发规则并补上 Swift Testing 用例。',
    pairs: ['animate-expo', 'apple-design'],
    href: 'https://github.com/emilkowalski/skills/blob/main/skills/write-swift/SKILL.md',
  },
  {
    slug: 'pick-ui-library',
    name: 'pick-ui-library',
    title: '选库',
    group: 'craft',
    tagline: '别再手写一个 toast',
    job: '基于真实使用经验挑库，而不是抓阄',
    summary:
      '让智能体从作者实际使用并信赖的库里挑，而不是临场生成一个 toast 组件，或者装一个已经停止维护的包。选择依据是任务本身，不是热度。',
    when: [
      '要引入一个新组件但不知道该用哪个库',
      '担心选到一个没人维护的包',
      '智能体打算手写一个已经有成熟方案的东西',
    ],
    does: [
      { k: '先分类', v: '判断这个需求属于哪一类，再在该类里比候选' },
      { k: '查状态', v: '排除已废弃、长期不更新、依赖过重的选项' },
      { k: '给理由', v: '说明为什么是它，以及什么情况下应该换' },
      { k: '别重造', v: '已有成熟方案时明确阻止手写' },
    ],
    prompt: '用 pick-ui-library 为这个表单挑一个日期选择方案，说明为什么不用手写。',
    pairs: ['prototype', 'ask-sonner', 'emil-design-eng'],
    href: 'https://github.com/emilkowalski/skills/blob/main/skills/pick-ui-library/SKILL.md',
  },
  {
    slug: 'prototype',
    name: 'prototype',
    title: '多版本原型',
    group: 'design',
    tagline: '一次给几个，再挑一个',
    job: '把一段 UI 做出多个可切换的版本',
    summary:
      '针对你描述的 UI 片段同时构建几个方向不同的版本，并配一个切换器逐个浏览。判断界面好坏最有效的方式从来不是描述它，而是把几个版本摆在一起看。',
    when: [
      '对某个模块的形态还没有方向',
      '想比较几种信息密度或布局方案',
      '需要快速给团队看几个可选方向',
    ],
    does: [
      { k: '出方向', v: '给出差异真实存在的版本，而不是换个配色的同一版' },
      { k: '可切换', v: '提供切换器，同屏对比而不是来回滚动' },
      { k: '带说明', v: '每个版本说清楚它适合什么场景' },
      { k: '留入口', v: '选定后能直接进入精修流程' },
    ],
    prompt: '用 prototype 给这个空状态做三个方向，并加一个切换器逐个浏览。',
    pairs: ['apple-design', 'pick-ui-library', 'animation-vocabulary'],
    href: 'https://github.com/emilkowalski/skills/blob/main/skills/prototype/SKILL.md',
  },
  {
    slug: 'mobile-native',
    name: 'mobile-native',
    title: 'Web 的原生手感',
    group: 'platform',
    tagline: '修掉那些「一眼是网页」的细节',
    job: '把网站在手机上的违和感一处一处清掉',
    summary:
      '顽固的 hover 态、点击高亮闪烁、100vh 的坑、聚焦就缩放的输入框、迟钝的点击、安全区域。这些细节单看都很小，合在一起就决定了你的应用像网页还是像 App。',
    when: [
      'Web 应用在手机上总感觉不对劲',
      '地址栏收起时布局突然跳动',
      '点击有延迟，或者输入框一聚焦页面就放大',
    ],
    does: [
      { k: '修 hover', v: '用悬停媒体查询隔离桌面专属状态，避免手机上残留' },
      { k: '修视口', v: '用动态视口单位替代 100vh，处理地址栏与键盘' },
      { k: '修点击', v: '去掉高亮闪烁与点击延迟，让反馈即时' },
      { k: '修安全区', v: '处理刘海、圆角与底部手势条，避免内容被遮' },
    ],
    prompt: '用 mobile-native 检查这个页面在手机上的表现，逐条列出违和的地方。',
    pairs: ['apple-design', 'animate', 'review-animations'],
    href: 'https://github.com/emilkowalski/skills/blob/main/skills/mobile-native/SKILL.md',
  },
  {
    slug: 'ask-sonner',
    name: 'ask-sonner',
    title: 'Sonner 用法',
    group: 'craft',
    tagline: 'toast 这件小事做到位',
    job: '把提示组件的配置、样式与边界情况一次说清',
    summary:
      '作者开发的 toast 库 Sonner 的使用指南：配置、样式、常见配方，以及那些几乎每个人都会遇到的坑。一个提示组件做对了，整个应用的完成度会高出一截。',
    when: [
      '在接入或调整 Sonner',
      '提示的堆叠、位置、时长需要定制',
      '遇到重复提示、更新不生效之类的老问题',
    ],
    does: [
      { k: '配置', v: '位置、时长、堆叠数量按场景给出建议值' },
      { k: '样式', v: '在保持可辨识的前提下贴合你的设计系统' },
      { k: '配方', v: 'Promise 提示、可更新提示、带操作按钮的提示' },
      { k: '排障', v: '针对已知问题给出确切修法，而不是试错' },
    ],
    prompt: '用 ask-sonner 配一套表单提交提示，包含加载、成功与可重试的失败态。',
    pairs: ['pick-ui-library', 'animate', 'emil-design-eng'],
    href: 'https://github.com/emilkowalski/skills/blob/main/skills/ask-sonner/SKILL.md',
  },
];

export const skillMap = new Map(skills.map((s) => [s.slug, s]));

export function skillBySlug(slug: string): Skill | undefined {
  return skillMap.get(slug);
}

export function groupLabel(id: GroupId): string {
  return groups.find((g) => g.id === id)?.label ?? id;
}
