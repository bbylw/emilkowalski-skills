export type Stage = 'intent' | 'build' | 'review' | 'ship';

export const stages: { id: Stage; label: string; note: string }[] = [
  { id: 'intent', label: '立意', note: '先搞清楚该做什么、该说什么' },
  { id: 'build', label: '构建', note: '把决定变成实现' },
  { id: 'review', label: '审查', note: '按规则逐条挑错' },
  { id: 'ship', label: '收尾', note: '补齐边界情况再交付' },
];

export type ChainStep = {
  slug: string;
  stage: Stage;
  role: string;
  output: string;
};

export type Playbook = {
  id: string;
  title: string;
  scene: string;
  question: string;
  chain: ChainStep[];
  soloLimit: string;
  gain: string;
  prompts: string[];
};

export const playbooks: Playbook[] = [
  {
    id: 'one-motion',
    title: '做对一处动效',
    scene: '要新加一处展开、入场或状态切换，第一次就要是对的。',
    question: '这处动效该用哪条曲线，它能通过审查吗',
    chain: [
      {
        slug: 'animation-vocabulary',
        stage: 'intent',
        role: '把「高级一点」翻译成回弹、迟滞、错峰这些具体描述',
        output: '一份能被直接执行的需求描述',
      },
      {
        slug: 'animate',
        stage: 'build',
        role: '按描述生成实现，同时把曲线、时长与属性一次选对',
        output: '一处动效代码与每条参数的选择理由',
      },
      {
        slug: 'review-animations',
        stage: 'review',
        role: '合并前按规则复核，把侥幸对的地方也确认一遍',
        output: '问题清单与可直接替换的写法',
      },
    ],
    soloLimit: '只用 animate，你会得到一处能跑的动效，但没法确认它符合你的原意，也没人检查它踩没踩坑。',
    gain: '描述、实现、复核三段闭合：做完就知道它对，而不是做完再看感觉。',
    prompts: [
      '用 animation-vocabulary 把「弹出来要有点高级感」改写成准确描述。',
      '按上面的描述，用 animate 实现这个面板的展开与收起。',
      '用 review-animations 审查刚才的实现，按严重程度列出问题。',
    ],
  },
  {
    id: 'audit-legacy',
    title: '翻新一个老界面',
    scene: '接手动效风格不统一的项目，要在一次迭代里改掉最刺眼的部分。',
    question: '先改哪几处，改完怎么保证不回退',
    chain: [
      {
        slug: 'find-animation-opportunities',
        stage: 'intent',
        role: '先排点：哪些地方值得动，哪些地方必须别碰',
        output: '该做与不该做的清单，按感知强度排序',
      },
      {
        slug: 'improve-animations',
        stage: 'build',
        role: '全库审计，把结论变成一条条可独立执行的改进项',
        output: '带优先级的改进清单，可拆分并行',
      },
      {
        slug: 'review-animations',
        stage: 'review',
        role: '每改完一批就复核一次，避免新改动引入新的不一致',
        output: '逐条通过的复核记录',
      },
    ],
    soloLimit: '只用 improve-animations，你会改掉所有错的地方，也会一起改掉本来就对的地方，还可能在安静的角落加出噪点。',
    gain: '先排点再动手，改动集中在用户真的会看到的地方，且不回退。',
    prompts: [
      '用 find-animation-opportunities 看这个页面，指出该加的三处和不该动的两处。',
      '用 improve-animations 审计 src/ 下所有动效，输出十条按优先级排列的改进项。',
      '改完后用 review-animations 复核这一批改动。',
    ],
  },
  {
    id: 'native-feel',
    title: '让 Web 应用有原生手感',
    scene: '页面在手机上总是不对劲，说不出具体哪里像网页。',
    question: '违和感具体来自哪些细节，怎么系统性清掉',
    chain: [
      {
        slug: 'mobile-native',
        stage: 'build',
        role: '清掉 hover 残留、100vh 跳动、点击高亮、安全区域这些硬伤',
        output: '逐条列出的违和点与修法',
      },
      {
        slug: 'apple-design',
        stage: 'build',
        role: '补上平台级原则：视觉连续、层级清晰、响应即时',
        output: '过渡与层级的重构方案',
      },
      {
        slug: 'animate',
        stage: 'review',
        role: '按同一套规则打磨剩下的过渡，让手感统一',
        output: '统一的动效参数与实现',
      },
    ],
    soloLimit: '只用 mobile-native，你能修好所有技术性毛病，但页面仍然只是「不出错的网页」，不会变成「顺手的应用」。',
    gain: '先修硬伤，再补语汇，最后统一手感。三步之后差距是整体性的，不是补丁式的。',
    prompts: [
      '用 mobile-native 检查这个页面在手机上的表现，逐条列出违和的地方。',
      '按 apple-design 的原则重做列表到详情的过渡。',
      '用 animate 统一剩下过渡的曲线与时长。',
    ],
  },
  {
    id: 'decide-direction',
    title: '从一句话到能拍板',
    scene: '对某个模块还没有方向，需要在动手前比较几种做法。',
    question: '哪个方向值得继续，依据是什么',
    chain: [
      {
        slug: 'prototype',
        stage: 'intent',
        role: '一次做出几个差异真实存在的版本，配切换器同屏比较',
        output: '三到四个可切换的方向',
      },
      {
        slug: 'apple-design',
        stage: 'build',
        role: '用平台原则评估并精修选定的版本',
        output: '层级与过渡都站得住的定稿方向',
      },
      {
        slug: 'pick-ui-library',
        stage: 'ship',
        role: '确定实现所需的库，避免手写一个已有成熟方案的东西',
        output: '选库结论与理由',
      },
    ],
    soloLimit: '只用 prototype，你会得到几个版本，但仍然靠直觉选，而且选完常常发现实现要用的库选错了。',
    gain: '从比较、定稿到选库是一条链，拍板的时候同时知道它能不能落地。',
    prompts: [
      '用 prototype 给这个空状态做三个方向，加一个切换器逐个浏览。',
      '按 apple-design 的原则精修选定的那个方向。',
      '用 pick-ui-library 确定实现要用哪些库，说明为什么不用手写。',
    ],
  },
  {
    id: 'final-gate',
    title: '交付前的终审',
    scene: '功能都做完了，发布前想确认界面经得起看。',
    question: '还有哪些地方是「能跑但不对」的',
    chain: [
      {
        slug: 'review-animations',
        stage: 'review',
        role: '按规则逐条复核所有动效，先找出确定的问题',
        output: '问题清单与替换写法',
      },
      {
        slug: 'emil-design-eng',
        stage: 'review',
        role: '回到总纲，检查层级、材质、留白这些更基础的地方',
        output: '界面层面的修正意见',
      },
      {
        slug: 'improve-animations',
        stage: 'ship',
        role: '把剩余问题排成可执行的清单，留到下一个迭代',
        output: '带优先级的后续改进项',
      },
    ],
    soloLimit: '只用 review-animations，你能保证动效没错，但没法判断界面本身是不是站得住。',
    gain: '动效、界面、后续计划三层各查一遍，发布时知道剩下了什么。',
    prompts: [
      '用 review-animations 审查本次要发布的改动。',
      '按 emil-design-eng 的规则检查层级、阴影与留白。',
      '用 improve-animations 把剩下的小问题排成下一轮清单。',
    ],
  },
  {
    id: 'native-motion',
    title: '移动端的动效从零到一',
    scene: '在 RN 或 Expo 里做交互，真机上掉帧，模拟器里却正常。',
    question: '怎么让它跟手，又不掉帧',
    chain: [
      {
        slug: 'animate-expo',
        stage: 'build',
        role: '把动画放到 UI 线程，手势与动画共享同一个驱动源',
        output: '跟手且可中断的实现',
      },
      {
        slug: 'apple-design',
        stage: 'build',
        role: '对齐平台习惯：弹层、页面切换、返回手势',
        output: '符合预期的交互语汇',
      },
      {
        slug: 'review-animations',
        stage: 'review',
        role: '在真机条件下复核，参数与降级一并检查',
        output: '上线前的复核结论',
      },
    ],
    soloLimit: '只用 animate-expo，动画能跑在正确的线程上，但手势习惯与平台预期仍然可能对不上。',
    gain: '性能、语汇、审查三件事一起解决，真机上的手感才立得住。',
    prompts: [
      '用 animate-expo 实现这个底部弹层的拖拽关闭，确保运行在 UI 线程。',
      '按 apple-design 的原则对齐页面切换与返回手势。',
      '用 review-animations 在真机条件下复核这批动效。',
    ],
  },
];
