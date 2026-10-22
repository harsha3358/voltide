// EPISODE 01 · SPARK: Cloud from Zero + Setup
// Audience: first-year B.Tech students with no prior background (Gen Z / Gen Alpha).
// Every mission: hook → TL;DR → analogy → jargon → explanation → visual/demo → lab → checkpoint.
// Topics follow Session 01 of the Cloud Computing Workshop plan (facilitator/reference).
import MythCards from './demos/MythCards.jsx';
import BitSwitches from './demos/BitSwitches.jsx';
import PacketPipes from './visuals/PacketPipes.jsx';
import ServiceModels from './visuals/ServiceModels.jsx';
import ModelMatcher from './demos/ModelMatcher.jsx';
import DeployModels from './visuals/DeployModels.jsx';
import AutoScaleSim from './demos/AutoScaleSim.jsx';
import CloudTimeline from './visuals/CloudTimeline.jsx';
import VmVsContainer from './visuals/VmVsContainer.jsx';
import LabTopology from './visuals/LabTopology.jsx';
import TerminalSim from './demos/TerminalSim.jsx';
import ProviderTable from './visuals/ProviderTable.jsx';
import CloudShield from './demos/CloudShield.jsx';

export default {
  episode: {
    title: 'LAGZILLA is awake',
    lines: [
      '> 09:59 AM. Results day. 34,000 students hit refresh.',
      '> 10:00 AM. The college portal melts. 503 everywhere.',
      '> A monster called LAGZILLA feeds on crashed servers and spinning loaders.',
      '> Only one thing beats it: the cloud. And people who know how to use it.',
      '> Finish missions. Earn XP. Decrypt its message. Then take it down.'
    ],
    reward: '13 missions · 11 badges · 1 boss fight · 1 secret message'
  },
  transmission: 'THE CLOUD IS JUST SOMEONE ELSE’S COMPUTER',
  boss: {
    name: 'LAGZILLA',
    taunt: 'LAGZILLA thinks freshers will panic on results day. Prove it wrong. Everything you need was in this episode.',
    win: 'Portal back online, servers scaling, LAGZILLA deleted. Rank up, flex the badge, and get ready for Episode 02 · CURRENT.',
    questions: [
      { q: 'Gmail and Google Docs are examples of…', options: ['IaaS', 'PaaS', 'SaaS'], answer: 2 },
      { q: 'You rent a bare Ubuntu server on AWS EC2. That is…', options: ['IaaS', 'SaaS', 'On-premises'], answer: 0 },
      { q: 'Results-day traffic triples. The cloud adds servers automatically. This is called…', options: ['Elasticity / auto-scaling', 'Downloading', 'Compiling'], answer: 0 },
      { q: 'With IaaS, who installs OS updates on your VM?', options: ['The provider', 'You', 'Nobody'], answer: 1 },
      { q: 'A container is lighter than a VM because it…', options: ['Has no apps', 'Shares the host’s OS kernel', 'Runs only on phones'], answer: 1 },
      { q: 'Which software runs a VM on your laptop?', options: ['VirtualBox', 'Instagram', 'Excel'], answer: 0 },
      { q: 'Which command shows the folder you are in?', options: ['`ls`', '`pwd`', '`whoami`'], answer: 1 },
      { q: 'Workshop over. Your cloud VM is still running. You…', options: ['Leave it, it’s free forever', 'Stop or delete it', 'Make it bigger'], answer: 1 }
    ]
  },
  intro:
    'Episode 01, where you learn that the cloud is not in the sky, the internet is basically plumbing, and your laptop can secretly run a second computer. We start with what a **bit** is, decode **IaaS, PaaS and SaaS**, watch servers auto-scale on results day, then build your own **Ubuntu virtual machine** and type your first Linux commands.',
  outcomes: [
    'Explain what cloud computing is and why everyone uses it',
    'Tell IaaS, PaaS and SaaS apart, and public, private and hybrid clouds',
    'Explain elasticity, pay-as-you-go and regions with a real example',
    'Explain the difference between a virtual machine and a container',
    'Run an Ubuntu VM in VirtualBox or VMware and use basic Linux commands',
    'Find your way around AWS, Azure and Google Cloud and keep your account safe'
  ],
  topics: [
    {
      id: 'welcome',
      hook: 'Real talk: Instagram, Netflix, UPI, your college portal. None of it runs on a computer in their office. So where does it run?',
      short: 'What is the cloud?',
      kicker: 'Ignite',
      title: 'What is the cloud, really?',
      lead: 'Before any consoles or commands: what is this “cloud” everyone keeps talking about, and why should a first-year student care?',
      plain: 'The **cloud** is computers, storage and software that you **rent over the internet** instead of buying and running yourself.',
      analogy: {
        type: 'water',
        text: 'Real clouds are water that moved somewhere else and comes back as rain whenever it’s needed. Cloud computing is computing power that lives somewhere else and “rains down” on your phone or laptop the moment you ask for it.'
      },
      jargon: [
        ['Cloud computing', 'renting computing power, storage and apps over the internet.'],
        ['Data centre', 'a giant building full of servers, cooling and backup power.'],
        ['Cloud provider', 'the company you rent from: AWS, Microsoft Azure, Google Cloud.']
      ],
      body: [
        'Every time you stream a video, back up photos or check results, a server in a data centre somewhere is doing the work. Companies used to buy those servers themselves. Now most of them rent, because renting is faster, cheaper to start and grows with you. Let’s bust some myths first.'
      ],
      demo: { id: 'demo-myths', title: 'MYTH BUSTER', hint: 'tap each card', intro: 'Each card is something people believe about the cloud. Flip it to see what’s actually true.', el: <MythCards /> },
      check: {
        q: 'Where does “the cloud” physically live?',
        options: ['In actual clouds in the sky', 'In data centres full of servers, connected by the internet', 'Inside your phone only', 'Nowhere, it’s imaginary'],
        answer: 1,
        explain: 'The cloud is real hardware in data centres. You just reach it over the internet instead of owning it.'
      }
    },
    {
      id: 'digital-basics',
      hook: 'Every meme you’ve ever sent? Just 0s and 1s. Flip some switches and see the Matrix for real.',
      short: 'Bits, bytes & data',
      kicker: 'From zero',
      title: 'Bits, bytes and data: what the cloud actually stores',
      lead: 'Cloud storage is priced per GB and cloud servers per GB of RAM. So first: what even is a GB?',
      plain: 'Computers only understand **on (1)** and **off (0)**. One of these is a **bit**. Eight bits make a **byte**, which is enough for one letter.',
      analogy: {
        type: 'electric',
        text: 'A bit is a **light switch**. Eight switches in a row can make 256 patterns, enough to give every letter, digit and symbol its own pattern.'
      },
      jargon: [
        ['Bit', 'a single 0 or 1.'],
        ['Byte', '8 bits. One English letter.'],
        ['ASCII', 'the table that maps numbers to letters (65 = A). See the full [ASCII table](https://en.wikipedia.org/wiki/ASCII).'],
        ['KB / MB / GB / TB', 'roughly a thousand / million / billion / trillion bytes.']
      ],
      points: [
        '**1 KB**: a short paragraph of text.',
        '**1 MB**: a good-quality photo.',
        '**1 GB**: about an hour of HD video. Free cloud storage plans usually start at 5–15 GB.',
        '**1 TB**: about 1,000 GB. A cloud data centre holds millions of these.'
      ],
      demo: { id: 'demo-bits', title: 'BINARY LIGHT SWITCHES', hint: 'click the bulbs', intro: 'Turn the switches on and off. Add up the lit weights to get the number, then the ASCII table turns it into a letter.', el: <BitSwitches /> },
      check: {
        q: 'The bulbs show `01000010`. Lit weights are 64 and 2. What number, and which letter?',
        options: ['66 → “B”', '42 → “*”', '65 → “A”', '130 → not a letter'],
        answer: 0,
        explain: '64 + 2 = 66, and 66 is “B” in ASCII (A = 65, B = 66 …).'
      }
    },
    {
      id: 'how-internet-works',
      hook: 'Your DM just took a world tour in 40 milliseconds. Here’s the route it took.',
      short: 'How the internet works',
      kicker: 'From zero',
      title: 'How the internet carries your data to the cloud',
      lead: 'The cloud is only useful because the internet connects you to it. Your request is chopped into packets that race through routers and cables to a data centre and back.',
      plain: 'The internet is **millions of computers joined by cables and radio waves**. Data travels in small pieces called **packets**, and every device has an **IP address** so packets know where to go.',
      analogy: {
        type: 'water',
        text: 'Picture a city water network. Your message is poured into the pipes as many small **buckets (packets)**, each with an address painted on it. Junctions (**routers**) push each bucket down the right pipe, and at the other end they’re poured back together.'
      },
      jargon: [
        ['Client', 'the device asking for something (your phone).'],
        ['Server', 'the computer that answers (often a cloud VM).'],
        ['IP address', 'a device’s address on a network, like `192.168.1.5`.'],
        ['Router', 'a junction that forwards packets toward their destination.'],
        ['ISP', 'Internet Service Provider: Jio, Airtel, BSNL, your campus.']
      ],
      visual: { caption: 'Packet journey · your phone → a cloud server', note: 'hover each stop', el: <PacketPipes /> },
      photos: [{ file: 'Network_switches.jpg', caption: 'Real network switches: every cable is one device’s connection into the network. Your packets pass through boxes like these.' }],
      links: [
        { href: '#/session/2', label: 'Episode 02 goes deep on networks' },
        { href: 'https://en.wikipedia.org/wiki/Internet', label: 'Read: How the Internet works' }
      ],
      check: {
        q: 'Why does each packet need a destination **IP address**?',
        options: ['To look nice', 'So every router along the way knows where to forward it', 'To make it faster', 'Packets don’t need addresses'],
        answer: 1,
        explain: 'Routers read the destination address on each packet and pass it down the right pipe, like a postal sorting office.'
      }
    },
    {
      id: 'cloud-basics',
      hook: '“It’s in the cloud” = it’s on someone else’s computer. Whose? Why rent instead of buy?',
      short: 'Cloud: what & why',
      kicker: 'Core idea',
      title: 'Cloud computing: what it is and why it matters',
      lead: 'Why did companies from Netflix to your favourite food-delivery app stop buying their own servers?',
      plain: 'With the cloud you **rent** servers, storage and software **on demand** over the internet and **pay only for what you use**, instead of buying hardware upfront.',
      analogy: {
        type: 'water',
        text: 'You don’t dig a well to get water. You open a tap and pay the water board for what you use. The cloud does the same for computing: open an account, use servers by the hour, and stop paying when you turn them off.'
      },
      jargon: [
        ['On-demand', 'get a server in minutes, whenever you want.'],
        ['Pay-as-you-go', 'billed per second, hour or GB used. No big upfront cost.'],
        ['Region', 'a geographic location of data centres, e.g. AWS Mumbai (ap-south-1).'],
        ['Availability zone', 'a separate data centre inside a region, so one failure doesn’t take everything down.']
      ],
      points: [
        '**No upfront cost**: a student can rent a server for less than the price of a samosa per hour (or free on the free tier).',
        '**Speed**: a new server is ready in about a minute, not weeks of ordering hardware.',
        '**Scale**: handle 100 users today and 1 lakh tomorrow.',
        '**Global**: put your app in a region close to your users, e.g. Mumbai for India.',
        '**Someone else handles the boring stuff**: electricity, cooling, broken hard disks and physical security.'
      ],
      photos: [{ file: 'CERN_Server_03.jpg', caption: 'Inside a real data centre (CERN): rows of servers like these are what “the cloud” physically is.' }],
      links: [{ href: 'https://aws.amazon.com/what-is-cloud-computing/', label: 'AWS: What is cloud computing?' }],
      check: {
        q: 'Your fest website needs huge power for 3 days a year and almost nothing otherwise. Why is the cloud perfect for this?',
        options: ['It’s always free', 'You rent big servers only for those days and pay only for what you use', 'It needs no internet', 'It makes the site look better'],
        answer: 1,
        explain: 'Pay-as-you-go plus on-demand scaling: rent big for 3 days, shrink back afterwards, and stop paying.'
      }
    },
    {
      id: 'service-models',
      hook: 'IaaS, PaaS, SaaS sound like Pokémon evolutions. They’re actually just “how much do you want to manage?”',
      short: 'IaaS, PaaS & SaaS',
      kicker: 'Core idea',
      title: 'IaaS, PaaS and SaaS: who manages what?',
      lead: 'Every cloud service answers one question: how much of the stack is your job, and how much is the provider’s?',
      plain: '**IaaS** rents you raw servers. **PaaS** runs your code for you. **SaaS** is a finished app you just use. The further along, the less you manage.',
      analogy: {
        type: 'water',
        text: 'IaaS is renting a water tank: you handle the plumbing. PaaS is piped water to a tap: you just decide what to do with it. SaaS is bottled water: ready to drink.'
      },
      jargon: [
        ['IaaS', 'Infrastructure as a Service: virtual machines, storage, networks ([AWS EC2](https://aws.amazon.com/ec2/)).'],
        ['PaaS', 'Platform as a Service: upload code, it runs ([Google App Engine](https://cloud.google.com/appengine)).'],
        ['SaaS', 'Software as a Service: finished apps (Gmail, Zoom, Canva).'],
        ['On-premises', 'everything owned and run in your own building.']
      ],
      body: ['Pick a model below and watch the provider’s **waterline** rise up the stack. Everything above the waterline is still your job.'],
      visual: { caption: 'Service models · who manages which layer?', note: 'pick a model', el: <ServiceModels /> },
      demo: { id: 'demo-models', title: 'MODEL MATCHER', hint: '6 real situations', intro: 'Match each situation to IaaS, PaaS, SaaS or on-premises. Get all six for a badge.', el: <ModelMatcher /> },
      check: {
        q: 'Your team deploys a website on an **IaaS** virtual machine. Who installs the OS updates?',
        options: ['The cloud provider, always', 'Your team: with IaaS you manage the OS and everything above it', 'Nobody, the cloud does it by magic', 'The college'],
        answer: 1,
        explain: 'With IaaS the provider runs the hardware and virtualisation; the **operating system, apps and data are yours**.'
      }
    },
    {
      id: 'deployment-models',
      hook: 'Public, private, hybrid. Basically: do you share the hostel room, have your own room, or both?',
      short: 'Public, private & hybrid',
      kicker: 'Core idea',
      title: 'Public, private and hybrid cloud',
      lead: 'Service models are about *what* you rent. Deployment models are about *where* it lives and *who* shares it.',
      plain: '**Public** cloud is shared and rented from a provider. **Private** cloud is used by one organisation only. **Hybrid** mixes both.',
      analogy: {
        type: 'electric',
        text: 'Public cloud is the city power grid: everyone shares it and pays per unit. Private cloud is your own generator. Hybrid is running on the grid but keeping the generator for the important stuff.'
      },
      jargon: [
        ['Public cloud', 'shared infrastructure from AWS, Azure, Google Cloud.'],
        ['Private cloud', 'cloud-style setup dedicated to one organisation.'],
        ['Hybrid cloud', 'private and public connected together.'],
        ['Multi-cloud', 'using more than one public provider.']
      ],
      visual: { caption: 'Four ways to deploy', note: 'hover for spotlight', el: <DeployModels /> },
      check: {
        q: 'A college keeps exam data on its own servers but hosts the fest website on AWS. Which model is that?',
        options: ['Public only', 'Private only', 'Hybrid', 'SaaS'],
        answer: 2,
        explain: 'Private for the sensitive data plus public cloud for the rest = **hybrid**.'
      }
    },
    {
      id: 'elasticity',
      hook: 'Results day. 34,000 people hit refresh at 10 AM. Your 3 servers have entered the chat… and left.',
      short: 'Scaling & pay-as-you-go',
      kicker: 'Superpower',
      title: 'Elasticity: the cloud’s superpower',
      lead: 'Traffic is never flat. The cloud’s killer feature is growing and shrinking automatically, so you never pay for empty servers or crash under a crowd.',
      plain: '**Elasticity** means the cloud adds servers when traffic rises and removes them when it falls. You pay for what runs.',
      analogy: {
        type: 'water',
        text: 'A dam with automatic gates: when the river floods, more gates open; when it calms down, they close. No flood, no wasted water.'
      },
      jargon: [
        ['Scalability', 'the ability to handle more load by adding resources.'],
        ['Auto-scaling', 'the cloud adding or removing servers automatically.'],
        ['Load balancer', 'spreads visitors evenly across servers.'],
        ['Downtime', 'when a site is unavailable. LAGZILLA’s favourite snack.']
      ],
      demo: { id: 'demo-scale', title: 'RESULTS-DAY SIMULATOR', hint: 'drag the traffic', intro: 'Pick a scenario or drag the slider. Compare the college’s own 3 servers with cloud auto-scaling, and watch the cost.', el: <AutoScaleSim /> },
      check: {
        q: 'At 3 AM almost nobody visits. What does an auto-scaled cloud site do?',
        options: ['Keeps all 17 servers running', 'Scales down to fewer servers, so the bill drops', 'Shuts the website off', 'Buys more servers'],
        answer: 1,
        explain: 'Elasticity works both ways: scale **up** for crowds, scale **down** when quiet, and pay less.'
      }
    },
    {
      id: 'cloud-history',
      hook: 'The cloud is younger than most of your teachers’ phones. Speedrun of its history:',
      short: 'Cloud history',
      kicker: 'Context',
      title: 'How we got here: a quick history of the cloud',
      lead: 'In about 20 years, renting computers went from a weird idea to how almost every app on your phone works.',
      plain: 'The cloud grew in stages: rent storage and servers (2006), rent platforms (2008), containers (2013), serverless (2014) and local regions in India (2016 onwards).',
      analogy: {
        type: 'electric',
        text: 'A century ago every factory had its own power generator. Then the power grid arrived and they all plugged in. Computing went through the same shift: from each company’s own server room to the shared cloud.'
      },
      visual: { caption: 'Cloud computing timeline', el: <CloudTimeline /> },
      links: [{ href: 'https://en.wikipedia.org/wiki/Cloud_computing', label: 'Read: Cloud computing (Wikipedia)' }],
      check: {
        q: 'Which idea lets you run code only when something happens, paying per millisecond?',
        options: ['On-premises', 'Serverless', 'Floppy disks', 'Private cloud'],
        answer: 1,
        explain: '**Serverless** (like AWS Lambda) runs your function on demand. You never manage a server.'
      }
    },
    {
      id: 'vms-containers',
      hook: 'Your laptop can secretly run a second computer inside it. And containers are even lighter. Let’s compare.',
      short: 'VMs vs containers',
      kicker: 'Under the hood',
      title: 'Virtual machines vs containers',
      lead: 'The cloud runs on two packaging ideas: virtual machines (whole pretend computers) and containers (just the app and what it needs).',
      plain: 'A **virtual machine** is a full computer made of software with its own operating system. A **container** packs only an app and its libraries and shares the host’s OS kernel.',
      analogy: {
        type: 'water',
        text: 'A VM is a separate water tank with its own pump. A container is a bottle filled from the main tank: lighter, quicker to fill, but sharing the same source.'
      },
      jargon: [
        ['Virtualisation', 'splitting one physical computer into several virtual ones.'],
        ['Hypervisor', 'software that runs VMs (VirtualBox, VMware).'],
        ['Container', 'a lightweight app package (e.g. Docker).'],
        ['Kernel', 'the core of the operating system that talks to hardware.']
      ],
      visual: { caption: 'Virtual machines vs containers', el: <VmVsContainer /> },
      points: [
        '**VMs**: stronger isolation, any OS, but heavier and take minutes to boot. Great for labs and cloud servers (EC2).',
        '**Containers**: start in seconds and pack many per server. Great for modern web apps.',
        'Cloud providers use both: you rent VMs, and many apps run as containers on top of them.'
      ],
      links: [{ href: 'https://www.docker.com/resources/what-container/', label: 'Docker: What is a container?' }],
      check: {
        q: 'Why does a container start faster than a VM?',
        options: ['It has more RAM', 'It shares the host’s kernel instead of booting a whole OS', 'It skips the internet', 'It is written in Python'],
        answer: 1,
        explain: 'No full guest OS to boot: the container reuses the host’s kernel, so it starts in seconds.'
      }
    },
    {
      id: 'virtual-lab',
      hook: 'Time to build your own mini cloud server, living inside your laptop. Zero rupees.',
      short: 'Set up your Ubuntu VM',
      kicker: 'Lab setup',
      title: 'Set up VirtualBox (or VMware) and Ubuntu',
      lead: 'Before touching a real cloud, practise on a virtual machine you fully control. Same Ubuntu, same commands, no bill.',
      plain: 'You will install a **hypervisor** (VirtualBox or VMware) and create an **Ubuntu VM**. If you break it, just restore a snapshot.',
      analogy: {
        type: 'water',
        text: 'Your VM is an **aquarium inside your house**: a whole little world in a glass box. Mess it up and you can refill it from a snapshot in seconds.'
      },
      jargon: [
        ['Host', 'your real laptop.'],
        ['Guest / VM', 'the virtual computer inside it.'],
        ['ISO', 'a file containing an operating system ready to install.'],
        ['Snapshot', 'a saved point you can roll back to.'],
        ['NAT', 'the VM shares your laptop’s internet connection.']
      ],
      visual: { caption: 'Your mini cloud server inside your laptop', note: 'hover each part', el: <LabTopology /> },
      lab: {
        id: 'lab-setup',
        title: 'Install VirtualBox and create an Ubuntu VM',
        goal: 'By the end your Ubuntu VM boots, has internet, and is fully updated. Needs: 8 GB RAM recommended (4 GB works), about 40 GB free disk, and **virtualisation (Intel VT-x / AMD-V) enabled in BIOS**.',
        steps: [
          { do: 'Download and install **VirtualBox** from the [official VirtualBox downloads page](https://www.virtualbox.org/wiki/Downloads) (pick your OS). Prefer VMware? [VMware Workstation Pro is free for personal use](https://support.broadcom.com/) via a free Broadcom account.' },
          { do: 'Download the **Ubuntu Desktop** ISO from [ubuntu.com/download/desktop](https://ubuntu.com/download/desktop) (a Long-Term Support version). Optional but pro: [verify the download](https://ubuntu.com/tutorials/how-to-verify-ubuntu).' },
          { do: 'In VirtualBox click **New** → name `ubuntu-lab` → choose the ISO → give it **2 CPUs, 4 GB RAM, 25 GB disk** → Finish. These are the same choices you make when picking a cloud machine size.' },
          { do: 'Start the VM and follow the Ubuntu installer. Create user `student` with the workshop password `Next@123` (so your facilitator can help you if you get stuck).' },
          { do: 'Leave the network on **NAT** (the default) so the VM uses your laptop’s internet.' },
          { do: 'Open **Terminal** in Ubuntu and update everything:', cmd: 'sudo apt update && sudo apt upgrade -y', out: 'Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease\n…\n0 upgraded, 0 newly installed, 0 to remove' },
          { do: 'Check the internet works from inside the VM:', cmd: 'ping -c 4 google.com', out: '64 bytes from …: icmp_seq=1 ttl=117 time=12.4 ms\n…\n4 packets transmitted, 4 received, 0% packet loss' },
          { do: 'Take a snapshot: *Machine → Take Snapshot → “fresh install”*. Your undo button for the whole course.' }
        ],
        safety: 'Stuck? Check the [VirtualBox documentation](https://www.virtualbox.org/wiki/Documentation). Most “VT-x is disabled” errors are fixed by enabling virtualisation in BIOS/UEFI.'
      },
      check: {
        q: 'Why take a snapshot right after installing Ubuntu?',
        options: ['It makes the VM faster', 'So you can roll back to a clean state if something breaks', 'It is required by law', 'It saves internet data'],
        answer: 1,
        explain: 'Snapshots are your undo button. Break something in a lab? Restore and carry on.'
      }
    },
    {
      id: 'linux-terminal',
      hook: 'Movie hackers type green text on black screens. Today, so do you. (Legally. For cloud servers.)',
      short: 'Linux terminal basics',
      kicker: 'Your new superpower',
      title: 'Linux terminal basics',
      lead: 'Most cloud servers run Linux and have no mouse or desktop. You talk to them by typing commands in a terminal.',
      plain: 'The **terminal** is a text window where you type commands and the computer replies. Scary for exactly one day.',
      analogy: {
        type: 'electric',
        text: 'Clicking icons is using the **TV remote**. The terminal is opening the back panel and wiring things directly: more power, more precision, and it works on any server in the world.'
      },
      jargon: [
        ['Shell / bash', 'the program that reads your commands.'],
        ['Directory', 'a folder.'],
        ['Path', 'a location such as `/home/student/notes.txt`.'],
        ['`~`', 'shortcut for your home folder.'],
        ['sudo', '“run this one command as administrator”.'],
        ['Permissions `rwx`', 'read, write, execute for owner, group and others.']
      ],
      body: ['Practise in the simulator first. It’s completely safe, so type anything. Then repeat the missions for real in your Ubuntu VM.'],
      demo: { id: 'demo-terminal', title: 'PRACTICE TERMINAL', hint: 'type help', intro: 'Click inside the black box and type. Press **Enter** to run, **↑** to repeat previous commands.', el: <TerminalSim /> },
      lab: {
        id: 'lab-linux',
        title: 'Your first real commands on Ubuntu',
        goal: 'Open **Terminal** in your Ubuntu VM and run each command. Compare with the expected output.',
        steps: [
          { do: 'Who am I, and where am I?', cmd: 'whoami\npwd', out: 'student\n/home/student' },
          { do: 'Make a working folder and move into it:', cmd: 'mkdir cloudlab\ncd cloudlab' },
          { do: 'Create a file, then read it back:', cmd: 'echo "Hello from my first cloud lab" > hello.txt\ncat hello.txt', out: 'Hello from my first cloud lab' },
          { do: 'See the file details and permissions:', cmd: 'ls -l', out: '-rw-rw-r-- 1 student student 30 Oct 22 10:02 hello.txt' },
          { do: 'Check the VM’s resources: CPU cores, memory and disk. Compare with what you chose in VirtualBox:', cmd: 'nproc\nfree -h\ndf -h /', out: '2\n               total        used        free\nMem:           3.8Gi       1.1Gi       2.2Gi\nFilesystem      Size  Used Avail Use% Mounted on\n/dev/sda2        24G  9.1G   14G  41% /' },
          { do: 'Install a program (this is how you’ll install tools on cloud servers too):', cmd: 'sudo apt install -y tree\ntree ~', out: '/home/student\n└── cloudlab\n    └── hello.txt' },
          { do: 'Read the manual for any command (press `q` to quit):', cmd: 'man ls' }
        ],
        safety: 'Careful with `sudo` and `rm`: `rm` deletes permanently, with no recycle bin. Take a snapshot before big changes.'
      },
      links: [
        { href: 'https://documentation.ubuntu.com/desktop/en/latest/tutorial/the-linux-command-line-for-beginners/', label: 'Ubuntu: Linux command line for beginners' },
        { href: 'https://linuxjourney.com/', label: 'Linux Journey (free lessons)' },
        { href: 'https://overthewire.org/wargames/bandit/', label: 'Practice game: OverTheWire Bandit' }
      ],
      check: {
        q: 'Which command shows the files in the current folder?',
        options: ['`pwd`', '`ls`', '`cd`', '`whoami`'],
        answer: 1,
        explain: '`ls` lists files. `pwd` prints where you are, `cd` moves you, `whoami` shows your user.'
      }
    },
    {
      id: 'cloud-tour',
      hook: 'AWS, Azure, Google Cloud: three giant clouds, different names for the same stuff. Here’s the cheat sheet.',
      short: 'AWS, Azure & GCP tour',
      kicker: 'Quick tour',
      title: 'Quick tour: AWS, Azure and Google Cloud',
      lead: 'The three biggest providers sell almost the same building blocks under different brand names. Learn the idea once, use it everywhere.',
      plain: 'Every provider offers **virtual machines, storage, PaaS, serverless, databases and containers**. Only the names change.',
      analogy: {
        type: 'electric',
        text: 'Like Jio, Airtel and Vi: different brands, same idea (calls, data, SMS). Pick one to learn on; switching later is easy.'
      },
      jargon: [
        ['Console', 'the provider’s website where you click to create things.'],
        ['Free tier', 'limited free usage for new or student accounts.'],
        ['Instance', 'one running virtual machine.']
      ],
      visual: { caption: 'Same ideas, different names', note: 'every name is a link', el: <ProviderTable /> },
      body: ['In Episode 03 you’ll launch a real **AWS EC2** instance and deploy an app on **Google App Engine**. For now, just open each console and look around. No need to create anything yet.'],
      links: [
        { href: 'https://console.aws.amazon.com/', label: 'Open AWS Console' },
        { href: 'https://portal.azure.com/', label: 'Open Azure Portal' },
        { href: 'https://console.cloud.google.com/', label: 'Open Google Cloud Console' }
      ],
      check: {
        q: 'AWS EC2, Azure Virtual Machines and Google Compute Engine are all…',
        options: ['Email apps', 'Virtual machine (IaaS) services', 'Programming languages', 'Video players'],
        answer: 1,
        explain: 'Three brand names for the same idea: renting a virtual machine.'
      }
    },
    {
      id: 'cloud-account',
      hook: 'Fun fact: people have woken up to surprise cloud bills. Don’t be the main character of that story.',
      short: 'Cloud account safety',
      kicker: 'Before you click “Launch”',
      title: 'Keep your cloud account (and wallet) safe',
      lead: 'A cloud account is linked to a payment method. Eight small habits keep it safe and keep the bill at zero.',
      plain: 'Turn on **MFA**, set a **billing alert**, use the **free tier**, never share **keys**, and **stop what you start**.',
      analogy: {
        type: 'water',
        text: 'A cloud server is a tap that bills you while it runs. Leave it open overnight and you’ll find out how expensive water can be.'
      },
      jargon: [
        ['MFA', 'multi-factor authentication: password + phone code.'],
        ['Billing alert / budget', 'an email when spending crosses a limit you set.'],
        ['Access key', 'a secret that lets programs use your account. Never put it in code or GitHub.'],
        ['Root account', 'the all-powerful main login. Use a separate user for daily work.']
      ],
      demo: { id: 'demo-shield', title: 'CLOUD ACCOUNT SHIELD', hint: 'tick what you’ll do', intro: 'Tick each habit you’ll follow when you create your cloud account in Episode 03. Fill the shield to 100%.', el: <CloudShield /> },
      links: [
        { href: 'https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html', label: 'AWS: set a budget alert' },
        { href: 'https://aws.amazon.com/free/', label: 'AWS Free Tier' }
      ],
      check: {
        q: 'The workshop is over and your cloud VM is still running. What should you do?',
        options: ['Leave it, the cloud is free', 'Stop or delete it so the meter stops', 'Make it bigger', 'Share the password in the class group'],
        answer: 1,
        explain: '**Stop what you start.** Running resources cost money; stopped or deleted ones (mostly) don’t.'
      }
    }
  ],
  takeaway: {
    title: 'You have the spark. ⚡',
    text: 'Look at you: you can explain what the cloud is, tell IaaS from PaaS from SaaS, explain why auto-scaling beats LAGZILLA, compare VMs and containers, and you own a working Ubuntu VM. Your parents still think you were “on your phone”. In **Episode 02 · CURRENT** we learn how networks connect you to the cloud: IPs, DNS, ports and firewalls.',
    checklist: [
      'My Ubuntu VM boots, has internet and is fully updated',
      'I took a “fresh install” snapshot',
      'I completed all 8 terminal missions',
      'I opened the AWS, Azure and Google Cloud consoles and looked around'
    ]
  }
};
