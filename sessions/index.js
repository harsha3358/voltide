// The single place that defines the four episodes (Cloud Computing Workshop sessions).
// `locked` sessions open with a facilitator code; `unlockHash` is SHA-256 of the
// upper-cased code. Change codes with `npm run facilitator:hash -- NEW-CODE`.
export const SESSIONS = [
  {
    number: 1,
    teaser: [
      'What the cloud really is',
      'Bits, bytes & the internet',
      'Cloud: what & why',
      'IaaS, PaaS & SaaS',
      'Public, private & hybrid',
      'Auto-scaling vs LAGZILLA',
      'VMs vs containers',
      'VirtualBox + Ubuntu lab',
      'Linux terminal basics',
      'AWS, Azure & GCP tour',
      'Cloud account safety'
    ],
    slug: 'spark',
    folder: '01-spark',
    name: 'SPARK',
    title: 'Cloud from Zero + Setup',
    tagline: 'From “what even is the cloud?” to running your own Ubuntu server. In one episode.',
    element: 'electricity',
    accent: '#ffdf20',
    accent2: '#53eafd',
    backdrop: 'world',
    world: { palette: { deep: '#0b3a66', crest: '#53eafd', flash: '#ffdf20', core: '#ffdf20' }, mood: 'spark' },
    locked: false,
    load: () => import('./01-spark/content.jsx'),
    guide: () => import('./01-spark/guide.md?raw')
  },
  {
    number: 2,
    teaser: [
      'IP addresses: public vs private',
      'DNS: the internet’s phonebook',
      'HTTP vs HTTPS',
      'TCP, UDP & ports',
      'Routers, gateways & NAT',
      'Firewalls & cloud security groups',
      'Lab: ping & ip addr / ipconfig',
      'Lab: nslookup, curl & traceroute'
    ],
    slug: 'current',
    folder: '02-current',
    name: 'CURRENT',
    title: 'Computer Networks',
    tagline: 'How your phone, a network and a cloud server actually talk. Spoiler: packets gossip.',
    element: 'electricity',
    accent: '#2b7fff',
    accent2: '#8ec5ff',
    backdrop: 'world',
    world: { palette: { deep: '#0a2a6e', crest: '#2b7fff', flash: '#8ec5ff', core: '#53eafd' }, mood: 'current' },
    locked: true,
    unlockHash: '8782ddb0dc18dfa0109ba9d305784c7a24861d96fd5fa98c378560c5d1f6fea7',
    load: () => import('./02-current/content.jsx'),
    guide: () => import('./02-current/guide.md?raw')
  },
  {
    number: 3,
    teaser: [
      'Launch a Linux virtual machine',
      'OS settings & VM resources',
      'Install a C compiler, run a program',
      'Build & run a basic web app',
      'Google App Engine (PaaS)',
      'AWS EC2, storage & access rules',
      'Quick demos: serverless & Hadoop',
      'Quick demos: databases & chatbots'
    ],
    slug: 'tide',
    folder: '03-tide',
    name: 'TIDE',
    title: 'Cloud Lab Practicals',
    tagline: 'Launch real VMs, compile code, run a web app, deploy on PaaS. Hands dirty, wallet safe.',
    element: 'water',
    accent: '#46ecd5',
    accent2: '#53eafd',
    backdrop: 'world',
    world: { palette: { deep: '#06403c', crest: '#46ecd5', flash: '#53eafd', core: '#00bba7' }, mood: 'tide' },
    locked: true,
    unlockHash: '21eb92bcf3b0bee8ea11b2e6be7abaf2cb0bc6f6b24a92a592e7db3a9a151c38',
    load: () => import('./03-tide/content.jsx'),
    guide: () => import('./03-tide/guide.md?raw')
  },
  {
    number: 4,
    teaser: [
      'Form teams of 3–4',
      'Build a portfolio or campus page',
      'Run it on a VM or approved cloud',
      'Test access from another device',
      'Secure it: ports & credentials',
      'Check logs & fix one issue',
      '3-minute live demo'
    ],
    slug: 'surge',
    folder: '04-surge',
    name: 'SURGE',
    title: 'Cloud Deployment Challenge',
    tagline: 'Squad up, ship a real site to the cloud, secure it, and flex it in a 3-minute live demo.',
    element: 'water',
    accent: '#8e51ff',
    accent2: '#e12afb',
    backdrop: 'world',
    world: { palette: { deep: '#2a0f5e', crest: '#8e51ff', flash: '#e12afb', core: '#e12afb' }, mood: 'surge' },
    locked: true,
    unlockHash: 'c7d46a4f956bd9d66277ff2b7a58ad36498e7f8eea988377c950420a3e78662c',
    load: () => import('./04-surge/content.jsx'),
    guide: () => import('./04-surge/guide.md?raw')
  }
];

export const getSession = n => SESSIONS.find(s => s.number === Number(n));
