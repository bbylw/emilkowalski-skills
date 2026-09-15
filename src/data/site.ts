import { skills } from './skills';

export const site = {
  name: 'Skills',
  title: '面向设计师与工程师的 Skills',
  description: `emilkowalski/skills 的中文整理：${skills.length} 个把动效与界面判断写成规则的 skill，以及把它们串起来时真正发挥作用的方式。`,
  install: 'npx skills@latest add emilkowalski/skills',
  subscribe: 'https://animations.dev/skills',
  repo: 'https://github.com/emilkowalski/skills',
  skillsSh: 'https://skills.sh/emilkowalski/skills',
  author: 'Emil Kowalski',
  authorSite: 'https://emilkowal.ski/',
  sonner: 'https://sonner.emilkowal.ski',
  nav: [
    { label: '组合手册', href: '/playbook' },
    { label: '全部 Skills', href: '/skills' },
  ],
} as const;
