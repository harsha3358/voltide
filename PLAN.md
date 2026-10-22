# VOLTIDE: Finalised Plan (Cloud Computing)

Audience: **first-year B.Tech students with no background** (Gen Z / Gen Alpha). Topics follow the
**Cloud Computing Workshop** plan (`facilitator/reference/Cloud_Computing_Workshop.pdf`) exactly,
split into four episodes. No durations are shown to students. Each mission follows *hook → TL;DR →
analogy → jargon → explanation → visual/demo → guided lab → checkpoint*.

## Episode 01 · SPARK: Cloud from Zero + Setup 🔓 *(built)*
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

## Episode 02 · CURRENT: Computer Networks 🔒
*(Workshop Day 1, Session 02)* Understand how a user, a network and a cloud server communicate.
IP addresses: public vs private · DNS and HTTP / HTTPS · TCP / UDP and ports · routers, gateways and
NAT · firewalls and cloud security groups · **practice:** `ping` and `ipconfig` / `ip addr` ·
**practice:** `nslookup`, `curl` and route tracing (`traceroute` / `tracert`).
**Takeaway:** students can explain how a browser reaches a server.

## Episode 03 · TIDE: Cloud Lab Practicals 🔒
*(Workshop Day 2, Session 03)* Create / launch a Linux virtual machine · explore OS settings and VM
resources · install a C compiler and run a simple program · build and run a basic web application ·
demonstrate Google App Engine / PaaS · introduce AWS EC2, storage and access rules · quick demos:
serverless, Hadoop, databases and chatbots.

## Episode 04 · SURGE: Cloud Deployment Challenge 🔒
*(Workshop Day 2, Session 04)* Team up and turn the concepts into a working demo.
1. Form teams of 3–4 students.
2. Build a portfolio or campus webpage.
3. Run it on a VM or approved cloud environment.
4. Test access from another permitted device.
5. Secure it: restrict ports and protect credentials.
6. Check logs and troubleshoot one issue.
7. Present a 3-minute live demo per team.

**Flow:** BUILD → DEPLOY → SECURE → DEMO. **Takeaway:** every team demonstrates a working
application, explains its network path, and identifies basic security controls.

## Keep it smooth (from the workshop plan)
Prepare VM images and sample code in advance. If cloud accounts or internet are unavailable, use a
local VM. **Stop or delete temporary cloud resources after the workshop.**

## Design notes

- **Audience:** Gen Z / Gen Alpha. Sarcastic-fun voice, short TL;DRs, and a game layer to keep them
  for the whole session: the story (*LAGZILLA*, a monster that feeds on downtime, crashes the campus
  portal on results day), the mascot **Volty**, XP / ranks / combos, 11 badges, a secret transmission
  decrypted one fragment per mission, a timed boss fight per episode, and a profile with certificate.
- **Colours:** [shadcn/ui](https://github.com/shadcn-ui/ui) *Mist* dark theme as the base; accents from
  shadcn's Yellow, Blue, Teal/Cyan and Violet/Fuchsia scales (one per episode).
- **3D background:** custom three.js *Voltide World*: a point-cloud ocean with waves, lightning strikes
  that send ripple rings across the water (click anywhere to strike), a floating wireframe core and
  rising sparks; the camera follows the pointer and dives as you scroll. Lite mode swaps it for CSS.
- **React Bits effects:** Lightning (home hero), ElectricBorder, ClickSpark, DecryptedText,
  GlitchText, ShinyText, TextType, CountUp, SpotlightCard.
- **Not reachable from the build environment:** the Figma MCP (proxy refused, 403) and the 21st.dev
  MCP (not connected). React Bits and shadcn were used from their open-source GitHub repos instead.
