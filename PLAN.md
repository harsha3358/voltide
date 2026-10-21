# VOLTIDE: Finalised Plan

Audience: **first-year B.Tech students with no background**. Every session is a full block of
instruction (no durations are shown to students). Each topic follows *plain words → analogy →
jargon → explanation → visual/demo → guided lab → checkpoint*.

## Session 01 · SPARK: Foundations from Zero 🔓 *(built)*

1. What is cybersecurity? (myth vs reality cards)
2. Bits, bytes & data (binary light-switch demo)
3. How the internet moves your data (animated packet pipes)
4. **Cloud computing from zero**: what and why, IaaS/PaaS/SaaS, public/private/hybrid, AWS/Azure/GCP tour, shared responsibility (service-model "waterline" stack) *(from the cloud workshop)*
5. Why it matters: WannaCry, Equifax, AIIMS Delhi (incident timeline)
6. The CIA triad + AAA (interactive triangle)
7. Threats, vulnerabilities & risk (risk voltmeter)
8. Who attacks and why (threat-actor cards)
9. The malware zoo (flip cards)
10. Social engineering & phishing (phish spotter, X-ray lens, homoglyph illusion)
11. Passwords, hashing & MFA (strength tester + SHA-256 avalanche)
12. Cyber law & ethics in India: IT Act, DPDP Act 2023, CERT-In, 1930 (allowed-or-not quiz)
13. Personal cyber-hygiene (shield builder)
14. Build your safe virtual lab: VirtualBox/VMware, Kali, Ubuntu, host-only network, **VMs vs containers** (lab)
15. The Linux terminal from zero, including OS settings and VM resources (practice terminal + real lab)

## Session 02 · CURRENT: Networks & Network Defense 🔒

How networks are built · IP addresses (public vs private), MAC & ports · **routers, gateways & NAT** ·
packets, TCP/UDP and the handshake · DNS · HTTP vs HTTPS · reading traffic with Wireshark in your
own lab · mapping your own lab with Nmap (guided) · common network threats, explained conceptually
with their defenses · firewalls (ufw) and **cloud security groups** · VPN, Wi-Fi security,
segmentation and Zero Trust · **network commands lab**: `ping`, `ip addr` / `ipconfig`, `nslookup`,
`curl`, `traceroute` / `tracert` *(from the cloud workshop)*.

## Session 03 · TIDE: Build, Encrypt & Secure the Web 🔒

**Build it** *(from the cloud workshop)*: launch a Linux VM, explore OS settings and resources,
install a C compiler and run a program, build and run a basic web application.
**Cloud tour**: PaaS with Google App Engine, AWS EC2, storage and access rules (IAM, least
privilege), quick demos of serverless, Hadoop, databases and chatbots, each with its main security
risk. **Then secure it**: ciphers & steganography · symmetric vs public-key crypto · hashes,
signatures & certificates · cookies & sessions · OWASP Top 10 (concepts and secure-coding fixes) ·
secure-coding checklist.

## Session 04 · SURGE: Defenders, Incidents & Capstone 🔒

The blue team & SOC · logs as security cameras · reading logs like a defender · the cyber kill
chain · incident response (NIST lifecycle) · digital forensics basics · cloud & AI security ·
careers roadmap · warm-up CTF (puzzle-style, in-browser).

**Capstone: Secure Cloud Deployment Challenge** *(from the cloud workshop)*
1. Form teams of 3–4 students.
2. Build a portfolio or campus webpage.
3. Run it on a VM or an approved cloud environment.
4. Test access from another permitted device.
5. Secure it: restrict ports (security group / ufw) and protect credentials (no secrets in code).
6. Check the logs and troubleshoot one issue.
7. Present a 3-minute live demo: what you built, its network path, and its security controls.

**Flow:** BUILD → DEPLOY → SECURE → DEMO. Stop or delete temporary cloud resources afterwards.

## Suggested changes (adopted)

- ➕ Session 01 begins from absolute zero (bits, packets) because the audience are freshers.
- ➕ India-specific law and helplines; a personal cyber-hygiene topic with immediate value.
- ➕ AI in security (deepfakes, prompt injection) and a capstone CTF for engagement.
- ➖ Malware reverse engineering and live Wi-Fi cracking are left out (too advanced, and legally
  risky on campus networks). Attack topics stay **conceptual and defense-focused**; hands-on work
  happens only in isolated, self-owned labs.
- Kill chain moves to Session 04 next to incident response.
- ➕ **Cloud Computing Workshop topics merged in** (cloud basics → S01, networking practice → S02,
  cloud lab practicals → S03, deployment challenge → S04 capstone), each with a security angle.

## Design notes

- **Audience:** Gen Z / Gen Alpha. Sarcastic-fun voice, short TL;DRs, and a game layer to keep them for the whole session: the story (*Operation VOLTIDE* vs the rogue AI **NULLSURGE**), the mascot **Volty**, XP / ranks / combos, 13 badges, a secret transmission decrypted one fragment per mission, a timed boss fight per episode, and a profile with handle and certificate.
- **Colours:** [shadcn/ui](https://github.com/shadcn-ui/ui) *Mist* dark theme as the base; accents from shadcn's Yellow, Blue, Teal/Cyan and Violet/Fuchsia scales (one per episode).
- **3D background:** custom three.js *Voltide World*: a point-cloud ocean with real waves, lightning strikes that send ripple rings across the water (click anywhere to strike), a floating wireframe NULLSURGE core and rising sparks; the camera follows the pointer and dives as you scroll. Each episode has its own palette and mood. Lite mode swaps it for CSS.
- **Not reachable from the build environment:** the Figma MCP (proxy refused, 403) and the 21st.dev MCP (not connected). React Bits and shadcn were used from their open-source GitHub repos instead.

- **React Bits effects:** Lightning (home hero), ElectricBorder, ClickSpark, DecryptedText, GlitchText, ShinyText, TextType, CountUp, SpotlightCard.
- **ui-ux-pro-max** (query "cybersecurity platform dark technical") returned *Cyberpunk UI /
  OLED dark*: neon glow, glitch, scanlines, status colours. That matches this build. Applied
  checklist items: SVG icons instead of emoji in diagrams, 44px touch targets, visible focus,
  reduced-motion support, 4.5:1 contrast. (Its first query misrouted to a children's style and was
  discarded, per the skill's own retry rule.)
- **taste-skill** house rules (no glows, gradients, monospace or emoji) conflict with the requested
  electric/water VFX theme, so the brief wins there. Its craft laws are applied: one h1 per page,
  headlines of at most two lines, body text in full ink at 16px or more, one live demo per topic, and
  equal margins.
