// EPISODE 02 · CURRENT: Computer Networks
// Topics follow Day 1, Session 02 of the Cloud Computing Workshop plan:
// understand how a user, a network and a cloud server communicate.
import NetworkMap from './visuals/NetworkMap.jsx';
import IPChecker from './demos/IPChecker.jsx';
import DNSJourney from './visuals/DNSJourney.jsx';
import HttpInspector from './demos/HttpInspector.jsx';
import Handshake from './demos/Handshake.jsx';
import PortBuilding from './demos/PortBuilding.jsx';
import NatTranslator from './visuals/NatTranslator.jsx';
import Encapsulation from './visuals/Encapsulation.jsx';
import SecurityGroupSim from './demos/SecurityGroupSim.jsx';
import NetTerminal from './demos/NetTerminal.jsx';
import JourneyStepper from './demos/JourneyStepper.jsx';

export default {
  episode: {
    title: 'LAGZILLA: Packet Loss',
    lines: [
      '> LAGZILLA is back. This time it’s eating packets.',
      '> Pages half-load. Videos buffer. DNS says “server not found”.',
      '> To stop it, you need to know how data actually travels.',
      '> IPs, DNS, ports, routers, firewalls. The whole route.',
      '> Trace every hop. Then cut LAGZILLA off at the gateway.'
    ],
    reward: '9 missions · 4 badges · 1 boss fight · 1 secret message'
  },
  transmission: 'EVERY CLICK IS A PACKET ON A JOURNEY',
  boss: {
    name: 'PACKET LOSS',
    taunt: 'LAGZILLA’s Packet Loss form thinks you can’t tell DNS from NAT. Show it the route.',
    win: 'Packets delivered, zero loss. You can explain how a browser reaches a server. Next: Episode 03 · TIDE, where you build in the cloud for real.',
    questions: [
      { q: 'Which of these is a **private** IP address?', options: ['`8.8.8.8`', '`192.168.1.5`', '`13.233.10.7`'], answer: 1 },
      { q: 'DNS is best described as the internet’s…', options: ['Phonebook', 'Firewall', 'Hard disk'], answer: 0 },
      { q: 'A page loads and the server replies **404**. That means…', options: ['Success', 'Page not found', 'Server overloaded'], answer: 1 },
      { q: 'Which protocol is better for a live video call?', options: ['TCP', 'UDP', 'FTP'], answer: 1 },
      { q: 'HTTPS normally uses port…', options: ['22', '80', '443'], answer: 2 },
      { q: 'Your laptop, phone and VM share one public IP. Which feature does that?', options: ['NAT', 'DNS', 'SSH'], answer: 0 },
      { q: 'In an AWS security group, SSH (22) should be allowed from…', options: ['Anywhere', 'Only your own IP', 'Nobody, ever'], answer: 1 },
      { q: 'Which command shows every router on the way to a server?', options: ['`ping`', '`traceroute` / `tracert`', '`nslookup`'], answer: 1 }
    ]
  },
  intro:
    'Episode 02, where you find out your DMs travel through more boxes than a Flipkart parcel. You’ll learn what **IP addresses**, **DNS**, **ports**, **NAT** and **firewalls** actually do, practise real network commands, and by the end you can explain exactly how a browser reaches a cloud server.',
  outcomes: [
    'Tell public and private IP addresses apart',
    'Explain DNS, HTTP and HTTPS, and read common status codes',
    'Explain TCP vs UDP and what a port is',
    'Explain routers, default gateways and NAT',
    'Configure firewall rules and cloud security groups safely',
    'Use `ping`, `ip addr` / `ipconfig`, `nslookup`, `curl` and `traceroute`'
  ],
  topics: [
    {
      id: 'ip-addresses',
      hook: 'Your phone has two addresses: one for home Wi-Fi and one for the whole internet. Plot twist, right?',
      short: 'Public vs private IPs',
      kicker: 'Addresses',
      title: 'IP addresses: public vs private',
      lead: 'Every device on a network needs an address. But not every address is visible to the whole internet.',
      plain: 'A **private IP** works only inside your local network (home, hostel, cloud VPC). A **public IP** is reachable from anywhere on the internet.',
      analogy: {
        type: 'water',
        text: 'Private IPs are room numbers inside a hostel (Room 204). The public IP is the hostel’s street address. Couriers from outside only know the street address; the warden (router) knows which room to deliver to.'
      },
      jargon: [
        ['IPv4', 'the classic address format: four numbers 0–255, like `192.168.1.5`.'],
        ['Private ranges', '`10.x.x.x`, `172.16–31.x.x`, `192.168.x.x`.'],
        ['Public IP', 'a globally unique address, e.g. a cloud VM’s `13.233.10.7`.'],
        ['MAC address', 'a permanent hardware ID of a network card.'],
        ['DHCP', 'the service that hands out IP addresses automatically.']
      ],
      visual: { caption: 'A hostel network, wired like a circuit board', note: 'tap any device', el: <NetworkMap /> },
      demo: { id: 'demo-ip', title: 'IP ADDRESS CHECKER', hint: 'type or tap', intro: 'Type any address, or tap a sample. Find a public, a private and a loopback address for bonus XP.', el: <IPChecker /> },
      after: ['In the cloud it’s the same idea: an **EC2 instance** gets a private IP inside its VPC (like `172.31.20.4`) and, if you allow it, a public IP so the world can reach your website.'],
      links: [
        { href: 'https://www.cloudflare.com/learning/dns/glossary/what-is-my-ip-address/', label: 'What is an IP address?' },
        { href: 'https://ifconfig.me/', label: 'See your public IP' }
      ],
      check: {
        q: 'Your Ubuntu VM shows `10.0.2.15`. What kind of address is it?',
        options: ['Public', 'Private', 'Loopback', 'Invalid'],
        answer: 1,
        explain: 'Anything starting with `10.` is in a private range. Your laptop translates it (NAT) before it reaches the internet.'
      }
    },
    {
      id: 'dns',
      hook: 'You never type 142.250.183.46 to open Google. Something translates for you, billions of times a day.',
      short: 'DNS',
      kicker: 'Names',
      title: 'DNS: the internet’s phonebook',
      lead: 'Humans remember names; computers need numbers. DNS turns one into the other.',
      plain: '**DNS** (Domain Name System) converts a name like `www.college.ac.in` into the server’s IP address.',
      analogy: {
        type: 'electric',
        text: 'Saving “Mom” in your contacts instead of memorising 98xxxxxx10. DNS is the contacts app of the internet.'
      },
      jargon: [
        ['Domain name', 'a human-friendly address like `college.ac.in`.'],
        ['Resolver', 'the DNS server that does the lookup for you (your ISP, or 8.8.8.8).'],
        ['TLD', 'top-level domain: `.in`, `.com`, `.org`.'],
        ['Record', 'a DNS entry; an **A record** maps a name to an IPv4 address.'],
        ['TTL', 'how long an answer may be cached.']
      ],
      visual: { caption: 'A DNS lookup, hop by hop', note: 'press play', el: <DNSJourney /> },
      after: ['When you deploy your site in Episode 04, you could point a domain name at your cloud VM’s public IP with an **A record**. That’s the whole magic of “buying a domain”.'],
      links: [
        { href: 'https://www.cloudflare.com/learning/dns/what-is-dns/', label: 'How DNS works' },
        { href: 'https://dnschecker.org/', label: 'DNS lookup tool' }
      ],
      check: {
        q: 'A site works by IP address but not by name. What’s most likely broken?',
        options: ['The web server', 'DNS', 'Your monitor', 'The CPU'],
        answer: 1,
        explain: 'If the IP works but the name doesn’t, the name-to-IP translation (DNS) is the problem.'
      }
    },
    {
      id: 'http-https',
      hook: '404, 500, 503: you’ve seen these error pages. Today you learn their secret language.',
      short: 'HTTP & HTTPS',
      kicker: 'The web',
      title: 'HTTP and HTTPS: how browsers talk to servers',
      lead: 'Every web page is a request and a response. HTTP is the language; HTTPS is the same language in a locked envelope.',
      plain: '**HTTP** is how a browser asks a server for a page. **HTTPS** is HTTP encrypted with **TLS**, shown by the 🔒 in your address bar.',
      analogy: {
        type: 'water',
        text: 'HTTP is a postcard: anyone handling it can read it. HTTPS is a sealed, tamper-proof envelope: only the receiver can open it.'
      },
      jargon: [
        ['Request', 'what the browser sends, e.g. `GET /results`.'],
        ['Response', 'what the server sends back, with a **status code**.'],
        ['Status code', '`200` OK, `301` moved, `404` not found, `500` server error, `503` overloaded.'],
        ['TLS', 'the encryption behind HTTPS.'],
        ['Certificate', 'proof that a site really is who it says it is. Free ones come from [Let’s Encrypt](https://letsencrypt.org/).']
      ],
      demo: { id: 'demo-http', title: 'HTTP INSPECTOR', hint: '6 situations', intro: 'Pick a situation to see the exact request and response. Toggle HTTP vs HTTPS. Decode all six for XP.', el: <HttpInspector /> },
      links: [
        { href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status', label: 'HTTP status codes (MDN)' },
        { href: 'https://www.cloudflare.com/learning/ssl/what-is-https/', label: 'What is HTTPS?' }
      ],
      check: {
        q: 'Results day, the portal shows **503 Service Unavailable**. What does that mean?',
        options: ['You typed the URL wrong', 'The server is overloaded or down', 'You need to log in', 'Success'],
        answer: 1,
        explain: '5xx means the server’s problem. 503 specifically means it can’t handle the load right now. Hello, LAGZILLA.'
      }
    },
    {
      id: 'tcp-udp-ports',
      hook: 'TCP is the friend who confirms every message. UDP just sends voice notes and hopes. Both have a job.',
      short: 'TCP, UDP & ports',
      kicker: 'Transport',
      title: 'TCP, UDP and ports',
      lead: 'An IP address gets data to the right computer. A port gets it to the right program on that computer.',
      plain: '**TCP** is reliable: it connects first and checks every piece arrived. **UDP** is fast and fire-and-forget. A **port** is a numbered door for one service.',
      analogy: {
        type: 'electric',
        text: 'The IP address is the building. Ports are the flat numbers. Port 80 is the web flat, 22 is the remote-login flat, 443 is the secure-web flat.'
      },
      jargon: [
        ['TCP', 'Transmission Control Protocol: ordered, reliable delivery.'],
        ['UDP', 'User Datagram Protocol: fast, no guarantees.'],
        ['Handshake', 'SYN → SYN-ACK → ACK, TCP’s “hello”.'],
        ['Port', 'a number 0–65535 that identifies a service.'],
        ['Socket', 'IP address + port, e.g. `13.233.10.7:443`.']
      ],
      demo: { id: 'demo-handshake', title: 'TCP vs UDP', hint: 'play both', intro: 'Watch TCP shake hands, then watch UDP just throw packets. Play both modes for XP.', el: <Handshake /> },
      visual: { caption: 'One server, many ports', note: 'tap a door', el: <PortBuilding /> },
      links: [
        { href: 'https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/', label: 'TCP/IP explained' },
        { href: 'https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/', label: 'UDP explained' }
      ],
      check: {
        q: 'Your web server runs on a cloud VM. Visitors use HTTPS. Which port must be open?',
        options: ['22', '443', '3306', '3389'],
        answer: 1,
        explain: 'HTTPS = port **443**. (Plain HTTP is 80; 22 is SSH for you only.)'
      }
    },
    {
      id: 'routers-nat',
      hook: 'Your whole hostel shares one public IP. One. How does the reply find YOUR laptop?',
      short: 'Routers, gateways & NAT',
      kicker: 'The path',
      title: 'Routers, gateways and NAT',
      lead: 'Packets jump from network to network through routers. The first jump out of your network is the default gateway, and that’s where NAT happens.',
      plain: 'A **router** forwards packets between networks. The **default gateway** is your network’s exit door. **NAT** lets many private devices share one public IP.',
      analogy: {
        type: 'water',
        text: 'The hostel reception (gateway) sends everyone’s letters out with the hostel’s address on them, keeps a note of who sent what, and hands replies to the right room. That’s NAT.'
      },
      jargon: [
        ['Router', 'forwards packets toward their destination.'],
        ['Default gateway', 'where your device sends anything not on the local network.'],
        ['NAT', 'Network Address Translation: private ↔ public address swap.'],
        ['Hop', 'one router on the path.'],
        ['NAT gateway', 'the cloud version: lets private VMs reach the internet.']
      ],
      visual: { caption: 'NAT in action', note: 'send from any device', el: <NatTranslator /> },
      demo: { id: 'demo-encap', title: 'PACKET LAYERS', hint: 'wrap each layer', intro: 'Before a packet leaves, it gets wrapped in layers, each with its own label. Routers read the IP layer to decide where to send it.', el: <Encapsulation /> },
      links: [
        { href: 'https://www.cloudflare.com/learning/network-layer/what-is-routing/', label: 'What is routing?' },
        { href: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html', label: 'AWS NAT gateways' }
      ],
      check: {
        q: 'Your laptop’s default gateway is `192.168.1.1`. What is that device?',
        options: ['A web server', 'Your router: the exit to other networks', 'A DNS record', 'Your printer'],
        answer: 1,
        explain: 'The default gateway is the router that connects your local network to everything else.'
      }
    },
    {
      id: 'firewalls',
      hook: 'Leaving every port open on a cloud server is like leaving every door of your house open. With a sign saying “free stuff”.',
      short: 'Firewalls & security groups',
      kicker: 'Gatekeepers',
      title: 'Firewalls and cloud security groups',
      lead: 'A firewall decides which traffic may enter. In the cloud it’s called a security group, and you configure it every time you launch a server.',
      plain: 'A **firewall** allows or blocks traffic by port and source. A **security group** is a cloud firewall attached to your VM: everything not allowed is **blocked**.',
      analogy: {
        type: 'electric',
        text: 'A circuit breaker panel: each switch lets current through to one room only. A security group lets traffic through to one port only, and only from the sources you list.'
      },
      jargon: [
        ['Inbound rule', 'what may come *in* (e.g. port 80 from anywhere).'],
        ['Outbound rule', 'what may go *out* (usually everything).'],
        ['0.0.0.0/0', '“anywhere on the internet”.'],
        ['/32', 'exactly one IP address, e.g. *My IP*.'],
        ['ufw', 'Ubuntu’s simple firewall tool.']
      ],
      demo: { id: 'demo-sg', title: 'SECURITY GROUP SIMULATOR', hint: 'make all 6 green', intro: 'Add inbound rules until every row is green: the website open to everyone, SSH only from you, everything else blocked.', el: <SecurityGroupSim /> },
      lab: {
        id: 'lab-ufw',
        title: 'Turn on the firewall in your Ubuntu VM',
        goal: 'Use **ufw** to allow only SSH and web traffic, the same rules you’ll use on a cloud VM.',
        steps: [
          { do: 'Check the firewall status:', cmd: 'sudo ufw status', out: 'Status: inactive' },
          { do: 'Allow SSH and the web, then switch it on:', cmd: 'sudo ufw allow 22/tcp\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\nsudo ufw enable', out: 'Rule added\n…\nFirewall is active and enabled on system startup' },
          { do: 'See the rules:', cmd: 'sudo ufw status numbered', out: '     To                         Action      From\n[ 1] 22/tcp                     ALLOW IN    Anywhere\n[ 2] 80/tcp                     ALLOW IN    Anywhere\n[ 3] 443/tcp                    ALLOW IN    Anywhere' }
        ],
        safety: 'On a cloud VM, always allow SSH (22) **before** enabling ufw, or you can lock yourself out. AWS explains security groups in its [security group guide](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html).'
      },
      links: [
        { href: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html', label: 'AWS security groups' },
        { href: 'https://help.ubuntu.com/community/UFW', label: 'Ubuntu ufw guide' }
      ],
      check: {
        q: 'Which inbound rule is the **safest** way to allow SSH to your EC2 instance?',
        options: ['Port 22 from 0.0.0.0/0', 'Port 22 from My IP (/32)', 'All ports from anywhere', 'Port 3389 from anywhere'],
        answer: 1,
        explain: 'Only your own IP should reach SSH. The website ports (80/443) are the ones open to everyone.'
      }
    },
    {
      id: 'lab-ping-ip',
      hook: 'Time to talk to the network directly. `ping` is literally the network saying “I’m alive”.',
      short: 'Lab: ping & ip addr',
      kicker: 'Practice',
      title: 'Practice: ping and ipconfig / ip addr',
      lead: 'Two commands every cloud engineer types daily: “is it reachable?” and “what’s my address?”',
      plain: '`ping` checks if a machine answers. `ip addr` (Linux) or `ipconfig` (Windows) shows your IP address, and `ip route` shows your gateway.',
      analogy: {
        type: 'electric',
        text: '`ping` is a sonar beep: send a pulse, time the echo. Fast echo = close and healthy. No echo = something’s off.'
      },
      jargon: [
        ['ICMP', 'the protocol `ping` uses.'],
        ['Latency', 'round-trip time in milliseconds (ms).'],
        ['Packet loss', 'percentage of pings with no reply.'],
        ['Interface', 'a network card, e.g. `enp0s3` or `Wi-Fi`.']
      ],
      demo: { id: 'demo-netterm', title: 'NETWORK LAB SIMULATOR', hint: 'Linux or Windows', intro: 'Practise every Episode 02 command safely. Switch between Linux (your VM) and Windows (lab PC). Run all six for a badge.', el: <NetTerminal /> },
      lab: {
        id: 'lab-ping',
        title: 'Find your addresses and test connectivity',
        goal: 'Run these on your **Ubuntu VM** (and the Windows version on a lab PC if you have one).',
        steps: [
          { do: 'Your IP address on Linux:', cmd: 'ip addr', out: '2: enp0s3: … inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic enp0s3' },
          { do: 'On Windows (Command Prompt), the same question:', cmd: 'ipconfig', out: 'IPv4 Address. . . : 192.168.1.5\nDefault Gateway . : 192.168.1.1' },
          { do: 'Your default gateway on Linux:', cmd: 'ip route', out: 'default via 10.0.2.2 dev enp0s3 proto dhcp metric 100' },
          { do: 'Ping your gateway, then a website (Ctrl + C to stop, or use -c 4):', cmd: 'ping -c 4 10.0.2.2\nping -c 4 google.com', out: '4 packets transmitted, 4 received, 0% packet loss' }
        ]
      },
      links: [
        { href: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig', label: 'ipconfig (Windows)' },
        { href: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ping', label: 'ping (Windows)' }
      ],
      check: {
        q: '`ping google.com` says **100% packet loss**, but `ping 10.0.2.2` works. Where is the problem?',
        options: ['Inside your VM’s network card', 'Somewhere beyond your gateway (router, ISP or DNS)', 'Your keyboard', 'Google deleted itself'],
        answer: 1,
        explain: 'You can reach your gateway, so your local side is fine. The issue is further out.'
      }
    },
    {
      id: 'lab-dns-curl',
      hook: 'Three commands, three superpowers: ask DNS, fetch a web page from the terminal, and see every router on the way.',
      short: 'Lab: nslookup, curl, traceroute',
      kicker: 'Practice',
      title: 'Practice: nslookup, curl and route tracing',
      lead: 'Debug the internet like a pro: check DNS, check the web server, and check the path in between.',
      plain: '`nslookup` asks DNS for an IP. `curl` talks HTTP from the terminal. `traceroute` (Linux) / `tracert` (Windows) lists every hop to a server.',
      analogy: {
        type: 'water',
        text: 'nslookup reads the map, curl knocks on the door, traceroute walks the whole pipe and notes every junction.'
      },
      jargon: [
        ['nslookup / dig', 'DNS lookup tools.'],
        ['curl -I', 'fetch only the HTTP headers (status code etc.).'],
        ['Hop', 'one router on the route.'],
        ['* * *', 'a hop that didn’t reply (often just ignoring traceroute).']
      ],
      lab: {
        id: 'lab-dns',
        title: 'DNS, HTTP and route tracing',
        goal: 'Run on your **Ubuntu VM**. Install the tools first if needed.',
        steps: [
          { do: 'Install the tools:', cmd: 'sudo apt install -y dnsutils traceroute curl' },
          { do: 'Ask DNS for an IP:', cmd: 'nslookup google.com', out: 'Name:\tgoogle.com\nAddress: 142.250.183.46' },
          { do: 'Fetch only the HTTP headers of a site:', cmd: 'curl -I https://example.com', out: 'HTTP/2 200\ncontent-type: text/html; charset=UTF-8' },
          { do: 'Trace the route (Windows: `tracert google.com`):', cmd: 'traceroute google.com', out: ' 1  _gateway (10.0.2.2)  0.4 ms\n 2  192.168.1.1  2.1 ms\n …\n 6  142.250.183.46  11.9 ms' },
          { do: 'Bonus: see what status code a missing page returns:', cmd: 'curl -I https://example.com/does-not-exist', out: 'HTTP/2 404' }
        ]
      },
      links: [{ href: 'https://curl.se/docs/manual.html', label: 'curl manual' }],
      check: {
        q: '`curl -I` on your site returns `HTTP/1.1 200 OK`. What does that prove?',
        options: ['DNS is broken', 'The web server is up and answering', 'The site is down', 'Your firewall blocks everything'],
        answer: 1,
        explain: '200 means the request reached the web server and it answered successfully.'
      }
    },
    {
      id: 'browser-to-server',
      hook: 'Final boss of networking knowledge: explain what happens when you press Enter. In under a minute.',
      short: 'Browser → server',
      kicker: 'Put it together',
      title: 'How a browser reaches a cloud server',
      lead: 'Everything from this episode, in order. This is the Day 1 takeaway: you can explain the whole path.',
      plain: 'Name → **DNS** → IP. Packet → **gateway / NAT** → **routers** → cloud **security group** → **TCP + TLS** on port 443 → **HTTP** request → **200 OK** back.',
      analogy: {
        type: 'water',
        text: 'One drop of water travelling from your tap, through your building’s pipes, the city mains, a treatment plant’s gate, and finally into the reservoir, then back.'
      },
      demo: { id: 'demo-journey', title: 'THE FULL JOURNEY', hint: 'step through', intro: 'Step through all eight stages. Then try explaining them to the person next to you without looking.', el: <JourneyStepper /> },
      links: [
        { href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', label: 'How HTTP works (MDN)' }
      ],
      check: {
        q: 'What happens **first** when you type a website name?',
        options: ['TCP handshake', 'DNS lookup', 'HTTP 200 OK', 'Security group check'],
        answer: 1,
        explain: 'Before anything can connect, the browser needs the IP address, so DNS comes first.'
      }
    }
  ],
  takeaway: {
    title: 'Current flowing. ⚡',
    text: 'Day 1 complete: you understand cloud basics, have a working lab, and can explain how a browser reaches a server. That’s literally the workshop’s Day 1 goal, achieved while LAGZILLA watched. In **Episode 03 · TIDE** you launch real cloud servers, compile code and deploy a web app.',
    checklist: [
      'I can tell public and private IPs apart',
      'I ran ping, ip addr / ipconfig, nslookup, curl and traceroute',
      'I enabled ufw on my Ubuntu VM',
      'I can explain browser → server in 8 steps'
    ]
  }
};
