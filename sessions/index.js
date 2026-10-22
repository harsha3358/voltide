// The single place that defines the four episodes (Cloud Computing Workshop sessions).
// `locked` sessions open with a facilitator code; `unlockHash` is SHA-256 of the
// upper-cased code. Change codes with `npm run facilitator:hash -- NEW-CODE`.
export const SESSIONS = [
  {
    number: 1,
    teaser: [
      'What the cloud really is',
      'Bits, bytes & data',
      'How the internet works',
      'Cloud: what & why',
      'IaaS, PaaS & SaaS',
      'Public, private & hybrid',
      'Auto-scaling vs LAGZILLA',
      'A quick history of the cloud',
      'VMs vs containers',
      'VirtualBox + Ubuntu lab',
      'Linux terminal basics',
      'AWS, Azure & GCP tour',
      'Cloud account safety'
    ],
    slug: 'spark',
    hero3d: { scene: 'cloud', label: 'A 3D cloud of light floating above glowing server racks, with data streaming up into it', hint: 'tap · strike lightning' },
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
      'Lab: nslookup, curl & traceroute',
      'Browser → server, the full journey'
    ],
    slug: 'current',
    hero3d: { scene: 'network', label: 'A 3D mesh of routers with packets hopping from your laptop to a cloud server', hint: 'tap · send a ping' },
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
    unlockHash: 'ff7b7fb714f62a9947627e90dcab8be0ae9fe62317982d04af7d0ee16777d745',
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
    hero3d: { scene: 'rack', label: 'A 3D fly-through of a data-centre aisle with virtual machines booting out of the racks', hint: 'tap · launch a VM' },
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
    unlockHash: 'ff7b7fb714f62a9947627e90dcab8be0ae9fe62317982d04af7d0ee16777d745',
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
      '3-minute live demo',
      'Clean up every resource'
    ],
    slug: 'surge',
    hero3d: { scene: 'city', label: 'A 3D night city lighting up as a deployment wave spreads from a server tower', hint: 'tap · deploy again' },
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
    unlockHash: 'ff7b7fb714f62a9947627e90dcab8be0ae9fe62317982d04af7d0ee16777d745',
    load: () => import('./04-surge/content.jsx'),
    guide: () => import('./04-surge/guide.md?raw')
  }
];

export const getSession = n => SESSIONS.find(s => s.number === Number(n));
