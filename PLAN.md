# VOLTIDE: Finalised Plan (Cloud Computing)

Audience: **first-year B.Tech students with no background** (Gen Z / Gen Alpha). Topics follow the
**Cloud Computing Workshop** plan (`facilitator/reference/Cloud_Computing_Workshop.pdf`) exactly,
split into four episodes. No durations are shown to students. Each mission follows *hook → one-line summary →
analogy → jargon → explanation → visual/demo → guided lab → checkpoint*.

## Episode 01 · SPARK: Cloud from Zero + Setup 🔓 *(built · 13 missions)*
*(Workshop Day 1, Session 01: Cloud Computing + Setup)*

1. What the cloud really is (myth-buster cards)
2. Bits, bytes & data (binary light switches)
3. How the internet carries your data (animated packet pipes)
4. Cloud computing: what it is and why it matters
5. IaaS, PaaS and SaaS (service-model waterline + model matcher)
6. Public, private, hybrid and multi-cloud
7. Elasticity & pay-as-you-go (results-day auto-scaling simulator)
8. A quick history of the cloud (timeline)
9. Virtual machines vs containers
10. **Lab:** set up VirtualBox / VMware and Ubuntu
11. **Lab:** Linux terminal basics (practice terminal + real VM)
12. Quick tour: AWS, Azure and Google Cloud (equivalents table with links)
13. Cloud account safety: MFA, billing alerts, stop what you start

## Episode 02 · CURRENT: Computer Networks 🔒 *(built · 9 missions)*
*(Workshop Day 1, Session 02)* Understand how a user, a network and a cloud server communicate.
1. IP addresses: public vs private (hostel network map + IP checker)
2. DNS (animated lookup)
3. HTTP and HTTPS (HTTP inspector, status codes)
4. TCP, UDP and ports (handshake animation + port building)
5. Routers, gateways and NAT (NAT translator + packet layers)
6. Firewalls and cloud security groups (security group simulator + **lab:** ufw)
7. **Practice:** `ping` and `ipconfig` / `ip addr` (Linux / Windows simulator + real VM)
8. **Practice:** `nslookup`, `curl` and route tracing (`traceroute` / `tracert`)
9. Browser → server, the full journey

**Takeaway:** students can explain how a browser reaches a server. Boss: *Packet Loss*.

## Episode 03 · TIDE: Cloud Lab Practicals 🔒 *(built · 8 missions)*
*(Workshop Day 2, Session 03)*
1. Launch a VM: VirtualBox clone + AWS EC2 + SSH (EC2 launch practice)
2. Explore OS settings and VM resources (instance sizer + `uname`, `nproc`, `free`, `df`, `top`)
3. Install a C compiler and run a program (C playground + gcc lab)
4. Build and run a basic web application (mini web app + Flask lab)
5. Google App Engine / PaaS (IaaS vs PaaS deploy race + Cloud Shell lab)
6. EC2 storage and access rules (block / object / file storage, least-privilege grid, S3 lab)
7. Quick demos: serverless and Hadoop (upload → function, MapReduce word count, Linux pipes)
8. Quick demos: databases and chatbots (SQL vs NoSQL, campus chatbot, SQLite lab)

Boss: *Out of Memory*.

## Episode 04 · SURGE: Cloud Deployment Challenge 🔒 *(built · 8 missions)*
*(Workshop Day 2, Session 04)* Team up and turn the concepts into a working demo.
1. Form teams of 3–4 students (squad builder)
2. Build a portfolio or campus webpage (page builder with live preview + download)
3. Run it on a cloud VM (EC2 + nginx + scp, deploy pipeline)
4. Test access from another device (troubleshooting tree)
5. Secure it: restrict ports and protect credentials (security review + hardening lab)
6. Check logs and troubleshoot one issue (log detective + live logs)
7. Present a 3-minute live demo per team (rubric + demo timer)
8. Clean up every resource (clean sweep checklist linked to each console page)

**Flow:** BUILD → DEPLOY → SECURE → DEMO → CLEAN UP. **Takeaway:** every team demonstrates a working
application, explains its network path, and identifies basic security controls. Boss: *Final Form*.
Beating all four bosses and decoding all four transmissions unlocks the **Workshop Graduate** certificate.

## Keep it smooth (from the workshop plan)
Prepare VM images and sample code in advance. If cloud accounts or internet are unavailable, use a
local VM. **Stop or delete temporary cloud resources after the workshop.**

## Design notes

- **Audience:** Gen Z / Gen Alpha. Sarcastic-fun voice, one-line summaries, and a game layer to keep them
  for the whole session: the story (*LAGZILLA*, a monster that feeds on downtime, crashes the campus
  portal on results day), the mascot **Volty**, XP / ranks / combos, 33 badges across the four episodes, a secret transmission
  decrypted one fragment per mission, a timed boss fight per episode, and a profile with per-episode certificates and a final graduate certificate.
- **Shared PCs:** the profile page has two reset options: *Reset score* (XP and badges only, mission
  progress kept) and *Reset everything* (all progress, unlocks, handle and activity, for the next student).
- **Colours:** [shadcn/ui](https://github.com/shadcn-ui/ui) *Mist* dark theme as the base; accents from
  shadcn's Yellow, Blue, Teal/Cyan and Violet/Fuchsia scales (one per episode).
- **3D background:** custom three.js *Voltide World*: a point-cloud ocean with waves, lightning strikes
  that send ripple rings across the water (click anywhere to strike), a floating wireframe core and
  rising sparks; the camera follows the pointer and dives as you scroll. Lite mode swaps it for CSS.
- **3D motion scenes** (`src/three/`, three.js, lazy-loaded, paused off-screen, off in lite mode): home
  globe of cloud regions with packet arcs · Ep 01 cloud of light over server racks with lightning ·
  Ep 02 router mesh with pings hopping you → server · Ep 03 data-centre aisle fly-through with VMs
  booting · Ep 04 city lighting up as the deploy wave spreads · plus a 3D IaaS/PaaS/SaaS layer stack in
  Ep 01. Every scene reacts to the pointer and to taps.
- **React Bits effects:** Lightning (home hero), ElectricBorder, ClickSpark, DecryptedText,
  GlitchText, ShinyText, TextType, CountUp, SpotlightCard.
- **Not reachable from the build environment:** the Figma MCP (proxy refused, 403) and the 21st.dev
  MCP (not connected). React Bits and shadcn were used from their open-source GitHub repos instead.
