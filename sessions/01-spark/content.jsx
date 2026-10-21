// SESSION 01 · SPARK: Foundations from Zero
// Audience: first-year B.Tech students with no prior computing or security background.
// Every topic: plain words → analogy → jargon → explanation → visual/demo → lab → checkpoint.
import MythCards from './demos/MythCards.jsx';
import BitSwitches from './demos/BitSwitches.jsx';
import PacketPipes from './visuals/PacketPipes.jsx';
import ServiceModels from './visuals/ServiceModels.jsx';
import VmVsContainer from './visuals/VmVsContainer.jsx';
import IncidentTimeline from './visuals/IncidentTimeline.jsx';
import CIATriad from './visuals/CIATriad.jsx';
import RiskMeter from './demos/RiskMeter.jsx';
import ActorGrid from './visuals/ActorGrid.jsx';
import MalwareZoo from './demos/MalwareZoo.jsx';
import PhishSpotter from './demos/PhishSpotter.jsx';
import HashLab from './demos/HashLab.jsx';
import EthicsCheck from './demos/EthicsCheck.jsx';
import HygieneChecklist from './demos/HygieneChecklist.jsx';
import LabTopology from './visuals/LabTopology.jsx';
import TerminalSim from './demos/TerminalSim.jsx';

export default {
  episode: {
    title: 'NULLSURGE is in',
    lines: [
      '> 03:14 AM. Campus power grid flickers.',
      '> Student portal: offline. Hostel Wi-Fi: hijacked.',
      '> A rogue AI calling itself NULLSURGE is feeding on weak passwords and careless clicks.',
      '> We need new defenders. No experience required. Just curiosity.',
      '> Complete missions. Earn XP. Decrypt its message. Then take it down.'
    ],
    reward: '15 missions · 10+ badges · 1 boss fight · 1 secret message'
  },
  transmission: 'THE REAL FIREWALL IS YOU, AGENT',
  boss: {
    taunt: 'NULLSURGE thinks freshers are easy targets. Prove it wrong. Everything you need was in this episode.',
    win: 'You just used every idea from Episode 01. Rank up, flex the badge, and get ready for Episode 02 · CURRENT.',
    questions: [
      { q: 'An attacker edits your marks in the database. Which pillar broke?', options: ['Confidentiality', 'Integrity', 'Availability'], answer: 1 },
      { q: 'Risk = ?', options: ['Threat + Patch', 'Likelihood × Impact', 'Hackers ÷ Firewalls'], answer: 1 },
      { q: 'A “free premium game” APK that steals your OTPs is a…', options: ['Worm', 'Trojan', 'Firewall'], answer: 1 },
      { q: 'Which is the strongest password?', options: ['`P@ss1`', '`Dhoni07!`', '`mango-train-sky-lamp-27`'], answer: 2 },
      { q: 'Someone calls “from the bank” asking for your OTP. You…', options: ['Read it out fast', 'Hang up and call the bank yourself', 'Send it by SMS'], answer: 1 },
      { q: 'With **IaaS** cloud, who patches the operating system?', options: ['The provider', 'You', 'Nobody'], answer: 1 },
      { q: 'Your lab VMs should use which network?', options: ['Bridged to hostel Wi-Fi', 'Host-only', 'Public hotspot'], answer: 1 },
      { q: 'Testing a website without written permission is…', options: ['Fine if you’re curious', 'Illegal under the IT Act', 'Fine on weekends'], answer: 1 }
    ]
  },
  intro:
    'Episode 01, where you learn that your phone is a vault, the internet is plumbing and “password123” is a cry for help. We start with what a **bit** is, roast a few hacker myths, learn to spot scams in seconds, and finish by building your own **100% legal hacking lab** and typing your first Linux commands.',
  outcomes: [
    'Explain how data is stored as bits and moves across the internet as packets',
    'Describe IaaS, PaaS and SaaS, and what *you* must secure in each',
    'Describe the CIA triad and tell a threat, a vulnerability and a risk apart',
    'Recognise common malware and spot a phishing message in seconds',
    'Explain why websites store password **hashes**, and how MFA protects you',
    'Know where ethical hacking ends and crime begins under Indian law',
    'Run two virtual machines on an isolated network, explain VMs vs containers, and use basic Linux commands'
  ],
  topics: [
    {
      id: 'welcome',
      hook: 'Real talk: UPI, Insta, your college login, your whole camera roll. Your phone is a vault. Let’s see who’s trying to get in.',
      short: 'What is cybersecurity?',
      kicker: 'Ignite',
      title: 'What is cybersecurity, really?',
      lead: 'Before any tools or code: what are we protecting, who from, and why does a first-year student need to care?',
      plain: '**Cybersecurity** is protecting computers, phones, networks and the information on them from being stolen, changed or broken.',
      analogy: {
        type: 'water',
        text: 'Think of your digital life as a **water supply**. Data flows through pipes into your home. Security is the locks on the tank, the filters that keep poison out and the valves that stop a leak flooding the whole building.'
      },
      jargon: [
        ['Cyber', 'anything to do with computers and networks.'],
        ['Hacker', 'someone who finds clever ways to make systems do unexpected things. Can be good or bad.'],
        ['Attacker', 'a hacker acting without permission to cause harm.']
      ],
      body: [
        'You already use dozens of systems that need protecting: UPI payments, WhatsApp, your college ERP portal, Aadhaar-linked services, Instagram, cloud storage. Each one holds something valuable: money, conversations, identity, marks.',
        'Movies show hacking as a genius typing green text at lightning speed. Reality is far more ordinary, and that is good news. Because most attacks are simple, **most defences are simple too**. Let us bust some myths first.'
      ],
      demo: {
        id: 'demo-myths',
        title: 'MYTH BUSTER',
        hint: 'tap each card',
        intro: 'Each card is something many people believe. Flip it to see what actually happens in the real world.',
        el: <MythCards />
      },
      check: {
        q: 'Which of these is the **most common** way attackers get into accounts?',
        options: ['Writing brand-new genius-level code for every attack', 'Stolen, guessed or reused passwords and fake login pages', 'Physically breaking into data centres', 'Hacking satellites'],
        answer: 1,
        explain: 'Most real breaches start with weak or stolen credentials and phishing. That is why the habits you learn in this session matter so much.'
      }
    },
    {
      id: 'digital-basics',
      hook: 'Every meme you’ve ever sent? Just 0s and 1s. Flip some switches and see the Matrix for real.',
      short: 'Bits, bytes & data',
      kicker: 'From zero',
      title: 'Bits, bytes and data: the atoms of the digital world',
      lead: 'Every photo, message and password is, underneath, just a long row of on/off switches.',
      plain: 'Computers only understand two states: **on (1)** and **off (0)**. One of these is a **bit**. Eight bits make a **byte**, which is enough to store one letter.',
      analogy: {
        type: 'electric',
        text: 'A bit is a **light switch**. With one switch you can say yes or no. With eight switches in a row you can make 256 patterns, enough to give every letter, digit and symbol its own pattern.'
      },
      jargon: [
        ['Bit', 'a single 0 or 1.'],
        ['Byte', '8 bits. One English letter.'],
        ['ASCII', 'the agreed table that maps numbers to letters (65 = A). See the full [ASCII table](https://en.wikipedia.org/wiki/ASCII).'],
        ['KB / MB / GB', 'roughly a thousand / a million / a billion bytes.']
      ],
      body: [
        'Inside the chip, a bit is literally electricity: a tiny voltage present (1) or absent (0). Billions of these switches flip every second. This is why **everything digital can be copied perfectly and sent instantly**, which is also why stolen data spreads so fast.',
        'Security is about protecting these bits: who can **read** them, who can **change** them, and making sure they are **there** when you need them. Remember those three ideas. They come back as the CIA triad in a few minutes.'
      ],
      points: [
        '**1 byte**: one letter, like “A”.',
        '**1 KB** (≈1,000 bytes): a short paragraph of text.',
        '**1 MB** (≈1 million bytes): a high-quality photo.',
        '**1 GB** (≈1 billion bytes): about an hour of HD video.',
        '**A typical data leak** of 10 million user records can fit on a single pen drive.'
      ],
      demo: {
        id: 'demo-bits',
        title: 'BINARY LIGHT SWITCHES',
        hint: 'click the bulbs',
        intro: 'Turn the switches on and off. Each bulb has a value; add up the lit ones to get the number, then the ASCII table turns that number into a letter.',
        el: <BitSwitches />
      },
      check: {
        q: 'The bulbs show `01000010`. Lit weights are 64 and 2. What number, and which letter?',
        options: ['66 → “B”', '42 → “*”', '65 → “A”', '130 → not a letter'],
        answer: 0,
        explain: '64 + 2 = 66, and 66 is “B” in ASCII (A = 65, B = 66 …). Try it in the demo above.'
      }
    },
    {
      id: 'how-internet-works',
      hook: 'Your DM just took a world tour in 40 milliseconds. Here’s the route it took.',
      short: 'How the internet works',
      kicker: 'From zero',
      title: 'How the internet moves your data',
      lead: 'When you open a website, your request is chopped into packets that race through pipes, routers and cables, often across countries, in milliseconds.',
      plain: 'The internet is **millions of computers joined by cables and radio waves**. Data travels in small pieces called **packets**, and every device has an **IP address** so packets know where to go.',
      analogy: {
        type: 'water',
        text: 'Picture a city water network. Your message is poured into the pipes as many small **buckets (packets)**. Each bucket has a delivery address painted on it. Junctions (**routers**) read the address and push it down the right pipe. At the other end the buckets are poured back together in the right order.'
      },
      jargon: [
        ['Client', 'the device asking for something (your phone).'],
        ['Server', 'the computer that answers (the website).'],
        ['IP address', 'a device’s address on the network, like `192.168.1.5`.'],
        ['Router', 'a junction box that forwards packets toward their destination.'],
        ['ISP', 'Internet Service Provider: Jio, Airtel, BSNL, your campus.']
      ],
      body: [
        'Why does this matter for security? Because **every stop along the pipe is a place where data could be read, changed or blocked**. Your hostel Wi-Fi, a café hotspot and your ISP are all in the path. In Session 02 we follow these packets in much more detail and learn how encryption (HTTPS) puts them inside steel pipes nobody can see into.'
      ],
      visual: {
        caption: 'Packet journey · your phone → a web server',
        note: 'hover each stop',
        el: <PacketPipes />
      },
      photos: [{ file: 'Network_switches.jpg', caption: 'Real network switches: every cable is one device’s connection into the network. Your packets pass through boxes like these.' }],
      links: [
        { href: '#/session/2/topic/packets-handshake', label: 'Deep dive later: packets & handshakes (Session 02)' },
        { href: 'https://en.wikipedia.org/wiki/Internet', label: 'Read: How the Internet works (Wikipedia)' }
      ],
      check: {
        q: 'Your message “HELLO” is split into packets. Why does each packet need a destination **IP address**?',
        options: ['To make it look nicer', 'So every router along the way knows where to forward it', 'To encrypt it', 'Packets do not need addresses'],
        answer: 1,
        explain: 'Routers read the destination address on each packet and pass it down the right pipe, exactly like a postal sorting office.'
      }
    },
    {
      id: 'cloud-basics',
      hook: '“It’s in the cloud” = it’s on someone else’s computer. Whose? And who locks the door?',
      short: 'Cloud computing',
      kicker: 'From zero',
      title: 'Cloud computing from zero',
      lead: 'Instagram, Google Drive, your college ERP and most apps you use do not run on a computer in the company’s office. They run in the cloud. What does that actually mean, and who keeps it safe?',
      plain: 'The **cloud** is other people’s computers in huge data centres, rented over the internet. You pay for what you use instead of buying and running servers yourself.',
      analogy: {
        type: 'water',
        text: 'You don’t dig a well to get water. You open a tap and pay the water board for what you use. Cloud computing does the same for computing power: open an account, use servers, storage and apps on demand, and pay per hour or per GB.'
      },
      jargon: [
        ['IaaS', 'Infrastructure as a Service: rent virtual machines, storage and networks (AWS EC2).'],
        ['PaaS', 'Platform as a Service: upload your code; the platform runs it (Google App Engine).'],
        ['SaaS', 'Software as a Service: a ready-made app in your browser (Gmail).'],
        ['Region', 'a geographic location of data centres, e.g. AWS Mumbai (ap-south-1).'],
        ['Shared responsibility', 'the provider secures the cloud itself; you secure what you put in it.']
      ],
      body: [
        'Why does everyone use it? **No upfront hardware cost**, scale up in minutes on results day and back down after, data centres in many regions, and the provider handles electricity, cooling and physical security.',
        'The security catch: the provider secures *the cloud*, but **you secure what you put in the cloud**. Most cloud breaches are not hackers defeating Amazon or Google. They are customers leaving a storage bucket public, a database port open to the world, or a password in their code. Pick a model below and watch the provider’s waterline rise. Everything above the line is still your job.'
      ],
      visual: { caption: 'Service models · who manages which layer?', note: 'pick a model', el: <ServiceModels /> },
      points: [
        '**AWS** (Amazon Web Services): the largest provider. [EC2](https://docs.aws.amazon.com/ec2/) for virtual machines, S3 for storage, [IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) for access rules. [Sign in to the AWS console](https://console.aws.amazon.com/) · [AWS Free Tier](https://aws.amazon.com/free/).',
        '**Microsoft Azure**: popular with companies already using Windows and Microsoft 365. [Sign in to the Azure portal](https://portal.azure.com/) · [Azure for Students](https://azure.microsoft.com/en-us/free/students/).',
        '**Google Cloud**: Compute Engine, [App Engine](https://cloud.google.com/appengine/docs) (PaaS), BigQuery for big data. [Open the Google Cloud console](https://console.cloud.google.com/) · [Google Cloud free tier](https://cloud.google.com/free).',
        'All three have **Indian regions** (Mumbai, Pune, Hyderabad, Delhi and more) and free tiers for students. Always set a **billing alert** before you try anything.'
      ],
      photos: [{ file: 'CERN_Server_03.jpg', caption: 'Inside a real data centre (CERN): rows of servers like these are what “the cloud” physically is.' }],
      links: [
        { href: 'https://aws.amazon.com/compliance/shared-responsibility-model/', label: 'AWS: shared responsibility model' },
        { href: '#/session/1/topic/virtual-lab', label: 'Build a VM yourself in this session' },
        { href: '#/session/2/topic/firewalls', label: 'Cloud security groups (Session 02)' }
      ],
      check: {
        q: 'Your team deploys a website on an **IaaS** virtual machine. Who must install the OS security updates?',
        options: ['The cloud provider, always', 'Your team: with IaaS you manage the OS and everything above it', 'Nobody, because the cloud is automatically secure', 'The college'],
        answer: 1,
        explain: 'With IaaS the provider runs the hardware and virtualisation; the **operating system, apps and data are yours** to patch and secure.'
      }
    },
    {
      id: 'why-it-matters',
      hook: 'A major hospital ran on paper for two weeks because of one attack. Not a movie plot. Real life, 2022.',
      short: 'Why it matters',
      kicker: 'Real world',
      title: 'Why cybersecurity matters: real attacks, real people',
      lead: 'Cyber attacks are not just “computer problems”. They have shut hospitals, emptied bank accounts and exposed millions of people.',
      plain: 'One small weakness, like a missed update or a single clicked link, can affect thousands or even millions of people.',
      analogy: {
        type: 'water',
        text: 'A dam is only as strong as its weakest crack. Attackers do not need to break the whole wall. They search for the one crack, and once water gets through, the flood spreads on its own.'
      },
      jargon: [
        ['Ransomware', 'malware that locks your files and demands payment.'],
        ['Data breach', 'when private data is accessed or leaked without permission.'],
        ['Patch', 'a software update that fixes a security bug.']
      ],
      body: [
        'Look at the pattern in these three famous incidents. In two of them, **the fix already existed** before the attack happened. Someone simply had not installed it.'
      ],
      visual: { caption: 'Three incidents every security student should know', el: <IncidentTimeline /> },
      photos: [{ file: 'Countries_initially_affected_in_WannaCry_ransomware_attack.png', caption: 'Countries hit in the first hours of WannaCry (May 2017). One unpatched weakness, worldwide spread.' }],
      links: [
        { href: 'https://en.wikipedia.org/wiki/WannaCry_ransomware_attack', label: 'Read: WannaCry' },
        { href: 'https://en.wikipedia.org/wiki/2017_Equifax_data_breach', label: 'Read: Equifax breach' },
        { href: 'https://www.businesstoday.in/latest/story/aiims-delhis-server-down-since-morning-ransomware-attack-suspected-353964-2022-11-23', label: 'News: AIIMS Delhi attack (2022)' }
      ],
      after: [
        'Closer to you, India’s national cybercrime helpline **1930** and portal [cybercrime.gov.in](https://cybercrime.gov.in/) receive reports of UPI fraud, fake job offers, sextortion and account takeovers every day. Many victims are students. Knowing the tricks is the best protection.'
      ],
      check: {
        q: 'What was the **simplest** thing that would have prevented WannaCry on most affected computers?',
        options: ['Buying a more expensive computer', 'Installing the Windows security update that was already available', 'Turning off the monitor', 'Using a different keyboard'],
        answer: 1,
        explain: 'Microsoft had released the patch about two months before WannaCry struck. Unpatched machines were the ones that got hit.'
      }
    },
    {
      id: 'cia-triad',
      hook: 'Three letters every security pro lives by. And no, not the spy agency.',
      short: 'The CIA triad',
      kicker: 'Core idea',
      title: 'The CIA triad: three things we protect',
      lead: 'Every security problem in this course, and in your career, damages at least one of these three.',
      plain: '**C**onfidentiality = secret. **I**ntegrity = correct and unchanged. **A**vailability = working when needed.',
      analogy: {
        type: 'electric',
        text: 'Think of a **power line** to your house. Confidentiality: nobody taps it to steal electricity. Integrity: the voltage is not tampered with and arrives clean. Availability: the power actually stays on during your exam night.'
      },
      jargon: [
        ['CIA triad', 'Confidentiality, Integrity, Availability. Nothing to do with the spy agency!'],
        ['AAA', 'Authentication (who are you?), Authorisation (what may you do?), Accounting (what did you do?).']
      ],
      body: [
        'Tap each corner of the triangle. Notice that defences usually protect one pillar but can hurt another. For example, locking an account after 3 wrong passwords protects **confidentiality**, but an attacker could abuse it to lock *you* out, hurting **availability**. Security is always about balance.'
      ],
      visual: { caption: 'Interactive CIA triad', note: 'tap a corner', el: <CIATriad /> },
      after: [
        'Alongside CIA, remember **AAA**. When you log into the college portal you prove who you are (**authentication**), the portal decides you can see your marks but not edit them (**authorisation**), and it records that you logged in at 9:14 pm (**accounting**, also called logging).'
      ],
      check: {
        q: 'A hacker changes a student’s marks from 45 to 95 in the exam database. Which pillar is broken?',
        options: ['Confidentiality', 'Integrity', 'Availability', 'None'],
        answer: 1,
        explain: 'The data was altered without permission, so **integrity** is broken. If they had only *looked* at the marks, that would be confidentiality.'
      }
    },
    {
      id: 'threat-vuln-risk',
      hook: 'Leaky window + monsoon + your laptop = bad day. Learn to rate the danger like a pro.',
      short: 'Threat, vulnerability, risk',
      kicker: 'Core idea',
      title: 'Threats, vulnerabilities and risk',
      lead: 'Three words people mix up all the time. Once you separate them, you think like a security professional.',
      plain: 'A **vulnerability** is a weakness. A **threat** is something that could use that weakness. **Risk** is how likely that is to happen, multiplied by how bad it would be.',
      analogy: {
        type: 'water',
        text: 'Your hostel room has a **leaky window** (vulnerability). The **monsoon** is coming (threat). Your **laptop is on the desk under the window** (asset). The **risk** is high: likely to rain, and the damage would be expensive. Move the laptop or fix the window and the risk drops.'
      },
      jargon: [
        ['Asset', 'anything valuable: data, devices, money, reputation.'],
        ['Vulnerability', 'a weakness, like an unpatched bug, a weak password or an open door.'],
        ['Threat', 'a person or event that could exploit a weakness.'],
        ['Exploit', 'the actual technique or code that uses a vulnerability.'],
        ['Risk', 'Likelihood × Impact.']
      ],
      body: [
        'Security teams cannot fix everything at once, so they **rank by risk**. A weakness that is very likely to be exploited *and* would cause huge damage gets fixed today. A rare, low-impact one can wait.'
      ],
      demo: {
        id: 'demo-risk',
        title: 'RISK VOLTMETER',
        hint: 'pick a scenario, move the sliders',
        intro: 'Choose a real-life scenario. The needle swings to show the risk. Then try moving the sliders: what would you change to bring it down?',
        el: <RiskMeter />
      },
      check: {
        q: 'Your college portal has a bug, but it is only reachable from one locked server room and nobody else can access it. Compared with the same bug on the public website, the risk is…',
        options: ['Higher, because bugs are always critical', 'Lower, because the likelihood of exploitation is much smaller', 'Exactly the same', 'Zero, so ignore it forever'],
        answer: 1,
        explain: 'Same vulnerability, but far lower **likelihood**, so lower risk. It should still be fixed, just with lower priority.'
      }
    },
    {
      id: 'threat-actors',
      hook: 'Not every hacker wears a hoodie. Meet the whole cast, villains and heroes.',
      short: 'Who attacks & why',
      kicker: 'The people',
      title: 'Who attacks, and why?',
      lead: 'Different attackers want different things. Knowing their motive tells you what they will go after.',
      plain: 'Attackers range from bored teenagers to organised criminal gangs and government teams. Most want **money**.',
      analogy: {
        type: 'electric',
        text: 'Like electricity theft: some people tap a line for free power (criminals), some cut lines in protest (hacktivists), the lineman who already has the keys could misuse them (insider), and the utility hires inspectors to find weak points first (ethical hackers).'
      },
      jargon: [
        ['White hat', 'ethical hacker who works with permission.'],
        ['Black hat', 'criminal hacker.'],
        ['Grey hat', 'acts without permission but without harmful intent. Still illegal!'],
        ['Bug bounty', 'a reward paid by a company for privately reporting a security bug.']
      ],
      visual: { caption: 'Meet the threat actors', note: 'hover for spotlight', el: <ActorGrid /> },
      check: {
        q: 'A fake “KYC update” SMS asks you to install an app to keep your bank account active. Which attacker is **most likely** behind it?',
        options: ['Nation-state group', 'Hacktivist', 'Cybercriminal looking for money', 'Ethical hacker'],
        answer: 2,
        explain: 'Mass SMS scams aiming at bank accounts are classic money-motivated cybercrime.'
      }
    },
    {
      id: 'malware',
      hook: 'Gotta catch ’em all, except these. Know your monsters before they find you.',
      short: 'Malware zoo',
      kicker: 'The tools',
      title: 'The malware zoo',
      lead: 'Malware is short for *malicious software*: any program written to harm you. Each species spreads and bites differently.',
      plain: 'Malware is a program that does something bad on your device: steals, spies, locks, or turns your device into a weapon.',
      analogy: {
        type: 'water',
        text: 'Malware is like **contamination in a water supply**. A virus rides along in a bottle you bring home (a file). A worm seeps through connected pipes on its own (the network). A Trojan is poison in a bottle labelled “mineral water”.'
      },
      jargon: [
        ['Payload', 'the harmful action the malware performs.'],
        ['APK', 'an Android app file. Installing random APKs is risky.'],
        ['C2 (command & control)', 'the attacker’s server that sends orders to infected devices.']
      ],
      demo: {
        id: 'demo-zoo',
        title: 'MALWARE ZOO',
        hint: 'tap a card to flip',
        intro: 'Tap each creature to see how it spreads and how to defend against it. Notice how often the defence is “update” or “do not install random stuff”.',
        el: <MalwareZoo />
      },
      photos: [{ file: '2017_Petya_cyberattack_screenshot.png', caption: 'What ransomware looks like to a victim: a real ransom screen from the 2017 Petya/NotPetya attack.' }],
      links: [{ href: 'https://www.cert-in.org.in/', label: 'CERT-In: India’s official security advisories' }],
      check: {
        q: 'A “free premium” game APK from a Telegram group secretly reads your SMS OTPs. What is it?',
        options: ['A worm', 'A Trojan (with spyware behaviour)', 'An adware', 'A firewall'],
        answer: 1,
        explain: 'It pretends to be something you want (a free game) while hiding a harmful payload. That is the definition of a Trojan.'
      }
    },
    {
      id: 'phishing',
      hook: 'Scammers don’t hack phones, they hack people. Don’t be the main character in their story.',
      short: 'Phishing & illusions',
      kicker: 'Human hacking',
      title: 'Social engineering and phishing: hacking humans',
      lead: 'Why break a lock when you can simply convince someone to open the door? Social engineering attacks people, not computers.',
      plain: '**Phishing** is a fake message (email, SMS, WhatsApp, call) designed to trick you into clicking, paying or giving away a password or OTP.',
      analogy: {
        type: 'water',
        text: 'Phishing is literally **fishing**: the attacker throws thousands of baited hooks into the water and waits. You only need to be careful once to not get caught, while they only need one bite out of a thousand.'
      },
      jargon: [
        ['Spear phishing', 'a phish crafted for one specific person, using details about them.'],
        ['Smishing / vishing', 'phishing by SMS / by voice call.'],
        ['Pretexting', 'inventing a believable story (“I am from the bank’s fraud team…”).'],
        ['Homoglyph', 'a character that looks identical to another, like Cyrillic а vs English a. Read about [homograph attacks](https://en.wikipedia.org/wiki/IDN_homograph_attack).']
      ],
      body: ['Phishing works because it hijacks emotions: **fear** (account blocked!), **greed** (you won ₹50,000!), **urgency** (2 hours left!) and **trust** (it looks like your bank). In India, the most common versions are:'],
      points: [
        '**“Electricity will be disconnected tonight. Call this number.”** (vishing)',
        '**“KYC expired. Click to update or your account is blocked.”** (smishing)',
        '**“Scan this QR code to receive money.”** Scanning a QR code is for *paying*, never receiving.',
        '**“Part-time job: like YouTube videos, earn ₹5,000/day.”** (Telegram task scam)',
        '**“Your parcel is held at customs. Pay ₹49 to release.”**'
      ],
      demo: {
        id: 'demo-phish',
        title: 'PHISH SPOTTER + X-RAY LENS',
        hint: 'find all 6 red flags',
        intro: 'This email (for a made-up payments company) contains **six red flags**. Click each one you can spot. Then switch on the **X-ray lens** and slide it across the email to see what is really underneath. At the bottom, test your eyes against a **homoglyph illusion**.',
        el: <PhishSpotter />
      },
      links: [
        { href: 'https://phishingquiz.withgoogle.com/', label: 'Practice: Google’s phishing quiz' },
        { href: 'https://cybercrime.gov.in/', label: 'Report a scam: cybercrime.gov.in' },
        { href: 'https://sancharsaathi.gov.in/', label: 'Report fraud calls/SMS: Sanchar Saathi' }
      ],
      check: {
        q: 'Someone calls saying they are from your bank and asks you to read out the OTP you just received “to stop a fraud”. What do you do?',
        options: ['Read it out quickly, since fraud is serious', 'Hang up. Banks never ask for OTPs. Call the number on the back of your card yourself.', 'Read only the first 3 digits', 'Send it by SMS instead'],
        answer: 1,
        explain: 'An OTP is the final key to your account. **No genuine bank, police officer or customer care agent will ever ask for it.** Lost money? Call **1930** immediately or report at [cybercrime.gov.in](https://cybercrime.gov.in/).'
      }
    },
    {
      id: 'passwords-hashing',
      hook: '“password123” gets cracked faster than you can say it. Find out how long yours would last.',
      short: 'Passwords & hashing',
      kicker: 'Your first defence',
      title: 'Passwords, hashing and MFA',
      lead: 'Websites should never store your actual password. They store a fingerprint of it called a **hash**. Let us see why that matters, and why length beats complexity.',
      plain: 'A **hash** turns any text into a fixed-length scramble that cannot be reversed. A website hashes what you type and compares it with the stored hash. **MFA** adds a second proof, so a stolen password alone is not enough.',
      analogy: {
        type: 'water',
        text: 'Hashing is like **dissolving a specific mix of dyes into water**: you always get the same exact colour from the same recipe, but you cannot pull the dyes back out of the water. Change one drop, and the colour is completely different.'
      },
      jargon: [
        ['Hash', 'a one-way fingerprint of data, like [SHA-256](https://en.wikipedia.org/wiki/SHA-2).'],
        ['Salt', 'random extra text added before hashing so identical passwords get different hashes.'],
        ['Brute force', 'trying every possible password until one works.'],
        ['MFA / 2FA', 'multi-factor authentication: something you know + something you have or are.'],
        ['Password manager', 'an app that creates and remembers strong, unique passwords for you.']
      ],
      body: [
        'When a website is breached, attackers usually steal the **hashes**, not plain passwords. They then guess billions of passwords per second, hash each one, and look for matches. **Short or common passwords fall in seconds. Long passphrases survive for centuries.**'
      ],
      demo: {
        id: 'demo-hash',
        title: 'HASH LAB',
        hint: 'type, watch, compare',
        intro: 'On the left, test practice passwords (**never your real one**). On the right, change a single letter in Input B and watch the avalanche effect: most of the hash changes.',
        el: <HashLab />
      },
      points: [
        '**Use passphrases:** 4+ random words, e.g. `Mango-Train-Sky-Lamp-27`.',
        '**One account, one password.** Reuse turns one leak into ten break-ins.',
        '**Turn on MFA** everywhere, starting with your email: [Google 2-Step Verification](https://myaccount.google.com/signinoptions/two-step-verification) · [Microsoft account security](https://account.microsoft.com/security). Authenticator apps or passkeys are stronger than SMS.',
        '**Use a password manager**, e.g. the free, open-source [Bitwarden](https://bitwarden.com/).',
        '**Check if you have been breached** at [haveibeenpwned.com](https://haveibeenpwned.com/).'
      ],
      links: [
        { href: '#/session/3/topic/signatures-certs', label: 'Hashes return in Session 03: signatures & certificates' },
        { href: '#/session/1/topic/virtual-lab', label: 'You will verify a real download with sha256sum' }
      ],
      check: {
        q: 'Which password is the **strongest**?',
        options: ['`P@ss1`', '`Dhoni07`', '`correct-horse-battery-staple-river`', '`qwerty123!`'],
        answer: 2,
        explain: 'Length wins. Five random words gives far more combinations than a short password with symbols, and it is easier to remember.'
      }
    },
    {
      id: 'law-ethics',
      hook: 'Same skills, two endings: a dream job or an FIR. The plot twist is one word: permission.',
      short: 'Cyber law & ethics',
      kicker: 'The golden rule',
      title: 'Cyber law and ethics: permission is everything',
      lead: 'The same action can be a respected job or a crime. The only difference is **written permission**.',
      plain: 'Only test systems **you own** or have **written permission** to test. Everything else is illegal, even if you mean no harm and even if you fail.',
      analogy: {
        type: 'electric',
        text: 'An electrician opening your fuse box when you hired them is doing a job. The same person opening your neighbour’s fuse box at night is breaking the law, even if they were “just checking”.'
      },
      jargon: [
        ['IT Act 2000', 'India’s main cyber law (amended in 2008).'],
        ['DPDP Act 2023', 'Digital Personal Data Protection Act: rules on how personal data must be handled.'],
        ['CERT-In', 'India’s national agency for responding to cyber security incidents.'],
        ['Responsible disclosure', 'reporting a bug privately to the owner so it can be fixed before anyone abuses it.'],
        ['Scope', 'the exact systems you are allowed to test.']
      ],
      points: [
        'Read the official text: [Information Technology Act, 2000 (India Code)](https://www.indiacode.nic.in/handle/123456789/13683).',
        '**IT Act Sec 43**: unauthorised access to or damage of a computer; the owner can claim compensation.',
        '**Sec 66**: computer-related offences done dishonestly or fraudulently; can mean jail and fines.',
        '**Sec 66C / 66D**: identity theft (using someone else’s password) / cheating by pretending to be someone else.',
        '**Sec 72**: breach of confidentiality, i.e. leaking information you accessed through your position.',
        '**[DPDP Act 2023](https://www.indiacode.nic.in/bitstream/123456789/22037/2/a2023-22.pdf)**: organisations must protect personal data, with very large penalties for failures. Its Rules were notified in November 2025.',
        '**[CERT-In](https://www.cert-in.org.in/) directions (2022)**: organisations must report serious cyber incidents within **6 hours**.',
        '**Victim of cybercrime?** Call **1930** or report at [cybercrime.gov.in](https://cybercrime.gov.in/), as fast as possible, especially for money fraud.'
      ],
      demo: {
        id: 'demo-ethics',
        title: 'ALLOWED OR NOT?',
        hint: 'six situations',
        intro: 'Decide for each situation. Then read why.',
        el: <EthicsCheck />
      },
      check: {
        q: 'You notice the college website shows other students’ data if you change a number in the URL. What is the **right** move?',
        options: ['Download everyone’s data to prove it', 'Post it on social media so they fix it faster', 'Stop, take a note, and report it privately to the college IT team', 'Keep testing other pages first'],
        answer: 2,
        explain: 'Stop and report privately (**responsible disclosure**). Downloading or sharing other people’s data makes *you* liable. (This bug is called IDOR, and you will meet it in Session 03.)'
      }
    },
    {
      id: 'personal-hygiene',
      hook: 'A five-minute glow-up for your digital life. Fill your shield to 100%.',
      short: 'Your security habits',
      kicker: 'Protect yourself first',
      title: 'Your personal cyber-hygiene shield',
      lead: 'Before protecting anyone else, secure yourself. These eight habits stop the vast majority of attacks against ordinary people.',
      plain: 'Good cyber hygiene means **small daily habits**, like washing hands, that keep you safe without any special tools.',
      analogy: {
        type: 'water',
        text: 'Each habit is a **layer in a water filter**. One layer catches mud, another catches bacteria, another catches chemicals. No single layer is perfect, but together the water comes out clean. Security people call this **defence in depth**.'
      },
      jargon: [
        ['Defence in depth', 'many overlapping layers of protection.'],
        ['3-2-1 backup', '3 copies, on 2 types of storage, 1 kept somewhere else.']
      ],
      demo: {
        id: 'demo-hygiene',
        title: 'SHIELD BUILDER',
        hint: 'tick what you already do',
        intro: 'Be honest! Tick the habits you already have. Anything unticked is your homework for tonight.',
        el: <HygieneChecklist />
      },
      links: [
        { href: 'https://myaccount.google.com/security-checkup', label: 'Run Google Security Checkup' },
        { href: 'https://haveibeenpwned.com/', label: 'Check your email on Have I Been Pwned' }
      ]
    },
    {
      id: 'virtual-lab',
      hook: 'Time to build your own hacking playground, 100% legal, living inside your laptop.',
      short: 'Your first virtual lab',
      kicker: 'Lab setup',
      title: 'Build your safe virtual hacking lab',
      lead: 'Professionals never practise on real systems. They build a lab: pretend computers inside their own laptop, cut off from everyone else.',
      plain: 'A **virtual machine (VM)** is a full computer made of software, running in a window on your laptop. If you break it, you just restore a snapshot. Nobody gets hurt.',
      analogy: {
        type: 'water',
        text: 'Your lab is an **aquarium inside your house**. You can create storms and currents inside the glass, but the water never leaks into the rest of the house. The host-only network is the glass wall.'
      },
      jargon: [
        ['Host', 'your real laptop.'],
        ['Guest / VM', 'a virtual computer running inside it.'],
        ['Hypervisor', 'the software that runs VMs (VirtualBox, VMware).'],
        ['ISO / image', 'a file containing an operating system ready to install.'],
        ['Snapshot', 'a saved point in time you can roll back to.'],
        ['Kali Linux', 'a Linux version made for security work, with hundreds of tools built in.']
      ],
      visuals: [
        { caption: 'Your lab: two VMs, one private network, no internet while practising', note: 'hover each part', el: <LabTopology /> },
        { caption: 'Virtual machines vs containers', el: <VmVsContainer /> }
      ],
      after: [
        '**VM or container?** A VM is a complete computer with its own operating system, so it is great for a lab you can break and roll back. A **container** (Docker) packs just an app and its libraries and shares the host’s kernel, so it starts in seconds. Cloud providers use both: you rent VMs (IaaS), and many modern apps ship as containers. Security-wise, VMs give stronger isolation; containers are lighter but share more with the host.',
        'The same setup works with **VMware Workstation Pro** (free for personal use) instead of VirtualBox. Pick one and use it for the whole course. Curious about containers? Read Docker’s [What is a container?](https://www.docker.com/resources/what-container/)'
      ],
      lab: {
        id: 'lab-setup',
        title: 'Set up VirtualBox, Kali and Ubuntu',
        goal: 'By the end, Kali can **ping** Ubuntu across a private host-only network. Requirements: 8 GB RAM recommended (4 GB works with only Kali running), about 60 GB free disk, and **virtualisation (Intel VT-x / AMD-V) enabled in BIOS**.',
        steps: [
          { do: 'Download and install **VirtualBox** from the [official VirtualBox downloads page](https://www.virtualbox.org/wiki/Downloads) (pick your OS). Accept the defaults. Prefer VMware? [VMware Workstation Pro is free for personal use](https://support.broadcom.com/) via a free Broadcom account.' },
          { do: 'Download the **Kali Linux VirtualBox image** from the [official Kali download page](https://www.kali.org/get-kali/#kali-virtual-machines) → *Virtual Machines* → *VirtualBox*. Extract the `.7z` file and double-click the `.vbox` file to import it. Default login: **kali / kali**.' },
          {
            do: 'Before importing, **verify the download is genuine**. Compare its SHA-256 hash with the one on the Kali website (this is the [hashing](#/session/1/topic/passwords-hashing) idea in action; Kali explains how in [Download images securely](https://www.kali.org/docs/introduction/download-images-securely/)). On Windows PowerShell use `Get-FileHash <file>`; on Linux or macOS:',
            cmd: 'sha256sum kali-linux-*-virtualbox-amd64.7z',
            out: '3f1c…e9a2  kali-linux-2025.x-virtualbox-amd64.7z   ← must match the website exactly'
          },
          { do: 'Download the **Ubuntu** ISO: [Ubuntu Server](https://ubuntu.com/download/server) or [Ubuntu Desktop](https://ubuntu.com/download/desktop) ([how to verify it](https://ubuntu.com/tutorials/how-to-verify-ubuntu)). In VirtualBox: *New* → name `ubuntu-target` → choose the ISO → 2 GB RAM, 25 GB disk → install with username `student`.' },
          { do: 'Create the private network: *File → Tools → Network Manager → Host-only Networks → Create*. You should get `192.168.56.1/24` with DHCP enabled.' },
          { do: 'For **both** VMs: *Settings → Network → Adapter 1 → Attached to: Host-only Adapter*. (Need internet later for updates? Add Adapter 2 as NAT *only* while updating, then disable it again.)' },
          { do: 'Take a snapshot of each VM now: *Machine → Take Snapshot → “clean install”*. This is your undo button.' },
          { do: 'Start both VMs. On each, find its IP address:', cmd: 'ip a', out: '2: eth0: <BROADCAST,MULTICAST,UP>\n    inet 192.168.56.101/24 brd 192.168.56.255 scope global eth0' },
          { do: 'From **Kali**, check you can reach Ubuntu (use the IP you found on Ubuntu):', cmd: 'ping -c 4 192.168.56.102', out: '64 bytes from 192.168.56.102: icmp_seq=1 ttl=64 time=0.61 ms\n…\n4 packets transmitted, 4 received, 0% packet loss' }
        ],
        safety: 'Stuck? See the [VirtualBox documentation](https://www.virtualbox.org/wiki/Documentation) and the [Kali docs](https://www.kali.org/docs/). Keep practice VMs on **host-only** networking. Never point security tools at the campus network, Wi-Fi or any system you do not own.'
      },
      check: {
        q: 'Why do we use a **host-only** network for the lab instead of bridging the VMs onto the hostel Wi-Fi?',
        options: ['It is faster', 'It keeps the practice traffic inside your laptop so you cannot accidentally hit real systems', 'Kali refuses to run otherwise', 'It saves battery'],
        answer: 1,
        explain: 'Isolation is the whole point. Mistakes stay inside your aquarium.'
      }
    },
    {
      id: 'linux-terminal',
      hook: 'Movie hackers type green text on black screens. Today, so do you.',
      short: 'Linux terminal from zero',
      kicker: 'Your new superpower',
      title: 'The Linux terminal, from absolute zero',
      lead: 'Most servers on the internet and almost every security tool run on Linux. The terminal is where you talk to it directly, in words instead of clicks.',
      plain: 'The **terminal** is a text window where you type commands and the computer replies. It looks scary for exactly one day.',
      analogy: {
        type: 'electric',
        text: 'Clicking icons is like using the **TV remote**. The terminal is opening the back panel and connecting wires directly: more power, more precision, and you learn how it really works.'
      },
      jargon: [
        ['Shell / bash', 'the program that reads your commands.'],
        ['Directory', 'a folder.'],
        ['Path', 'a location such as `/home/kali/notes.txt`.'],
        ['`~`', 'shortcut for your home directory.'],
        ['root / sudo', 'the administrator account / “run this one command as administrator”.'],
        ['Permissions `rwx`', 'read, write, execute, set separately for owner, group and others.']
      ],
      body: ['Practise first in the simulator below. It is completely safe, and you can type anything. Complete the 8 missions, then repeat them for real on your Kali VM.'],
      links: [
        { href: 'https://documentation.ubuntu.com/desktop/en/latest/tutorial/the-linux-command-line-for-beginners/', label: 'Ubuntu: The Linux command line for beginners' },
        { href: 'https://linuxjourney.com/', label: 'Linux Journey (free lessons)' },
        { href: 'https://overthewire.org/wargames/bandit/', label: 'Practice game: OverTheWire Bandit' }
      ],
      demo: {
        id: 'demo-terminal',
        title: 'PRACTICE TERMINAL',
        hint: 'type help',
        intro: 'Click inside the black box and type. Press **Enter** to run, **↑** to repeat previous commands.',
        el: <TerminalSim />
      },
      lab: {
        id: 'lab-linux',
        title: 'Your first real commands on Kali',
        goal: 'Open the **Terminal** app on your Kali VM and run each command. Compare with the expected output.',
        steps: [
          { do: 'Who am I, and where am I?', cmd: 'whoami\npwd', out: 'kali\n/home/kali' },
          { do: 'Make a working folder and move into it:', cmd: 'mkdir voltide\ncd voltide' },
          { do: 'Create a file, then read it back:', cmd: 'echo "I am learning cybersecurity" > me.txt\ncat me.txt', out: 'I am learning cybersecurity' },
          { do: 'See the file’s **permissions**. `rw-` for the owner, `r--` for group and others:', cmd: 'ls -l me.txt', out: '-rw-r--r-- 1 kali kali 28 Oct 21 10:02 me.txt' },
          { do: 'Make it private, readable and writable only by you (6 = read+write for owner, 0 for everyone else):', cmd: 'chmod 600 me.txt\nls -l me.txt', out: '-rw------- 1 kali kali 28 Oct 21 10:02 me.txt' },
          { do: 'Look at who else has accounts on this machine. Every line in this file is a user:', cmd: 'cat /etc/passwd | head -5', out: 'root:x:0:0:root:/root:/usr/bin/zsh\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\n…' },
          { do: 'Explore your VM’s resources: CPU cores, memory, disk and OS version. Compare with what you gave it in VirtualBox settings:', cmd: 'nproc\nfree -h\ndf -h /\nuname -a', out: '2\n               total        used        free\nMem:           3.8Gi       1.1Gi       2.2Gi\nFilesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        79G   16G   60G  21% /\nLinux kali 6.x.0-kali-amd64 … x86_64 GNU/Linux' },
          { do: 'Read the manual for any command (press `q` to quit):', cmd: 'man ls' }
        ],
        safety: 'Be careful with `sudo` and `rm`. `rm` deletes permanently, with no recycle bin. When in doubt, take a snapshot first.'
      },
      check: {
        q: 'A file shows `-rwx------`. Who can read it?',
        options: ['Everyone', 'Only the owner', 'Only the group', 'Nobody'],
        answer: 1,
        explain: 'The first `rwx` block is the owner. The group and others blocks are `---`, so nobody else can read, write or run it.'
      }
    }
  ],
  takeaway: {
    title: 'You have the spark. ⚡',
    text: 'Look at you: you can explain how data flows, name what we protect (CIA), tell a threat from a vulnerability, spot malware and phishing, and you own a working, isolated lab. Your parents still think you were “on your phone”. In **Episode 02 · CURRENT** we plug into that lab and follow real packets across the network.',
    checklist: [
      'My Kali VM and Ubuntu VM can ping each other on the host-only network',
      'I took a “clean install” snapshot of both',
      'I completed all 8 terminal missions',
      'I turned on MFA for my personal email tonight'
    ]
  }
};
